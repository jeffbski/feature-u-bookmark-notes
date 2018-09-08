import {createFeature, expandWithFassets} from 'feature-u';
import { createLogic } from 'redux-logic';
import localforage from 'localforage';
import { createActions } from '@jeffbski/redux-util';

// make sure featureName is camelCased so works well with
// redux-actions and property names
const featureName = 'loadSaveLocalForage';

// we just need an identity payload action creator in our namespace
const actions = createActions('saved', { prefix: featureName });

const itemStore = localforage.createInstance({
  name: 'bookmark-notebook',
  storeName: 'items'
});

// wrap with expandWithFassets so we can use fassets.list.actions
const logic = expandWithFassets(fassets => {
  const listActions = fassets.list.actions;
  return [
    createLogic({
      name: `${featureName}.load`,
      type: listActions.load,
      latest: true,
      processOptions: {
        successType: listActions.loadSuccess,
        failType: listActions.loadFailed
      },
      async process(){
        const keys = await itemStore.keys();
        const items = await Promise.all(keys.map(k => itemStore.getItem(k)));
        return items; // return items, it will be dispatched in loadSuccess
      }
    }),
    createLogic({
      name: `${featureName}.save`,
      type: [listActions.add, listActions.remove],
      latest: true,
      processOptions: {
        successType: actions.saved,
        failType: listActions.loadFailed
      },
      async process({ getState, fassets }){
        const items = fassets.list.selectors.items(getState());
        await itemStore.clear();
        await Promise.all(items.map((item, i) => itemStore.setItem(`${i}`, item)));
        return;
      }
    }),
  ];
});

export default createFeature({
  name: featureName,

  logic,

  fassets: {
    use: [
      'list.actions',
      'list.selectors'
    ]
  },

  appDidStart({ fassets, dispatch }) {
    const listActions = fassets.list.actions;
    dispatch(listActions.load());
  }
});
