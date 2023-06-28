# Installation

```
npm install @tixel/pinia-entity -D
```

# Usage

In the example below, the name of the Entity is `Entity`. This could be replaced for `User`, `Post`, `Comment`, etc.

**EntityStore.ts**
```typescript
import { EntityState, createAdapter } from '@tixel/pinia-entity';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { YourEntity } from '~/types/YourEntity';

export type EntityStoreState = EntityState<YourEntity>;
const adapter = createAdapter<YourEntity>('id');
const { getAll, getById } = adapter.getSelectors();

export const useEntityStore = defineStore('EntityStore', {
  state(): EntityStoreState {
    return {
      ids: [],
      entities: {},
    };
  },
  actions: {
    async fetch(id: string): Promise<YourEntity> {
      const yourEntity = useFetch(); // get your entity

      adapter.addOne(this.$state, yourEntity);
      return yourEntity;
    },
  },
  getters: {
    getAll,
    getById
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEntityStore, import.meta.hot));
}
```

