import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from "./Header";
import Footer from "./Footer";
import AppliedRoute from '../../routes/AppliedRoute';
import routes from '../../routes/routes';


class BaseApp extends Component {

    render() {
        return (
            <div className="app">
                <div className="app-header">
                    <Header />
                </div>
                <div className="app-body" id="content-wrap">
                    {/*<AppSidebar fixed display="lg"/>*/}
                    <main className="main">
                        <Container fluid className="m-0 p-0">
                            <Switch>
                                {routes.map((route, idx) => {
                                    return route.component ? (
                                        <AppliedRoute //Transformed Route into AppliedRoutes
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            component={route.component}
                                        />
                                    ) : null;
                                })}
                                <Redirect from="/" to="/home" />
                            </Switch>
                        </Container>
                    </main>
                </div>
                <div className="footer bg-white">
                    <Footer />
                </div>
            </div>
        )
    }
}


export default BaseApp;