import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import './css/tweetForm.css'; // Import your custom CSS file
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserProfile from './userprofile'; // Import the UserProfile component

function TweetForm() {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 280; // Set your character limit

  const loggedInUsername = localStorage.getItem('username');

  const fetchTweets = async () => {
    try {
      const response = await fetch('/api/getTweets');
      if (response.ok) {
        const data = await response.json();
        setTweets(data);
      } else {
        console.error('Failed to fetch tweets');
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleTweetChange = (e) => {
    const newTweet = e.target.value;
    setTweet(newTweet);
    setCharCount(newTweet.length);
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
      const username = localStorage.getItem('username');
      const response = await fetch('/api/postTweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken,
        },
        body: JSON.stringify({ text: tweet, username: username }),
      });

      if (response.ok) {
        console.log('Tweet posted');
        fetchTweets();
        setTweet('');
        setCharCount(0);
      } else {
        console.error('Tweet posting failed');
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  const handleDeletePost = async (postId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`/api/deleteTweet/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken,
          'x-username': loggedInUsername,
        },
      });
  
      if (response.ok) {
        console.log('Tweet deleted');
        fetchTweets();
      } else {
        const errorMessage = await response.text();
        console.error(`Tweet deletion failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  const getCharCountStyle = () => {
    let textColor = 'text-info'; // Default color
    if (charCount > maxCharCount * 0.8) {
      textColor = 'text-danger'; // Red color when approaching the limit
    } else if (charCount > maxCharCount * 0.6) {
      textColor = 'text-warning'; // Orange color when reaching 60% of the limit
    }
    return `mt-2 ${textColor}`;
  };

const isPostButtonDisabled = tweet.trim() === ''; // Check if tweet is empty or contains only whitespace

return (
  <Router>
  <div className="bg-dark text-light min-vh-100">
    <div className="container mt-4 p-4">
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-light">Compose Post</h2>
          <form onSubmit={handleTweetSubmit}>
            <div className="mb-3">
              <textarea
                value={tweet}
                onChange={handleTweetChange}
                className="form-control bg-dark text-light"
                placeholder="What's happening?"
                maxLength={maxCharCount}
                rows={4}
              />
            </div>
            <div className={getCharCountStyle()}>
              {charCount}/{maxCharCount}
            </div>
            <button type="submit" className={`btn btn-primary mt-2 ${isPostButtonDisabled ? 'disabled' : ''}`} disabled={isPostButtonDisabled}>
              Post
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <h2 className="text-light">Posts</h2>
          <div>
          {tweets.map((tweet) => (
            <div key={tweet._id} className="card mb-3 bg-dark text-light">
              <div className="card-body">
                <h5 className="card-title">
                  {/* Link to the user profile using React Router */}
                  <span className="username font-weight-bold" style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/profile/${tweet.author}`}>
                        {tweet.author}
                  </span>
                  {/* <span className="username font-weight-bold">{tweet.author}</span> */}
                  <small className="text-muted timestamp">
                    {' '}
                    <span className="text-light">{' '}{new Date(tweet.timestamp).toLocaleString()}</span>
                  </small>
                </h5>
                <p className="card-text post-content" dangerouslySetInnerHTML={{ __html: tweet.text.replace(/\n/g, '<br>') }} />

                {/* Conditionally render the Delete button */}
                {tweet.author === loggedInUsername && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleDeletePost(tweet._id)}
                >
                  Delete
                </button>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
      {/* Define the route for the UserProfile component */}
      <Switch>
            <Route path="/profile/:username" component={UserProfile} />
          </Switch>
      <div className="row mt-3">
        <div className="col-md-6">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
  </Router>
);
}

export default TweetForm;
