import React, { Component } from 'react';
import { Button,Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input, FormTex,Spinner } from 'reactstrap';

export class LoginModal extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            email:'',
            password:'',
            loader:false
        }
    }

    handleLogChange=(event)=>{
        const target=event.target;
        const name=target.name;
        const value=target.value;
        this.setState({
           [name]:value
        })
    }

    onLogSubmit=()=>{

    }
    render() {
        return (
            <div>
                <Modal isOpen={this.props.isLogModalOpen} toggle={this.props.toggleLogModal}>
                        <ModalHeader toggle={this.props.toggleLogModal}>Login</ModalHeader>
                        <ModalBody>
                        <Form>
                        <FormGroup>
                            <Label for="exampleEmail">Employee ID</Label>
                            <Input type="email" name="email" id="exampleEmail" placeholder="Enter your email" onChange={this.handleLogChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input type="password" name="password" id="examplePassword" placeholder="Enter your password" onChange={this.handleLogChange} />
                        </FormGroup>
                        </Form>

                        </ModalBody>
                        <ModalFooter>
                         <Button onClick={this.onLogSubmit}>Login</Button>
                         
                        </ModalFooter>
            </Modal>
            </div>
        )
    }
}

export default LoginModal
