import React, {Component} from "react";
import {Row, Col, UncontrolledTooltip} from 'reactstrap'

class Footer extends Component {

    render() {
        return (
            <footer style={{background: "#00182b"}} className="text-white px-5 mb-0 pb-0" id="footer">
                <Col className="">
                    <Row className="pt-3 mx-auto">
                        <Col className="col-9">
                            <small style={{fontSize: "14px"}}>
                            <p className="text-muted py-1">
                                &copy; Copyright {new Date().getFullYear()}
                                <a href="http://www.piconsulting.com.ar/" style={{color: "white", textDecorationLine : 'none'}}>
                                    {" Pi Data Strategy & Consulting"}
                                </a>
                            </p>
                            </small>
                        </Col>
                        <Col className="col-3 text-right">
                            <p>
                                <UncontrolledTooltip placement="top" target="indexes_link">
                                    Click para configurar los indices
                                </UncontrolledTooltip>
                                <a href="/indexes" className="mx-4" id="indexes_link" style={{color: "white", textDecorationLine : 'none'}}>
                                    Indices
                                </a>
                                <a target={'_blank'} rel="noopener noreferrer" href={'https://portal.azure.com/'} className="mx-4" style={{color: "white", textDecorationLine : 'none'}}>
                                    Azure
                                </a>
                            </p>
                        </Col>
                    </Row>
                </Col>
            </footer>
        )
    }
}

export default Footer;
