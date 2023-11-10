import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles

function TweetForm() {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 280; // Set your character limit

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

  const getCharCountStyle = () => {
    let textColor = 'text-info'; // Default color
    if (charCount > maxCharCount * 0.8) {
      textColor = 'text-danger'; // Red color when approaching the limit
    } else if (charCount > maxCharCount * 0.6) {
      textColor = 'text-warning'; // Orange color when reaching 60% of the limit
    }
    return `mt-2 ${textColor}`;
  };

  return (
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
              <button type="submit" className="btn btn-primary mt-2">
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
                    <h5 className="card-title">User: {tweet.author}</h5>
                    <p className="card-text">Post: {tweet.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetForm;