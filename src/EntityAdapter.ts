import { flatten } from 'flat';

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
    const entityId = flatten<T, Record<string, string>>(entity)[adapterId];
    state.entities = {
      ...state.entities,
      [entityId]: entity,
    };
    if (!state.ids.includes(entityId)) {
      state.ids.push(entityId);
    }
  }
  function addMany(state: EntityState<T>, entities: T[]): void {
    entities.forEach((entity) => addOne(state, entity));
  }
  function prependOne(state: EntityState<T>, entity: T): void {
    const entityId = flatten<T, Record<string, string>>(entity)[adapterId];
    delete state.entities[entityId];

    state.entities = {
      [entityId]: entity,
      ...state.entities,
    };
    if (!state.ids.includes(entityId)) {
      state.ids.unshift(entityId);
    }
  }
  function clear(state: EntityState<T>) {
    state.ids = [];
    state.entities = {};
  }

  const getAll = (state: EntityState<T>): T[] => {
    return Object.values(state.entities);
  };

  const getById =
    (state: EntityState<T>): ((id: string) => T) =>
    (id: string): T =>
      state.entities?.[id];

  return {
    addOne,
    addMany,
    prependOne,
    clear,
    getSelectors: () => ({
      getAll,
      getById,
    }),
  };
}
