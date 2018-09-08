import React from 'react';
import {createFeature} from 'feature-u';
import { Link, Route } from 'react-router-dom';
import features from '../index';

const featureName = 'home';

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
