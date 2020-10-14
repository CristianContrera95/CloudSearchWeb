import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import logo from '../../images/azure-search-logo.png'
import Container from "reactstrap/es/Container";


class Header extends Component {
    render() {
        return (
            <div className="c-header-nav" style={{background: "#000000"}}>
                <Container>
                    <Row className="py-0 my-0">
                        <Col className="text-left col-5">
                            <a href="/home" className='px-2' style={{color: "white", textDecorationLine : 'none'}}>
                                <Row className='text-right mx-auto'>
                                    <h4 className="my-0">
                                        <img src={logo} alt="Logo" className="m-0 p-0" style={{ blockSize: "80px"}}/>
                                        <b> AZURE SEARCH SCBA</b>
                                    </h4>
                                </Row>
                            </a>
                        </Col>
                        <Col className="text-left">
                            <h6 className="mt-5 pt-2" style={{color: "white"}}>
                                <b>Jurisprudencia de Buenos Aires</b>
                            </h6>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}


export default Header;
