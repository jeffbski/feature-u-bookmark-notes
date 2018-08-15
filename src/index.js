import ReactDOM from 'react-dom';
import {launchApp} from 'feature-u';
import {createReducerAspect}  from 'feature-redux';
import {createLogicAspect} from 'feature-redux-logic';
import features from './features';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const aspects = [
  createReducerAspect(),
  createLogicAspect()
];

launchApp({
  aspects,
  features,
  registerRootAppElm(rootAppElm) {
    ReactDOM.render(rootAppElm, document.getElementById('root'));
    registerServiceWorker();
  }
});
