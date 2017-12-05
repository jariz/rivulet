import * as React from 'react';
import {render} from 'react-dom';
import configureStore from './configureStore'
import Root from './components/containers/Root';

import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';


const store = configureStore();
render(
    <Root store={store}/>,
    document.getElementById("root")
);