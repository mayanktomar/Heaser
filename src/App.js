import { useState, useEffect } from "react";
import "./App.css";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import AskLogin from "./Pages/AskLogin";
import OrgDashboard from "./Pages/OrgDashboard";
import PrivateRoute from "./PrivateRoutes";
import { AuthContext } from "./Context/auth";
import Chat from "./Pages/Chat/Chat";
import AddEmployee from "./Pages/AddEmployee";
import EmpMain from "./Pages/EmpMain";
import EmpAnnouncements from "./Pages/EmpAnnouncements";
import EmpLeave from "./Pages/EmpLeave";

function App() {
    const [token, setToken] = useState(null);
    const [data, setData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [type, setType] = useState(null);

    const getToken = async () => {
        let data = await localStorage.getItem("heaserToken");
        setToken(data);
    };

    const getUserId = async () => {
        let data = await localStorage.getItem("userId");
        setUserId(data);
    };

    const getType = async () => {
        let data = await localStorage.getItem("heaserType");
        setType(data);
    };

    const getUserData = async () => {
        let data = await localStorage.getItem("heaserData");
        setData(JSON.parse(data));
    };

    useEffect(async () => {
        await getToken();
        await getUserId();
        await getType();
        await getUserData();
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <AuthContext.Provider
                        value={{
                            token,
                            data,
                            userId,
                            type,
                            setData,
                            setToken,
                            setType,
                            setUserId,
                        }}
                    >
                        <Route exact path="/" component={AskLogin} />
                        <PrivateRoute path="/workspace" component={Chat} />
                        <PrivateRoute
                            path="/organization"
                            component={OrgDashboard}
                        />
                        <PrivateRoute
                            path="/add-employee"
                            component={AddEmployee}
                        />
                        <PrivateRoute path="/task" component={EmpMain} />
                        <PrivateRoute path="/leave" component={EmpLeave} />
                        <PrivateRoute
                            path="/announcement"
                            component={EmpAnnouncements}
                        />
                    </AuthContext.Provider>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
