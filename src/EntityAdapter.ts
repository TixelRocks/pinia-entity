export interface Entity<T> {
  [id: string]: T;
}

export interface EntityState<T> {
  ids: string[];
  entities: Entity<T>;
}

export function createAdapter<T>(adapterId: string) {
  if (!adapterId) {
    throw new Error('adapterId is required, this is the key for the entity, generally the value will be "id"');
  }
  function addOne(state: EntityState<T>, entity: T): void {
    const entityId = (entity as Record<string, string>)[adapterId];
    state.entities = {
      ...state.entities,
      [entityId]: entity,
    };
    state.ids.push(entityId);
  }
  function addMany(state: EntityState<T>, entities: T[]): void {
    entities.forEach((entity) => addOne(state, entity));
  }
  function clear(state: EntityState<T>) {
    state.ids = [];
    state.entities = {};
  }

  const getAll =
    (state: EntityState<T>): (() => T[]) =>
    (): T[] => {
      return Object.values(state.entities);
    };

  const getById =
    (state: EntityState<T>): ((id: string) => T) =>
    (id: string): T =>
      state.entities?.[id];

  return {
    addOne,
    addMany,
    clear,
    getSelectors: () => ({
      getAll,
      getById,
    }),
  };
}
