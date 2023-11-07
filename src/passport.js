passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // The field where the user enters their email
        passwordField: 'password', // The field where the user enters their password
      },
      async (email, password, done) => {
        try {
          // Retrieve the user from your database by their email
          const user = await User.findOne({ email });
  
          // If the user is not found, authentication fails
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
  
          // Compare the provided password with the user's hashed and salted password
          const passwordMatch = await user.comparePassword(password);
  
          if (passwordMatch) {
            // Authentication succeeds; return the user
            return done(null, user);
          } else {
            // Password doesn't match; authentication fails
            return done(null, false, { message: 'Incorrect password' });
          }
        } catch (err) {
          // Handle any errors that occur during authentication
          return done(err);
        }
      }
    )
  );
  