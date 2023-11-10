// Navigation.js

import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/tweetForm">Home</Link></li>
        {/* Other navigation items */}
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
