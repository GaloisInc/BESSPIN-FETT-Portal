import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { hot } from 'react-hot-loader/root';
import { Auth, Hub } from 'aws-amplify';
import { withRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import MainRouter from './containers/MainRouter';
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
  overrides: {
    MuiTableSortLabel: {
      root: {
        '&:hover': {
          color: '#62AEB5',
        },
      },
      active: {
        color: '#62AEB5 !important',
      },
      icon: {
        color: '#62AEB5 !important',
      },
    },
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

    Hub.listen('auth', data => {
      const { payload } = data;
      this.onAuthEvent(payload);
      // console.log('A new auth event has happened: ', `${data.payload.data.username} has ${data.payload.event}`);
    });
  }

  async componentDidMount() {
    const { history, location } = this.props;
    this.setState({ isAuthenticating: true });
    this.pathname = location.pathname;
    try {
      await Auth.currentSession();
    } catch (error) {
      await this.setState({ isAuthenticating: false });
      history.push('/');
    }
    this.login();
  }

  onAuthEvent = payload => {
    // ... your implementation
    if (payload.message === 'logout') {
      this.logout();
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
      if (user.isValid()) {
        const { isAdmin } = this.state;
        await this.setState({ isLoggedIn: true, isAuthenticating: false });
        if (isAdmin) {
          const path =
            this.pathname.includes('bounty') || this.pathname === '/'
              ? 'dashboard'
              : this.pathname.replace(/\/?adminportal\//g, '').replace(/\/$/g, '');
          history.push(`/adminportal/${path}`);
        } else {
          const path =
            this.pathname.includes('admin') || this.pathname === '/'
              ? 'dashboard'
              : this.pathname.replace(/\/?bountyportal\//g, '').replace(/\/$/g, '');
          history.push(`/bountyportal/${path}`);
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
          {isAuthenticating ? (
            <div className="flex items-center justify-center w-full h-screen">
              <CircularProgress style={{ color: '#26343E' }} />
            </div>
          ) : (
            <MainRouter
              {...this.props}
              setStorage={this.setStorage}
              isLoggedIn={isLoggedIn}
              login={this.login}
              logout={this.logout}
              isAdmin={isAdmin}
              name={name}
            />
          )}
        </ThemeProvider>
      </div>
    );
  }
}
export default (process.env.NODE_ENV === 'development'
  ? hot(withRouter(withStyles(_styles)(App)))
  : withRouter(withStyles(_styles)(App)));

App.propTypes = {
  history: ReactRouterPropTypes.history,
  classes: PropTypes.any,
  location: ReactRouterPropTypes.location,
};
