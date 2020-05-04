import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { GetFromDatabase } from '../services/api';
import Loading from '../components/Loading';

const _styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
};
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      startTimer: true,
    };
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    const { isAdmin } = this.props;
    const { isLoading, data, dimensions, startTimer } = this.state;
    return (
      <div className="home-container">
        {!isLoading && <div className={classes.container}>{/* INSERT HERE */}</div>}
        <Loading isLoading={isLoading} />
      </div>
    );
  }
}
export default withRouter(withStyles(_styles)(Home));

Home.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  classes: PropTypes.any,
};
