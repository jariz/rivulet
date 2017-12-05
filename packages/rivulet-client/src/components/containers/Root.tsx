import * as React from 'react';
import {Provider} from 'react-redux';
import { Router, Route, browserHistory } from 'react-router'
import thunk from 'redux-thunk';

import reducer,{AppContext} from '../../reducers';
import App from './App';
import ProductList from './ProductList';
import ListItems from './ListItems';

const Root: React.StatelessComponent<AppContext> = ({store}) =>
(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <Route path='/products' component={ProductList}/>
        <Route path='/list' component={ListItems}/>
      </Route>
    </Router>
  </Provider>
      );

export default Root;
