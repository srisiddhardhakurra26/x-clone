import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import HomePage from './components/HomePage';
import Register from './components/register';
import Login from './components/login';
import Navigation from './components/navigation';
import TweetForm from './components/tweetForm';
import UserProfile from './components/userprofile';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Register} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/navigation" component={Navigation} />
        <Route path="/profile/:username" component={UserProfile} />
        <Route path="/tweetForm" component={TweetForm} />
      </Switch>
    </Router>
  );
}

export default App;
