import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, ListItem, ListItemIcon, ListItemText, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import StoreIcon from '@material-ui/icons/Store';
import logo from '../assets/fett_logo.png';

const _styles = {
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: 3,
    backgroundColor: '#424242',
  },
  siteSelector: {
    margin: 15,
  },
  toolbarIcon: {
    color: '#00FF00',
    marginLeft: 'auto',
    width: 70,
  },
  fullWidth: {
    width: '100%',
  },
  menuLink: {
    textDecoration: 'none',
    color: 'black',
  },
  logoLink: {
    verticalAlign: 'left',
  },
  logo: {
    width: '250px',
  },
  logoSize: {
    height: 40,
  },
  '@media screen and (min-width: 1500px)': {
    toolbarIcon: {
      color: '#00FF00',
      marginLeft: 'auto',
      width: 84,
    },
    logoSize: {
      height: 60,
    },
    header: {
      fontSize: 40,
    },
    listFooter: {
      fontSize: 25,
    },
  },
};
class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { loggedIn, classes } = this.props;
    return (
      <AppBar position="static" className={classes.appBar} ref={e => (this.nav = e)} style={{ boxShadow: 'none' }} id="nav-bar">
        <Toolbar variant="regular">
          <IconButton color="default" aria-label="Menu">
            <MenuIcon htmlColor="white" />
          </IconButton>
          <Link className={classes.logoLink} to="">
            <img src={logo} alt="" className={classes.logoSize} />
          </Link>
          <ListItem button>
            <ListItemIcon className={classes.toolbarIcon}>
              <Button variant="contained" color="primary" onClick={this.changeStore}>
                <StoreIcon />
                &nbsp;#{960}
              </Button>
            </ListItemIcon>
          </ListItem>
        </Toolbar>
      </AppBar>
    );
  }
}

Nav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  classes: PropTypes.any,
};
export default withRouter(withStyles(_styles)(Nav));
