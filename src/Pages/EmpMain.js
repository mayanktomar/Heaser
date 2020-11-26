import React, { Component } from "react";
import WelcomeModal from "../components/WelcomeModal";
import EmpTasks from "../components/EmpTasks";
import { CardBody, Card, Button, Spinner, Table } from "reactstrap";
import moment from "moment";
import EmpTodos from "../components/EmpTodos";
import Header from "../components/Header";
import { BsFillChatFill } from "react-icons/bs";
import EmpTime from "../components/EmpTime";
import { AuthContext } from "../Context/auth";

export class EmpMain extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isWelModalOpen: false,
            datetime: new Date(),
            chatBotOpen: false,
            lat: undefined,
            lon: undefined,
            city: undefined,
            temperatureC: undefined,
            temperatureF: undefined,
            icon: undefined,
            sunrise: undefined,
            sunset: undefined,
            errorMessage: undefined,
            loadingweather:true
        };
    }

    getPosition = () => {
        return new Promise(function (resolve, reject) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      }
      getWeather = async (latitude, longitude) => {
        const api_call = await fetch(`//api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${'f86adc19a202147fe436dd02e2985abb'}&units=metric`);
        const data = await api_call.json();
        console.log(data)
        this.setState({
          lat: latitude,
          lon: longitude,
          city: data.name,
          temperatureC: Math.round(data.main.temp),
          temperatureF: Math.round(data.main.temp * 1.8 + 32),
          icon: data.weather[0].icon,
          sunrise: moment.unix(data.sys.sunrise).format("hh:mm a"),
          sunset: moment.unix(data.sys.sunset).format("hh:mm a"),
          loadingweather:false
        })
      }
    toggleChatBot = () => {
        this.setState({ chatBotOpen: !this.state.chatBotOpen });
    };

    componentDidMount = () => {
        setInterval(() => {
            this.setState({
                datetime: new Date(),
            });
        }, 1000);

        this.getPosition()
   .then((position) => {
      this.getWeather(position.coords.latitude,     
      position.coords.longitude)
    })
    .catch((err) => console.log(err.message));
        
    };
    toggleWelModal = () => {
        this.setState({
            isWelModalOpen: false,
        });
    };
    render() {
        let greeting;
        if (moment(this.state.datetime).format('H')<12)
        {
            greeting="Good morning";
        }
        else if (moment(this.state.datetime).format('H')<17)
        {
            greeting="Good afternoon";
        }
        else
        {
            greeting="Good evening"
        }
        return (
            <>
                <Header {...this.props} />
                <div className="container empmain">
                    <WelcomeModal
                        isWelModalOpen={this.state.isWelModalOpen}
                        toggleWelModal={this.toggleWelModal}
                    />
                    <h2>Dashboard</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <Card className="timecard">
                                <CardBody style={{padding:'0.5em'}}>
                                    <div className="row" style={{padding:'0px',margin:'0px'}}>
                                    <div className="col-md-9" style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                    <span style={{ fontWeight: "bold" }}>
                                        {greeting}{" "}
                                        {this.context.data &&
                                            this.context.data.name}{"👋"}
                                        , It is{" "}
                                        {moment(this.state.datetime).format(
                                            "MMMM Do YYYY, h:mm:ss a"
                                        )}
                                    </span>
                                    </div>
                                    <div className="col-md-3" style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                    {this.state.loadingweather?<Spinner color="info"/>:
                                        <><img src={"http://openweathermap.org/img/w/"+this.state.icon+".png"} style={{verticalAlign:'top'}}/>
                                         <span style={{marginTop:'0px',fontWeight:'bold'}}>{this.state.temperatureC}degrees</span></>
                                        }
                                   
                                    {/* {this.state.icon?<img src={"http://openweathermap.org/img/w/"+this.state.icon+".png"} style={{verticalAlign:'top'}}/>:null}
                                    <span style={{marginTop:'0px',fontWeight:'bold'}}>{this.state.temperatureC}degrees</span> */}
                                    </div>
                                    </div>
                                   
                                   
                                   
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4">
                            <EmpTasks {...this.props} />
                        </div>
                        <div className="col-md-4">
                            <EmpTodos {...this.props} />
                        </div>
                        <div className="col-md-4">
                            <EmpTime {...this.props} />
                        </div>
                    </div>
                </div>
                {this.state.chatBotOpen ? (
                    <div
                        style={{
                            borderRadius: 10,
                            border: "1px solid gray",
                            height: "500px",
                            width: "420px",
                            position: "absolute",
                            bottom: 50,
                            right: 10,
                            overflow: "hidden",
                            backgroundColor: "white",
                        }}
                    >
                        <iframe
                            title="chatbot"
                            src="https://chatbotnlp.herokuapp.com/"
                            style={{
                                height: "500px",
                                width: "100%",
                                border: "none",
                            }}
                        />
                    </div>
                ) : null}
                <Button
                    onClick={this.toggleChatBot}
                    style={{
                        height: 70,
                        width: 70,
                        borderRadius: 50,
                        position: "fixed",
                        bottom: 10,
                        right: 10,
                        backgroundColor: "#1876D2",
                    }}
                >
                    <BsFillChatFill size={30} />
                </Button>
            </>
        );
    }
}

export default EmpMain;
