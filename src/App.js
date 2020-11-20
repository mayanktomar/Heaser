import { useState, useEffect } from "react";
import "./App.css";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import AskLogin from "./Pages/AskLogin";
import OrgDashboard from "./Pages/OrgDashboard";
import PrivateRoute from "./PrivateRoutes";
import { AuthContext } from "./Context/auth";

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

    useEffect(() => {
        getToken();
        getUserId();
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
                        <PrivateRoute
                            path="/organization"
                            component={OrgDashboard}
                        />
                    </AuthContext.Provider>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
