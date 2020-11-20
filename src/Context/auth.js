import { createContext, useContext } from "react";

//Auth Context
export const AuthContext = createContext({
    token: null,
    setToken: (data) => {},
    data: null,
    setData: (data) => {},
    userId: null,
    setUserId: (data) => {},
    type: null,
    setType: (data) => {},
});

export function useAuthContext() {
    return useContext(AuthContext);
}
