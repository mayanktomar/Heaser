import React, { Component } from 'react';
import axios from 'axios';
import { Spinner,Card,  CardText, CardBody,
    CardTitle, Button, Table, Modal, ModalBody, ModalHeader } from 'reactstrap';
    import {FcInfo} from 'react-icons/fc';

export class EmpTasks extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            tasks:[],
            loading:true,
            isTaskModalOpen:false,
            taskId:'',
            taskInfo:''
        }
    }

    componentDidMount=()=>{
        axios.get('/task/get-employee-tasks/'+this.props.userId)
        .then( (response)=> {
            this.setState({
                tasks:response.data.tasks,
                loading:false
            })
            
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    toggleTaskModal=async ()=>{
        await this.setState({
            isTaskModalOpen:!this.state.isTaskModalOpen
        })
    }

    taskInfo=async (event)=>{
        const data=this.state.tasks.find(item=>{
            return item._id==event.target.id
        })
        
        await this.setState({
            taskInfo:data
        })
        await this.toggleTaskModal();
    }
    render() {
        const displaytasks=this.state.tasks.map((t)=>{
            return(
                <tr>
                <td>{t.heading}</td>
                
                <td><Button id={t._id} style={{background:'transparent',paddingTop:'0px'}} onClick={this.taskInfo}><FcInfo  /></Button></td>
            </tr>

            )
        })
        const display=this.state.loading==true?<Spinner color="info"/>:displaytasks
        return (
            <div>
                 <Modal isOpen={this.state.isTaskModalOpen} toggle={this.toggleTaskModal}>
                    <ModalHeader toggle={this.toggleTaskModal}>Modal title</ModalHeader>
                    <ModalBody>
                    <h4>{this.state.taskInfo.heading}</h4>
                    </ModalBody>
                </Modal>
                <Card>
                    
                    <CardBody>
                    <CardTitle tag="h5">Your pending tasks</CardTitle>
                    
                    <CardText>
                    <Table hover>
                            <tr>
                                    <th>Goal</th>
                                    <th>Deadline</th>
                                    <th></th>
                                </tr>
                               {display}
                                </Table>
                        
                    </CardText>
                    
                    </CardBody>
                </Card>

               

            </div>
        )
    }
}

export default EmpTasks
