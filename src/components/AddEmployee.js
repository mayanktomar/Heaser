import React, { Component } from 'react';
import {Card, CardBody, CardText, CardTitle, Button, Form, FormGroup,Label,Input} from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import emp1 from '../assets/emp1.svg';

export class AddEmployee extends Component {

    constructor(props)
    {
        super(props);
        this.state={
            name:'',
            email:'',
            gender:'',
            dob:'',
            startDate:new Date()
        }
    }

    handleRegChange=(event)=>{
        const target=event.target;
        const name=target.name;
        const value=target.value;
        if (name=="gender")
        {
            const id=target.id;
            this.setState({
                gender:id
            })
        }
        else
        {
            this.setState({
                [name]:value
            })
        }
    }
    handleDateChange=(date)=>{
        this.setState({
            startDate:date
        })
    }
     onSubmit=()=>{
         this.setState({
             dob:moment(this.state.startDate).format("YYYY-MM-DD")
         })
         console.log(JSON.stringify(this.state))
     }
    render() {
        return (
            <div className="container empadd">
                <h2>Employee Addition Portal</h2>
                <div className="row">
                    <div className="col-md-6">
                    <Card>
                            <CardBody>
                                <CardTitle>Enter the details</CardTitle>
                                <CardText>
                                <Form>
                        <FormGroup>
                            <Label for="exampleText">Name</Label>
                            <Input type="text" name="name" id="exampleText" placeholder="name of employee" onChange={this.handleRegChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input type="email" name="email" id="exampleEmail" placeholder="email of employee" onChange={this.handleRegChange} />
                        </FormGroup>
                        <FormGroup tag="fieldset">
                            <legend>Gender</legend>
                            <FormGroup check>
                            <Label check>
                                <Input type="radio" name="gender" id="M" onChange={this.handleRegChange} />{' '}
                               Male
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                            <Label check>
                                <Input type="radio" name="gender" id="F" onChange={this.handleRegChange} />{' '}
                               Female
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                            <Label check>
                                <Input type="radio" name="gender" id="O" onChange={this.handleRegChange} />{' '}
                               Other
                            </Label>
                            </FormGroup>
                            </FormGroup>
                            <FormGroup>
                            <Label>Deadline</Label> <br/>
                            <DatePicker selected={this.state.startDate} onChange={date => this.handleDateChange(date)} minDetail="decade" />
                        </FormGroup>
                           
                        </Form>

                                </CardText>
                                <Button style={{backgroundColor:'#1976d2',display:'block',margin:'auto',color:'white'}} onClick={this.onSubmit}>Add your employee</Button>

                            </CardBody>
                        </Card>
                    </div>

                    <div className="col-md-6">
                        <img src={emp1}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddEmployee
