// UserProfile.js
import React, { useState, useEffect } from 'react';

const UserProfile = ({ match }) => {
  // const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Fetch user details and posts based on the username from the URL
    const fetchUserProfile = async () => {
      try {
        if (!match.params.username) {
          console.error('Username is undefined');
          return;
        }
        console.log('Fetching user profile for username:', match.params.username); // Add this line
        const response = await fetch(`/api/userProfile/${match.params.username}`);
        if (response.ok) {
          const data = await response.json();
          // setUser(data.user);
          setUserPosts(data);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [match.params.username]);

  return (
    <div>
      {/* <h2>User Profile: {user.username}</h2> */}
      {/* Display user details */}
      <div>
        {/* <p>Email: {user.email}</p> */}
        {/* Add more user details as needed */}
      </div>

      <h3>User Posts</h3>
      {/* Display user posts */}
      <ul>
        {userPosts.map((post) => (
          <li key={post._id}>{post.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
