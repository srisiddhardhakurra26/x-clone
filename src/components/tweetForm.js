import React, { useState } from 'react';

function TweetForm() {
  const [tweet, setTweet] = useState('');

  const handleTweetChange = (e) => {
    setTweet(e.target.value);
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make an API call to post the tweet using the 'tweet' state
      // You'll need to implement this API call using Axios or Fetch
      const response = await fetch('/api/postTweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweet }),
      });

      if (response.ok) {
        // Tweet posted successfully
        console.log('Tweet posted successfully');
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
      <h2>Compose Tweet</h2>
      <form onSubmit={handleTweetSubmit}>
        <textarea
          value={tweet}
          onChange={handleTweetChange}
          placeholder="What's happening?"
          maxLength={280} // Set your character limit
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default TweetForm;
