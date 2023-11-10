import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [registrationMessage, setRegistrationMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      // Make an API call to register the user using formData
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registration successful
        console.log('User registered successfully');
        setRegistrationMessage('User registered successfully');
      } else {
        // Registration failed
        const data = await response.json();
        console.error('User registration failed');
        setRegistrationMessage(data.message || 'User already exists');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container h-100">
        <div className="row align-items-center h-100">
          <div className="col-md-6 mx-auto">
            <div className="card border-0 shadow-lg my-5">
              <div className="card-body p-5">
                <h2 className="fw-bold mb-4 text-uppercase text-center">Register</h2>
                <form onSubmit={handleRegistration}>
                  <div className="mb-4">
                    <label htmlFor="typeName" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      id="typeName"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="typeEmail" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="typeEmail"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="typePassword" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="typePassword"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button className="btn btn-outline-dark btn-lg px-5" type="submit">
                    Register
                  </button>
                </form>

                {/* Display registration message */}
                {registrationMessage && <p className="text-success">{registrationMessage}</p>}

                <div className="mt-4 pt-1 text-center">
                  {/* ... (social media icons) */}
                </div>
                <div className="mt-4">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <a href="login" className="text-decoration-none fw-bold">
                      Login
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

export default Register;
