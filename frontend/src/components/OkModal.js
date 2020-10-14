import React, { Component } from 'react';
import {
    Container,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter
} from 'reactstrap';
import logo from "../images/azure-search-logo.png";

class OkModal extends Component {

    render() {
        return (
            <Container>
                <Modal centered={true} isOpen={this.props.modal} toggle={this.props.toggle}>
                    <ModalHeader  style={{backgroundColor:'#000000', color: 'white'}} toggle={this.props.toggle}>
                        <img className="mx-2" src={logo} style={{width:"60px",height:"44px"}} alt="azure search logo"/>
                        Azure Search SCBA
                    </ModalHeader>
                    <ModalBody className='text-center'>
                        {this.props.body}
                    </ModalBody>
                    <ModalFooter>
                        <Button className="mx-auto" id='button' name='boton modal' style={{background: "#3391FF", border: "0px"}} onClick={(e) => this.props.toggle(e)}>Ok!</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }
}

export default OkModal;