import { EntityState, createAdapter } from '../src/EntityAdapter';

type TestEntity = { id: string; name: string };

// fixtures
const testStateToAdd = [
  {
    id: 'test-id',
    name: 'test-name',
  },
  {
    id: 'test-id2',
    name: 'test-name2',
  },
  {
    id: 'test-id3',
    name: 'test-name3',
  },
];

describe('EntityAdapter', () => {
  describe('createAdapter', () => {
    it('should create an adapter', () => {
      const adapter = createAdapter('id');
      expect(adapter).toBeDefined();
    });
    it('should throw an error if no adapterId is provided', () => {
      expect(() => createAdapter('')).toThrowError('adapterId is required, this is the key for the entity, generally the value will be "id"');
    });
  });
  describe('addOne', () => {
    it('should add one entity', () => {
      const state: EntityState<TestEntity> = {
        ids: [],
        entities: {},
      };

      const adapter = createAdapter('id');

      adapter.addOne(state, {
        id: 'test-id',
        name: 'test-name',
      });

      expect(state.ids).toEqual(['test-id']);
      expect(state.entities).toEqual({ 'test-id': { id: 'test-id', name: 'test-name' } });
    });
    it('should add one entity with a nested id', () => {
      const state: EntityState<TestEntity> = {
        ids: [],
        entities: {},
      };

      const adapter = createAdapter('nested.id');

      adapter.addOne(state, {
        nested: {
          id: 'test-id',
        },
        name: 'test-name',
      });

      expect(state.ids).toEqual(['test-id']);
      expect(state.entities).toEqual({ 'test-id': { nested: { id: 'test-id' }, name: 'test-name' } });
    });
    it('should overwrite matching ids', () => {
      const state: EntityState<TestEntity> = {
        ids: [],
        entities: {},
      };

      const adapter = createAdapter('id');

      adapter.addOne(state, {
        id: 'test-id',
        name: 'test-name',
      });

      adapter.addOne(state, {
        id: 'test-id',
        name: 'test-name-updated',
      });

      expect(state.ids).toEqual(['test-id']);
      expect(state.entities).toEqual({ 'test-id': { id: 'test-id', name: 'test-name-updated' } });
    });
  });
  describe('addMany', () => {
    it('should add many entities', () => {
      const state: EntityState<TestEntity> = {
        ids: [],
        entities: {},
      };

      const adapter = createAdapter('id');

      adapter.addMany(state, testStateToAdd);

      expect(state.ids).toEqual(['test-id', 'test-id2', 'test-id3']);
      expect(state.entities).toEqual({
        'test-id': { id: 'test-id', name: 'test-name' },
        'test-id2': { id: 'test-id2', name: 'test-name2' },
        'test-id3': { id: 'test-id3', name: 'test-name3' },
      });
    });
    it('should overwrite matching ids', () => {
      const state: EntityState<TestEntity> = {
        ids: [],
        entities: {},
      };

      const adapter = createAdapter('id');

      adapter.addMany(state, testStateToAdd);

      // add again, appending "-updated" to the name
      adapter.addMany(
        state,
        testStateToAdd.map((entity) => ({ ...entity, name: `${entity.name}-updated` }))
      );

      expect(state.ids).toEqual(['test-id', 'test-id2', 'test-id3']);
      expect(state.entities).toEqual({
        'test-id': { id: 'test-id', name: 'test-name-updated' },
        'test-id2': { id: 'test-id2', name: 'test-name2-updated' },
        'test-id3': { id: 'test-id3', name: 'test-name3-updated' },
      });
    });
  });
  describe('clear', () => {
    it('should clear', () => {
      const state: EntityState<TestEntity> = {
        ids: [],
        entities: {},
      };

      const adapter = createAdapter('id');

      adapter.addMany(state, testStateToAdd);

      adapter.clear(state);
      expect(state.entities).toEqual({});
      expect(state.ids).toEqual([]);
    });
  });
  describe('getAll', () => {
    it('should get', () => {
      const state: EntityState<TestEntity> = {
        ids: [],
        entities: {},
      };

      const adapter = createAdapter('id');

      adapter.addMany(state, testStateToAdd);

      expect(adapter.getSelectors().getAll(state)).toEqual(testStateToAdd);
    });
  });
  describe('getById', () => {
    it('should get', () => {
      const state: EntityState<TestEntity> = {
        ids: [],
        entities: {},
      };

      const adapter = createAdapter('id');

      adapter.addMany(state, testStateToAdd);

      expect(adapter.getSelectors().getById(state)('test-id')).toEqual({ id: 'test-id', name: 'test-name' });
    });
  });
});
