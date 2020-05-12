import React from 'react';

const LoginBanner = () => (
  <div className="applogin-banner">
    <div className="applogin-background" />
    <div className="applogin-container">
      <h1>
        <span>FETT Portal</span>
      </h1>
      <p>Sign in to access FETT Portal</p>

      <form>
        <div className="applogin-formfield">
          <label htmlFor="fett-username">
            User Name
            <input type="text" name="username" id="fett-username" />
          </label>
        </div>

        <div className="applogin-formfield">
          <label htmlFor="fett-password">
            Password
            <input type="password" name="password" id="fett-password" />
          </label>
        </div>

        <button type="submit">LOGIN</button>
      </form>
    </div>
  </div>
);
export default LoginBanner;

LoginBanner.propTypes = {};
