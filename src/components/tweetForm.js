import React, { useState, useEffect } from 'react';

function TweetForm() {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]); // State variable to store tweets

  // Function to fetch tweets from the server
  const fetchTweets = async () => {
    try {
      const response = await fetch('/api/getTweets'); // Replace with the actual endpoint
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
    // Fetch tweets when the component loads
    fetchTweets();
  }, []);

  const handleTweetChange = (e) => {
    setTweet(e.target.value);
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken'); // Get the token from localStorage
      const username = localStorage.getItem('username'); // Get the username from localStorage
      // Make an API call to post the tweet using the 'tweet' state
      const response = await fetch('/api/postTweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken, // Include the authentication token in the headers
        },
        body: JSON.stringify({ text: tweet, username: username }), // Ensure 'tweet' is correctly formatted
      });

      if (response.ok) {
        // Tweet posted successfully, so fetch updated tweets
        console.log('Tweet posted')
        fetchTweets();
        setTweet('');
      } else {
        // Tweet posting failed
        console.error('Tweet posting failed');
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
    }
  };

  return (
    <div>
      <h2>Compose Post</h2>
      <form onSubmit={handleTweetSubmit}>
        <textarea
          value={tweet}
          onChange={handleTweetChange}
          placeholder="What's happening?"
          maxLength={280} // Set your character limit
        />
        <button type="submit">Post</button>
      </form>

      <h2>Posts</h2>
      <div>
        {tweets.map((tweet) => (
          <div key={tweet._id}>
            <p>User: {tweet.author}</p> {/* Display the user's name */}
            <p>Post: {tweet.text}</p>
            {/* <p>Timestamp: {tweet.timestamp}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TweetForm;
