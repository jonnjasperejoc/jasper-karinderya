import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import { Provider } from 'react-redux';
import store from './store';

import FoodList from './components/FoodList';
import Login from './components/Login';
import Users from './components/Users';
import Signup from './components/Signup';
import NotFound from './components/NotFound';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Router>
            <Switch>
              <Route path="/" component={Login} exact={true} />
              <Route path="/signup" component={Signup} />
              <Route path="/foods" component={FoodList} />
              <Route path="/users" component={Users} />
              <Route component={NotFound} />
            </Switch>
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App;
