import React from 'react';
import {createFeature} from 'feature-u';
import { Link, Route } from 'react-router-dom';
import {camelCase} from 'lodash/fp';

// make sure featureName is camelCased so works well with
// redux-actions and property names
const featureName = camelCase('about');
const featureURLPath = `/${featureName}`; // the URL path is /foo

const link = () => <Link to={featureURLPath}>About</Link>;

const component = () => <Route path={featureURLPath} render={() =>
  <div>This would be about content here</div>
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
