import React from 'react';
import {createFeature} from 'feature-u';
import { BrowserRouter } from 'react-router-dom';
import {camelCase} from 'lodash/fp';
import './app.css';

// make sure featureName is camelCased so works well with
// redux-actions and property names
const featureName = camelCase('app');

const App = ({ KeyAndLinkComps, KeyAndRouteComps }) => <BrowserRouter>
  <div className="app">
    <header>
    <h1>Bookmark Notes</h1>
      { KeyAndLinkComps.map(([key, LinkComp]) => <LinkComp key={key}/>) }
    </header>
    <main>
      { KeyAndRouteComps.map(([key, RouteComp]) => <RouteComp key={key}/>) }
    </main>
  </div>
</BrowserRouter>;


export default createFeature({
  name: featureName,

  fassets: {
    use: [
      ['*.link.comp', { required: false }],
      ['*.route.comp', { required: false }]
    ]
  },

  appWillStart({fassets, curRootAppElm}) {
    // it is good to check that we are not overriding an existing one
    if (curRootAppElm) { throw new Error('app feature is defining curRootAppElm but one was already provided'); }

    const KeyAndLinkComps = fassets.get('*.link.comp@withKeys');
    const KeyAndRouteComps = fassets.get('*.route.comp@withKeys');
    return <App KeyAndLinkComps={KeyAndLinkComps} KeyAndRouteComps={KeyAndRouteComps} />;
  }

});
