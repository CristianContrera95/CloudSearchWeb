import React from "react";
import PropTypes from 'prop-types'
import { Route } from "react-router-dom";

const AppliedRoute = ({ component: C, props: cProps, public: p,  ...rest }) =>
    <Route {...rest} render={props => <C {...props} {...cProps} />} />;

AppliedRoute.propTypes = {
    props: PropTypes.any,
    component: PropTypes.any,
}

export default AppliedRoute;