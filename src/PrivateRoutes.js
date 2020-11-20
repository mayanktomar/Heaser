import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }, props) {
    const [token, setToken] = useState(null);

    const getToken = async () => {
        let data = await localStorage.getItem("heaserToken");
        console.log(data);
        setToken(data);
    };

    useEffect(() => {
        getToken();
    }, [token]);

    return (
        <Route
            {...rest}
            render={(props) =>
                token !== "null" ? (
                    <Component {...rest} {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { referer: props.location },
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute;
