import { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import { AuthContext } from "./Context/auth";

const AskLogin = lazy(() => import("./Pages/AskLogin"));
const OrgDashboard = lazy(() => import("./Pages/OrgDashboard"));
const Chat = lazy(() => import("./Pages/Chat/Chat"));
const AddEmployee = lazy(() => import("./Pages/AddEmployee"));
const EmpMain = lazy(() => import("./Pages/EmpMain"));
const EmpAnnouncements = lazy(() => import("./Pages/EmpAnnouncements"));
const EmpLeave = lazy(() => import("./Pages/EmpLeave"));
const Profile = lazy(() => import("./Pages/Profile"));
const Personality = lazy(() => import("./Pages/Personality"));
const EmpResources = lazy(() => import("./components/EmpResources"));
const ViewEmp = lazy(() => import("./Pages/ViewEmp"));
const WelcomeKit = lazy(() => import("./Pages/WelcomeKit"));

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

    useEffect(() => {
        getToken();
        getUserId();
        getType();
        getUserData();
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
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
                    <Suspense fallback={<div className="App-header"></div>}>
                        <Switch>
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
                            <PrivateRoute
                                path="/view-employees"
                                component={ViewEmp}
                            />
                            <PrivateRoute path="/task" component={EmpMain} />
                            <PrivateRoute path="/leave" component={EmpLeave} />
                            <PrivateRoute
                                path="/announcement"
                                component={EmpAnnouncements}
                            />
                            <PrivateRoute
                                path="/onboarding-portal"
                                component={WelcomeKit}
                            />
                            <PrivateRoute
                                path="/resources"
                                component={EmpResources}
                            />

                            <PrivateRoute
                                path="/profile"
                                component={Profile}
                                update={true}
                            />
                            <PrivateRoute
                                path="/employee/:id"
                                component={Profile}
                                update={false}
                            />
                            <PrivateRoute
                                path="/personality"
                                component={Personality}
                            />
                            {token !== null && token !== "null" ? (
                                <Redirect
                                    to={
                                        type === "organization"
                                            ? "/organization"
                                            : "/task"
                                    }
                                />
                            ) : null}
                        </Switch>
                    </Suspense>
                </AuthContext.Provider>
            </BrowserRouter>
        </div>
    );
}

export default App;
