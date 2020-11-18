import React, { Component } from 'react';
import AskLogin from './AskLogin';
import Header from './Header';
import {Switch,Route,BrowserRouter, Redirect} from 'react-router-dom';
import OrgDashboard from './OrgDashboard';
import AddEmployee from './AddEmployee';
import EmpMain from './EmpMain';

export class MainComponent extends Component {
    render() {
        return (
            <div>
                 {/* <BrowserRouter>
                 <Header/>
                    <Switch location={this.props.location}>
                        <Route path='/home' component={AskLogin}/>
                        <Route path='/organization' component={OrgDashboard}/>
                        <Route exact path="/">
                            <Redirect to="/home" />
                        </Route>
                    </Switch>
                
                <AskLogin/>
                </BrowserRouter> */}
                <Header/>
                {/* <AskLogin/> */}
                {/* <OrgDashboard/> */}
                {/* <AddEmployee/> */}
                <EmpMain/>
            </div>
        )
    }
}

export default MainComponent
