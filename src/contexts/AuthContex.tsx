import { type ReactNode, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConnection";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
    children: ReactNode
}

interface UserProps{
    uid: string;
    name: string | null
    email: string | null
}
function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)


    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(user){
                //Tem user logado!!!
                setUser({
                    uid: user.uid,
                    name:user?.displayName ?? null,
                    email: user?.email
                })
                setLoadingAuth(false)
            }else{
                //Não tem usuário logado!!!
                setUser(null)
                setLoadingAuth(false)
            }
        })

        return () => {
            unsub();
        }
    }, [])

    function handleInfoUser({name, email, uid}: UserProps){
        setUser({
            name,
            email,
            uid
        })
    }

    return (
        <AuthContext.Provider
            value={{
                signed: !!user,
                loadingAuth,
                handleInfoUser,
                user
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
