import React,{useContext,createContext,useState,useEffect} from "react";
import axios from "axios";

const AuthContext = createContext();
const AuthContextComponent = ({children})=>{

    const [user,setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        const getUser=async()=>{
            const {data:user} = await axios.get('/api/account/getUser');
            setUser(user);
            setIsLoading(false);
        }
        getUser();
    },[]);

    if(isLoading){
        return <h1>Loading...</h1>
    }

    return(
        <AuthContext.Provider value={{user,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}
var useAuth = ()=>{
    return useContext(AuthContext);
}

export {AuthContextComponent,useAuth};