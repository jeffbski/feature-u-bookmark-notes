import React from 'react';
import {createFeature} from 'feature-u';
import { Link, Route } from 'react-router-dom';
import {camelCase} from 'lodash/fp';
import features from '../index';

// make sure featureName is camelCased so works well with
// redux-actions and property names
const featureName = camelCase('home');

const link = () => <Link to="/">Home</Link>;

const component = () => <Route exact path="/" render={props => <div>
  <div>Features</div>
  <ul>
    { features.map(f => <li key={f.name}>{f.name}</li>) }
  </ul>
</div>
}/>;

export default createFeature({
  name: featureName,

  fassets: {
    defineUse: {
      [`${featureName}.link.comp`]: link,
      [`${featureName}.route.comp`]: component
    }
  }

});
