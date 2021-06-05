import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Profile from './Profile';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom"

ReactDOM.render(
<div>
<Router>
  <Switch>
  <Route exact path="/" component={App}/>

    <Route path="/profile/:userid" component={Profile}/>
  </Switch>
</Router>

</div>
  ,
  document.getElementById('root')
);

