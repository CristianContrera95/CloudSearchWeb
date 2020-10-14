import React, { Component } from 'react';
import { Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import AppliedRoute from './routes/AppliedRoute';
import BaseApp from "./components/Base/BaseApp";


class App extends Component {

  render() {
    return (
        <div className="bg-white" id="page-container">
          <BrowserRouter forceRefresh={true} >
            <Switch>
              <AppliedRoute path="/" name="BaseApp" component={BaseApp} />
            </Switch>
          </BrowserRouter>
        </div>
    );
  }
}

export default App;
