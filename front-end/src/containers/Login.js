import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    const { loggedIn, history } = this.props;
    if (loggedIn) {
      history.push('/home');
    }
  }

  login = () => {
    const { auth } = this.props;
    auth.getSession();
  };

  render() {
    return (
      <div className="login-container">
        {/* <img src={mock} alt="" style={{justifySelf: 'center', alignSelf: 'center', borderRadius: 20, height:450}} /> */}

        {/* <button type="button" className="login-button" onClick={this.login}>
          Login
        </button> */}
      </div>
    );
  }
}
export default withRouter(Login);
Login.propTypes = {
  auth: PropTypes.any.isRequired,
  history: ReactRouterPropTypes.history,
  loggedIn: PropTypes.bool.isRequired,
};
