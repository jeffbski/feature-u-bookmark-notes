import React from 'react';
import {createFeature} from 'feature-u';
import { Link, Route } from 'react-router-dom';

const featureName = 'about';
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
