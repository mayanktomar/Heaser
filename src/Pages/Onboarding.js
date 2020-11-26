import React,{useState} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';

export default function Onboarding(props) {
    const [name, setname] = useState('');
    const handleInputChange=(event)=>{
        setname(event.target.name.value);


    }
    const dropdownoptions = props.employees.map((e) => {
        return <option>{e.name}</option>;
    });
    return (
        <div>
             <Modal isOpen={props.isOnboardingModalOpen} toggle={props.toggleOnboardingModal}>
                <ModalHeader toggle={props.toggleOnboardingModal}>Upload resources</ModalHeader>
                <ModalBody>
                <Form>
                            <FormGroup>
                                <Label for="exampleSelect">Employee name</Label>
                                <Input
                                    type="select"
                                    name="empname"
                                    id="exampleSelect"
                                    onChange={handleInputChange}
                                >
                                    {/* <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option> */}
                                    <option>-</option>
                                    {dropdownoptions}
                                </Input>
                            </FormGroup>

                            </Form>
                           <Label>Resources</Label>
                           <br/>
                            <input type="file"/>
                </ModalBody>
                <ModalFooter>
                    
                <Button color="primary" onClick={props.toggleOnboardingModal}>Upload</Button>{' '}
                
                </ModalFooter>
            </Modal>
        </div>
    )
}
