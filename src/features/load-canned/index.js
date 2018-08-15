import {createFeature, expandWithFassets} from 'feature-u';
import { createLogic } from 'redux-logic';
import {camelCase} from 'lodash/fp';

const featureName = camelCase('load-canned');

const cannedList = [
  { url: 'https://codewinds.com/', tags: 'functional, training', notes: 'My site' },
  { url: 'https://2018.jsconf.us/', tags: 'awesome, conference', notes: 'Always great!' }
];

// wrap with expandWithFassets so we can use fassets.list.actions
const logic = expandWithFassets(fassets => {
  const listActions = fassets.list.actions;
  return [  // array of logic
    createLogic({
      name: `${featureName}.load`,
      type: listActions.load,
      latest: true,
      processOptions: {
        successType: listActions.loadSuccess,
        failType: listActions.loadFailed
      },
      async process(){
        return cannedList;
      }
    })
  ];
});

export default createFeature({
  name: featureName,

  logic,

  fassets: {
    use: [
      'list.actions'
    ]
  },

  appDidStart({ fassets, dispatch }) {
    const listActions = fassets.list.actions;
    dispatch(listActions.load());
  }
});
