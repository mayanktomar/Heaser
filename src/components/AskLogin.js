import React, { Component } from 'react'
import { Button, Row, Col } from 'reactstrap';
import vector1 from "../assets/vector1.svg";
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

export class AskLogin extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            isRegModalOpen:false,
            isLogModalOpen:false
        }
    }

    toggleRegModal=()=>{
        this.setState({
          isRegModalOpen:!this.state.isRegModalOpen
        })
    }

    toggleLogModal=()=>{
        this.setState({
          isLogModalOpen:!this.state.isLogModalOpen
        })
    }
    
    render() {
        return (
        <div>
            <div class="container loginhead">
                <div class="row">
                    <div class="col-md-6">
                        <h1 style={{width:"80%",fontFamily:"Roboto"}}>Explore new way of work</h1>
                        <p style={{fontSize:17,fontFamily:"Roboto"}}>Login/Signup to continue</p>
                        <br/>
                        <Button style={{backgroundColor:'#1976d2',width:'75%',color:'white'}} onClick={this.toggleLogModal}>Employee Login</Button>
                        <br/>
                        <br/>
                        {/* <div className="row">
                            <div className="col-md-6">

                            </div>
                        </div> */}
                        {/* <Row>
                            <Col md={6}>
                            <Button style={{backgroundColor:'#1976d2',width:'75%',color:'white'}} onClick={this.toggleRegModal}>HR Login</Button>

                            </Col>
                            <Col md={6}>
                            <Button style={{backgroundColor:'#1976d2',width:'75%',color:'white'}} onClick={this.toggleRegModal}>HR Login</Button>

                            </Col>
                        </Row> */}
                        <Button style={{backgroundColor:'#1976d2',width:'75%',color:'white'}} onClick={this.toggleRegModal}>HR Login</Button>
                    </div>
                    <div class="col-md-6" style={{paddingBottom:30}}>
                        <img src={vector1}/>
                    </div>
                </div>
            </div>
            <RegisterModal isRegModalOpen={this.state.isRegModalOpen} toggleRegModal={this.toggleRegModal}/>
            <LoginModal {...this.props} isLogModalOpen={this.state.isLogModalOpen} toggleLogModal={this.toggleLogModal}/>
        </div>
        )
    }
}

export default AskLogin
