import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import './css/login.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [notFoundError, setNotFoundError] = useState(false);
  const [wrongCredentialsError, setWrongCredentialsError] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
        console.log('User logged in successfully');
        window.location.href = '/tweetForm'; // Redirect to /tweetForm
      } else if (response.status === 400) {
        const data = await response.json();
        if (data.message === 'User not found') {
          setNotFoundError(true);
          setWrongCredentialsError(false);
        }
      } else {
        const data = await response.json();
        if (data.message === 'Invalid password') {
          setNotFoundError(false);
          setWrongCredentialsError(true);
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container h-100">
        <div className="row align-items-center h-100">
          <div className="col-md-6 mx-auto">
            <div className="card border-0 shadow-lg my-5">
              <div className="card-body p-5">
                <h2 className="fw-bold mb-4 text-uppercase text-center">Login</h2>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="typeEmailX" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="typeEmailX"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange} // Use handleInputChange here
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="typePasswordX" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="typePasswordX"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange} // Use handleInputChange here
                    />
                  </div>
                  <button className="btn btn-outline-dark btn-lg px-5" type="submit">
                    Login
                  </button>
                </form>

                {/* Display error messages */}
                {notFoundError && <p className="text-danger">User not found</p>}
                {wrongCredentialsError && <p className="text-danger">Invalid password</p>}
                <div className="mt-4 pt-1 text-center">
                  {/* ... (social media icons) */}
                </div>
                <div className="mt-4">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <a href="register" className="text-decoration-none fw-bold">
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;