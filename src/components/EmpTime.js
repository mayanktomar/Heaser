import React, { Component } from 'react'
import { Button } from 'reactstrap';
import querystring from 'query-string';
import axios from 'axios';

export class EmpTime extends Component {

    constructor(props){
        super(props);
        this.state={
            code:''
        }
    }
    
    componentDidMount=()=>{
        // let search=window.location.search;
        // const parsed=querystring.parse(search);
        // this.setState({
        //     code:parsed.code
        // })

        axios.get("/courses/get-courses", {
            page: 1,
            page_size: 10,
            category: "Development",
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
       
    }

    
    render() {
        return (
            <div>
                <a target="_blank" href="https://wakatime.com/oauth/authorize?client_id=TRCp0dKnVHWPc91II89xckEd&client_secret=sec_ulgjonFt5oGcIDeDJDZvABNfoqCEoiEuoGFjFgObeT28BZCmI8EFW3K5gfvRvgBkDtFcUpDSczsUPxQZ&redirect_uri=http://localhost:3000/task&scope=read_stats,email,read_logged_time,write_logged_time,read_orgs,read_private_leaderboards,write_private_leaderboards&response_type=code&name=HeaseR"><Button style={{
                        backgroundColor: "#3e98c7",
                        width: "75%",
                        color: "black",
                        display: "block",
                        margin: "auto",
                    }}>Link your Wakatime</Button></a>
            </div>
        )
    }
}

export default EmpTime
