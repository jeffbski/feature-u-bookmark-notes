import React from 'react';
import {createFeature, withFassets} from 'feature-u';
import { Link, Route, withRouter } from 'react-router-dom';
import { withFormik, Form, Field } from 'formik';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as yup from 'yup';
import {camelCase} from 'lodash/fp';
import './add.css';

// make sure featureName is camelCased so works well with
// redux-actions and property names
const featureName = camelCase('add');
const featureURLPath = `/${featureName}`;

const link = () => <Link to={featureURLPath}>Add</Link>;

const initialValues = {
  url: '',
  tags: '',
  notes: ''
};

const schema = yup.object().shape({
  url: yup.string().required().matches(/https?:\/\/.+/, 'URL must begin with http(s)'),
  tags: yup.string(),
  notes: yup.string()
});

const MyForm = ({errors, isSubmitting}) => <Form className="addForm">
  <section className="errors">{ Object.values(errors).map(e => <div>{e}</div>) }</section>
  <label className="url-label">URL</label><Field name="url" className="url-field"/>
  <label className="tags-label">Tags</label><Field name="tags" className="tags-field"/>
  <label className="notes-label">Notes</label><Field name="notes" component="textarea" className="notes-field"/>
  <button type="submit" disabled={isSubmitting} className="add-button">Submit</button>
</Form>;

const CMyForm = compose(
  withRouter, // provides history prop
  withFassets({ mapFassetsToProps: { listActions: 'list.actions' }}),
  connect(null, (dispatch, {listActions}) => ({
    mysubmit: values => dispatch(listActions.add(values))
  })),
  withFormik({
    mapPropsToValues: () => initialValues,
    validationSchema: schema,
    handleSubmit: (values, {props: {mysubmit, history}}) => {
      mysubmit(values);
      history.replace('/list');
    }
  })
)(MyForm)

const component = () => <Route path={featureURLPath} render={() =>
  <CMyForm />}/>;

export default createFeature({
  name: featureName,

  fassets: {
    use: [
      'list.actions'
    ],

    defineUse: {
      [`${featureName}.link.comp`]: link,
      [`${featureName}.route.comp`]: component
    }
  }

});
