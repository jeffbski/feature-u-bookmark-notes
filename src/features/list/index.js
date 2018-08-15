import React from 'react';
import {createFeature} from 'feature-u';
import {slicedReducer} from 'feature-redux';
import { Link, Route } from 'react-router-dom';
import { createActions, handleActions } from 'redux-actions';
import { get, set, update, compose, camelCase } from 'lodash/fp';
import { connect } from 'react-redux';
import './list.css';

// make sure featureName is camelCased so works well with
// redux-actions and property names
const featureName = camelCase('list');
const featureURLPath = `/${featureName}`;
const statePath = `${featureName}`; // where to mount reducer in global state

const initialState = {
  items: [],
  filter: '',
  err: null
};

const selectors = {
  main: get(statePath),
  items: get(`${statePath}.items`),
  filter: get(`${statePath}.filter`)
};

const actions = createActions({
  [featureName]: {
    add: item => item,
    remove: item => item,
    load: () => null,
    loadSuccess: items => items,
    loadFailed: err => err,
    filterChange: filter => filter
  }
})[featureName];

const reducer = handleActions({
  [actions.add]: (state, action) => {
    const newItem = action.payload;
    return update('items', items =>
      items
        .filter(x => x.url !== newItem.url)
        .concat(newItem),
      state);
  },
  [actions.remove]: (state, action) => {
    const removeItem = action.payload;
    return update('items', items =>
      items
        .filter(x => x.url !== removeItem.url),
      state);
  },
  [actions.loadSuccess]: (state, action) =>
    compose(
      set('items', action.payload),
      set('err', null)
    )(state),
  [actions.loadFailed]: (state, action) => {
    console.error('load failed', action.payload);
    return compose(
      set('items', []),
      set('err', action.payload)
    )(state);
  },
  [actions.filterChange]: (state, action) =>
    set('filter', action.payload, state)
}, initialState);

const link = () => <Link to={featureURLPath}>List</Link>;

function selectAndFilterItems(filter, items) {
  if (!filter) { return items; } // unfiltered
  const lcFilter = filter.toLowerCase();
  return items.filter(item =>
    item.url.toLowerCase().includes(lcFilter) ||
    item.tags.toLowerCase().includes(lcFilter) ||
    item.notes.toLowerCase().includes(lcFilter));
}

const Items = ({items, onRemove, onFilterChange}) => <section>
<label>Search</label><input onChange={({target: {value}}) => onFilterChange(value)} name="filter"/>
<ol className="list">
{items.map(item => <li key={item.url}>
  <section className="item">
      <a href={item.url} target="_blank" className="url">{item.url}</a>
      <span className="tags">{item.tags}</span>
      <button onClick={() => onRemove(item)} className="removeButton">Remove</button>
    <section className="notes">{item.notes}</section>
  </section>
  </li>)}
</ol>
</section>;

const CItems = connect(
  state => ({
    'items': selectAndFilterItems(selectors.filter(state), selectors.items(state))
  }),
  {
    onRemove: actions.remove,
    onFilterChange: actions.filterChange
  }
)(Items);

const component = () => <Route path={featureURLPath} render={() =>
  <CItems/>
}/>;



export default createFeature({
  name: featureName,

  reducer: slicedReducer(statePath, reducer),

  fassets: {
    define: {
      [`${featureName}.actions`]: actions,
      [`${featureName}.selectors`]: selectors
    },
    defineUse: {
      [`${featureName}.link.comp`]: link,
      [`${featureName}.route.comp`]: component
    }
  }

});
