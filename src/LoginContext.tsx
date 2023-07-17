import React from "react";

interface LoginInfo {
    userId: string;
    role: string;
}

interface LoginContextType {
    loginInfo: LoginInfo | null;
    setLoginInfo: (loginInfo: LoginInfo | null) => void
}

// export only for provider                                       object has fields but are empty now
export const LoginContext = React.createContext<LoginContextType>({} as LoginContextType);

// export for consumers
export const useLoginContext = () => React.useContext(LoginContext);
