import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = () => {

    const [user,setUser] = useState({
        firstName:'',
        lastName:'',
        email:'',
        password:''
    });
    const nav = useNavigate();

    const onChange = (e) => {
        const copy = {...user};
        copy[e.target.name] = e.target.value;
        setUser(copy);
        console.log(user);
    }

    const onFormSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/account/signup',user);
        nav('/login');
    }

    return (<>
        <div className="container">
            <div className="row" style={{ alignItems: 'center', display: 'flex', minHeight: '80vh' }}>
                <div className="shadow bg-light p-4 col-md-6 offset-md-3">
                    <h3>Sign up for a new account</h3>
                    <form onSubmit={onFormSubmit}>
                        <div className="mt-3">
                            <input type="text" placeholder="First Name" className="form-control" name="firstName" value={user.firstName} onChange={onChange}/>
                        </div>
                        <div className="mt-3">
                            <input type="text" placeholder="Last Name" className="form-control" name="lastName" value={user.lastName} onChange={onChange}/>
                        </div>
                        <div className="mt-3">
                            <input type="text" placeholder="Email" className="form-control" name="email" value={user.email} onChange={onChange}/>
                        </div>
                        <div className="mt-3">
                            <input type="password" placeholder="Password" className="form-control" name="password" value={user.password} onChange={onChange}/>
                        </div>
                        <div className="mt-3">
                            <button className="btn btn-primary">Signup</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>)
}
export default Signup;