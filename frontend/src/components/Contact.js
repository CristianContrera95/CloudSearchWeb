import React, { Component } from 'react';
import { CNavbarBrand} from "@coreui/react";
import { InputField } from './InputField'
import { Button, Row, Col, Card, CardBody, CardGroup, Container } from 'reactstrap'
import logo from '../images/logo-pi-consulting.png'


class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            body: '',
            phone: ''
        }
        this.submitHandler = this.submitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    submitHandler(e) {
        console.log(this.state);
    };

    changeHandler(event) {
        this.setState({ [event.target.name]: event.target.value });
    };

    validateForm() {
        return this.state.email.length > 0 &&
            this.state.name.length > 0 &&
            this.state.body.length > 0;
    }

    render() {
        return(
            <div className="app flex-row align-items-center pt-4 bg-white" >
                <Container>
                    <Row className="justify-content-center">
                        <Col md="8">
                            <CardGroup>
                                <Card className="p-4 border-0">
                                    <CardBody className="text-center">
                                        <form onSubmit={this.submitHandler}>
                                            <Row>
                                                <Col>
                                                    <CNavbarBrand
                                                        full={{ src: logo,
                                                            width: 300,
                                                            alt: 'PiData Consulting & Strategy Logo' }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <InputField label={'Nombre'}
                                                                ph ={'Nombre y apellido'}
                                                                type={"text"}
                                                                name={"name"}
                                                                i={'y'}
                                                                change={this.handleChange}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <InputField label={'Email'}
                                                                type={"email"}
                                                                name={"email"}
                                                                ph ={'ejemplo@hotmail.com'}
                                                                i={'y'}
                                                                change={this.handleChange}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <InputField label={'Celular'}
                                                                type={"number"}
                                                                name={"phone"}
                                                                ph ={'0303456'}
                                                                i={'y'}
                                                                change={this.handleChange}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className='-'>
                                                    <InputField label={'Consulta'}
                                                                type={"textarea"}
                                                                ph={'Tu consulta'}
                                                                name={"body"} i={'y'}
                                                                change={this.handleChange}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Button type={'submit'} style={{background: "#3391FF", border: "0px"}} disabled={!this.validateForm()}>
                                                        Enviar
                                                    </Button>
                                                    <p className="text-muted mt-2">*Este mail será enviado a PiData Strategy & Consulting</p>
                                                </Col>
                                            </Row>
                                        </form>
                                    </CardBody>
                                </Card>
                            </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Contact;
