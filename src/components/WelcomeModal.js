import React from 'react';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function WelcomeModal(props) {
   
        

       
    return (
        <div>
           
            <Modal isOpen={props.isWelModalOpen} toggle={props.toggleWelModal} >
                <ModalHeader toggle={props.toggleWelModal}>Welcome Mayank :)</ModalHeader>
                <ModalBody>
                Hope you are having a good day..!!
                </ModalBody>
                <ModalFooter>
                {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button> */}
                </ModalFooter>
            </Modal>
        </div>
    )
}
