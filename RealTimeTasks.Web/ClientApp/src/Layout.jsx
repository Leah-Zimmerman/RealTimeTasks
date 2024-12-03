import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

function Layout({ children }) {
      const {user,setUser} = useAuth();
      const nav = useNavigate();
      const onLogoutClick = async()=>{
        await axios.post('/api/account/logout');
        setUser(null);
      }
    return <>
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-dark bg-dark border-bottom box-shadow mb-3">
                <div className="container-fluid">
                    <div className="navbar-brand">Real Time Tasks</div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item"><Link to='/' className="nav-link text-light">Home</Link></li>
                            {!user && <li className="nav-item"><Link to='/signup' className="nav-link text-light">Signup</Link></li>}
                            {!user && <li className="nav-item"><Link to='/login' className="nav-link text-light">Login</Link></li>}
                            {!!user && <li className="nav-item"><Link to='/' className="nav-link text-light" onClick={onLogoutClick}>Logout</Link></li>}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
        <div className="container">
            <main role="main">
                {children}
            </main>
        </div>
    </>
}

export default Layout;