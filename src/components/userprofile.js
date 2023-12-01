// UserProfile.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import './css/UserProfile.css'; // Import your custom styles

const UserProfile = ({ match }) => {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/userProfile/${match.params.username}`);
        if (response.ok) {
          const data = await response.json();
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
    <section className="vh-100 dark-mode">
      <div className="container mt-4 dark-mode">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card dark-mode-card">
              <div className="card-body">
                <section className="profile-details">
                  <div className="d-flex align-items-center">
                    <h2 className="card-title text-light">{match.params.username}</h2>
                  </div>
                </section>

                {/* Add more user details here if needed */}

                <h3 className="mt-4 text-light">Posts</h3>
                <ul className="list-group dark-mode-list">
                  {userPosts.map((post) => (
                    <li key={post._id} className="list-group-item dark-mode-list">
                      <pre className="tweet-text">{post.text}</pre>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="d-flex justify-content-center mt-4">
              <a href="http://localhost:3000/tweetForm" className="text-decoration-none fw-bold">
                      Home
                    </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;