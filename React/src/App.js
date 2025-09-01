import logo from './logo.svg';
import './App.css';
import SignUp from './Components/Sign Up/signup';
import UserData from './Components/user_page/user_page';
import Login from './Components/login/login';
import { useEffect, useState } from 'react';
import {Link, Route, Routes, useNavigate } from 'react-router-dom';
import Message from './Components/message/message';
import { Provider} from 'react-redux';
import axios from 'axios';
import store from './redux_store';
import { updateGlobalProp } from './update_global_store';
import Match from './Components/match/match';
import Home from './Components/home/home';
import ProtectedRoute from './Components/protected_route';
import Header from './Components/header/header';


function App() {
  const [userVariables, setUserVariables] = useState({
    login: false,
    signup: true,
    user: false
  })

  useEffect(()=>{
    const fetchConfig = async ()=>{
      try{
        const response = await axios.get('http://localhost:5000/api/config');
        response.data.forEach((data)=>{
          updateGlobalProp(data.key,data.value)
        })
      }catch(err){

      }
    }
    fetchConfig();
  },[])

  const navigate = useNavigate();

  const [userId, setUserId] = useState()

  const redirectLogin = ()=>{
    setUserVariables(()=>{
      return {
        login: true,
        signup: false,
        user: false
      }
    })
  }

  const redirectSignUp = ()=>{
    setUserVariables(()=>{
      return {
        login: false,
        signup: true,
        user: false
      }
    })
  }


  return (
    <div className='App'>
      <Provider store={store}>
      <Header></Header>
      <Routes>
      <Route path='/' element={<ProtectedRoute elemnt={Home} redirectToUser = {true}></ProtectedRoute>}></Route>
        <Route path='/signup' element={ <ProtectedRoute elemnt={SignUp} redirectToUser = {true}></ProtectedRoute>}></Route>
        <Route path='/login' element={<ProtectedRoute elemnt={Login} redirectToUser = {true}></ProtectedRoute>}></Route>
        <Route path='/user' element={<ProtectedRoute elemnt={UserData}></ProtectedRoute>}></Route>
        <Route path='/message' element={<ProtectedRoute elemnt={Message}></ProtectedRoute>}></Route>
        <Route path='/user/match' element={<ProtectedRoute elemnt={Match}></ProtectedRoute>}></Route>
      </Routes>
      </Provider>
    </div>
  );
}

export default App;
