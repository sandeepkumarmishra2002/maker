import React, {Component} from 'react';
import ToDo from './src/container/ToDo/ToDo';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './src/store/store';

const store = createStore(reducer);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <ToDo />
            </Provider>
        );
    }
}

