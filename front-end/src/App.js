import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { hot } from 'react-hot-loader/root';
import { CognitoAuth, CognitoIdToken } from 'amazon-cognito-auth-js';
import { withRouter } from 'react-router-dom';
import * as JwtDecode from 'jwt-decode';
import { ThemeProvider } from '@material-ui/styles';
import { withStyles, createMuiTheme, mergeClasses } from '@material-ui/core/styles';
import * as authConfig from './.aws-config.js';
import Nav from './components/Nav';
import LoginBanner from './components/LoginBanner';
import MainRouter from './containers/MainRouter';

const _styles = {
  container: {
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: '100%',
  },
};

const theme = createMuiTheme({
  palette: {
    primary: { main: '#ED1C24' },
    secondary: { main: '#FFF200' },
  },
});
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false,
      loggedIn: false,
      authData: authConfig,
      storeId: null,
      auth: null,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.setStorage = this.setStorage.bind(this);
  }

  componentWillMount() {
    const { history } = this.props;
    const auth = new CognitoAuth(authConfig);
    const sesh = auth.getCachedSession();
    if (!sesh) {
      history.push('/');
    }
    const idToken = sesh.idToken.jwtToken;
    let isAdmin = false;
    let storeId = 0;
    if (idToken) {
      isAdmin = JwtDecode(idToken).locale === '001';
      storeId = JwtDecode(idToken).locale;
      // setInterval(() => {
      //   if (new CognitoIdToken(idToken).getExpiration() * 1000 - new Date().getTimezoneOffset() < 60 * 1000) {
      //     history.push('/logout');
      //   }
      // }, 30000);
    }
    const self = this;
    auth.userhandler = {
      onSuccess(result) {
        self.setStorage(result);
        history.push('/home');
      },
      onFailure(err) {
        history.push('/');
      },
    };
    this.setState({ auth, loggedIn: auth.isUserSignedIn(), isAdmin, storeId });
  }

  setStorage(tokens) {
    const { accessToken, idToken } = tokens;
    const userInfo = JwtDecode(idToken.jwtToken);
    // TODO: Update to match and pass the ADMIN info
    this.setState({
      isAdmin: userInfo.locale === '',
      loggedIn: true,
      storeId: userInfo.locale,
    });
    sessionStorage.setItem('id', userInfo.locale);
  }

  login = () => {
    const { auth } = this.state;
    auth.getSession();
  };

  logout = () => {
    const { authData } = this.state;
    const auth = new CognitoAuth(authData);
    sessionStorage.clear();
    auth.signOut();
    this.setState({ isAdmin: false, loggedIn: false });
  };

  render() {
    const { classes } = this.props;
    const { auth, isAdmin, loggedIn, storeId } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ThemeProvider theme={theme}>
          {loggedIn ? (
            <div className={classes.container}>
              <Nav isAdmin={isAdmin} loggedIn={loggedIn} />
            </div>
          ) : (
            <LoginBanner />
          )}
          <MainRouter
            {...this.props}
            auth={auth}
            setStorage={this.setStorage}
            loggedIn={loggedIn}
            login={this.login}
            logout={this.logout}
            isAdmin={isAdmin}
            storeId={storeId}
          />
        </ThemeProvider>
      </div>
    );
  }
}
export default (process.env.NODE_ENV === 'development' ? hot(withRouter(withStyles(_styles)(App))) : withRouter(withStyles(_styles)(App)));
//
App.propTypes = {
  authState: PropTypes.object,
  history: ReactRouterPropTypes.history,
  classes: PropTypes.any,
};
