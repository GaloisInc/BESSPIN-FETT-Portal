import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { hot } from 'react-hot-loader/root';
import { Auth } from 'aws-amplify';
import { withRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { withStyles, createMuiTheme, mergeClasses } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import MainRouter from './containers/MainRouter';
import { GetFromDatabase } from './services/api';
import { getMyUser } from './services/api/user';

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
      isLoggedIn: false,
      isAuthenticating: false,
      name: '',
    };
  }

  async componentDidMount() {
    const { history } = this.props;
    this.setState({ isAuthenticating: true });
    console.log('authenticating');
    try {
      await Auth.currentSession();
    } catch (error) {
      await this.setState({ isAuthenticating: false });
      history.push('/');
    }
    this.login();
  }

  handleRoleSwitch = async isAdmin => {
    const { history } = this.props;
    try {
      await this.setState({ isAdmin });
      const user = await Auth.currentSession();
      if (user.isValid()) {
        await this.setState({ isLoggedIn: true, isAuthenticating: false });
        if (isAdmin) {
          history.push('/adminportal');
        } else {
          history.push('/bountyportal');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  login = async () => {
    const { history } = this.props;
    try {
      const user = await Auth.currentSession();
      const id = await user.getIdToken();
      const name = id.payload['cognito:username'];
      this.setState({ name });
      const userData = await getMyUser(name);
      this.setState({ isAdmin: userData[0].Role === 'admin' });
      console.log(name);
      console.log(user);
      console.log(userData);
      if (user.isValid()) {
        const { isAdmin } = this.state;
        await this.setState({ isLoggedIn: true, isAuthenticating: false });
        if (isAdmin) {
          history.push('/adminportal');
        } else {
          history.push('/bountyportal');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  logout = async () => {
    try {
      await Auth.signOut();

      await this.setState({ isLoggedIn: false, isAdmin: false });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { isAdmin, isLoggedIn, isAuthenticating, name } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ThemeProvider theme={theme}>
          {!isAuthenticating && (
            <MainRouter
              {...this.props}
              setStorage={this.setStorage}
              isLoggedIn={isLoggedIn}
              login={this.login}
              logout={this.logout}
              isAdmin={isAdmin}
              handleRoleSwitch={this.handleRoleSwitch}
              name={name}
            />
          )}
          {isAuthenticating && (
            <div className="flex items-center justify-center w-full h-screen">
              <CircularProgress style={{ color: '#26343E' }} />
            </div>
          )}
        </ThemeProvider>
      </div>
    );
  }
}
export default (process.env.NODE_ENV === 'development' ? hot(withRouter(withStyles(_styles)(App))) : withRouter(withStyles(_styles)(App)));

App.propTypes = {
  history: ReactRouterPropTypes.history,
  classes: PropTypes.any,
};
