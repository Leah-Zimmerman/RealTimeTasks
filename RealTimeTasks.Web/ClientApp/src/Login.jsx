import React,{useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Login = () => {
    
    const [email, setEmail] = useState('');
    const [password,setPassword]=useState('');
    const [isValidUser,setIsValidUser]=useState(true);
    const {setUser} = useAuth();

    const nav = useNavigate();

    const onFormSubmit=async(e)=>{
        e.preventDefault();

        const {data:user} = await axios.post('/api/account/login',{email,password});
        if(!user){
            setIsValidUser(false);
        }else{
            setIsValidUser(true);
            setUser(user);
            nav('/');
        }
    }
    
    return (<>
        <div className="container">
            <div className="row" style={{ alignItems: 'center', display: 'flex', minHeight: '80vh' }}>
                <div className="shadow bg-light p-4 col-md-6 offset-md-3">
                    <h3>Log in to your account</h3>
                    {!isValidUser&&<div className="alert alert-danger">Invalid email or password</div>}
                    <form onSubmit={onFormSubmit}>
                        <div className="mt-3">
                            <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" />
                        </div>
                        <div className="mt-3">
                            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" />
                        </div>
                        <div className="mt-3">
                            <button className="btn btn-primary">Login</button>
                        </div>
                    </form>
                    <Link to='/signup'>Sign up for a new account</Link>
                </div>
            </div>
        </div>
    </>)
}
export default Login;