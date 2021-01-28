import React from 'react';
import './App.css';
import Login from './components/user/Login';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import Register from './components/user/Register';
import { useSelector } from 'react-redux';
import VactionList from './components/vacations/VactionList';
import AppBarComp from './components/vacations/AppBarComp';
import AddVacation from './components/vacations/AddVacation';
import Charts from './components/vacations/Chart'

function App() {
  const user = useSelector(state => state.LoginReducer)
  return (
    <Router>
      <AppBarComp />
      <div className="App">
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/add" component={AddVacation} />
        <Route path="/charts" >
          {!user.login ? <Redirect to="/login" /> : <Charts />}
        </Route>
        <Route exact path="/">
          {!user.login ? <Redirect to="/login" /> : <VactionList />}
        </Route>
      </div>
    </Router>
  );
}

export default App;
