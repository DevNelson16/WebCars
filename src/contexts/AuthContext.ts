import { createContext } from "react";

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
};

export const AuthContext = createContext({} as AuthContextData);
