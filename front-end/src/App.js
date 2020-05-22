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
    };
  }

  async componentDidMount() {
    const { history } = this.props;
    this.setState({ isAuthenticating: true });
    console.log('authenticating');
    try {
      await Auth.currentSession();
      // this.getData();
    } catch (error) {
      await this.setState({ isAuthenticating: false });
      history.push('/');
    }
    this.login();
  }

  handleRoleSwitch = async isAdmin => {
    await this.setState({ isAdmin });
    this.login();
  };

  login = async () => {
    const { history } = this.props;
    const { isAdmin } = this.state;
    try {
      const user = await Auth.currentSession();
      if (user.isValid()) {
        await this.setState({ isLoggedIn: true, isAdmin: true, isAuthenticating: false });
        // this.routeUser(user);
        // history.push('/adminportal');
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

  getData = async () => {
    try {
      const data = await GetFromDatabase();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { isAdmin, isLoggedIn, isAuthenticating } = this.state;
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
