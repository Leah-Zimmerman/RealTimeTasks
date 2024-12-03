import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Login from './Login';
import Signup from './Signup';
import { AuthContextComponent } from './AuthContext';
import Home from './Home';
import PrivateRoute from './PrivateRoute';

const App = () => {
    return (
        <>
            <AuthContextComponent>
                <Layout>
                    <Routes>
                        <Route path='/' element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                    </Routes>
                </Layout>
            </AuthContextComponent>
        </>
    )
}

export default App;