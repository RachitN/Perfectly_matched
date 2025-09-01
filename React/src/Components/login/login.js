import { useState } from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios';
const Login = props =>{

    const default_refresh_time = useSelector(state => state.default_refresh_time)

    const navigate = useNavigate();

    const [loginDetails, setLoginDetails] = useState({
        email:'',
        password:''
    })

    const setEmail = (event)=>{
        setLoginDetails((prev)=>{
            return {
                ...prev,
                email: event.target.value
            }
        })
    }

    const setPassword = (event)=>{
        setLoginDetails((prev)=>{
            return {
                ...prev,
                password: event.target.value
            }
        })
    }

    const submitLoginDetails = async (event) => {
        event.preventDefault();
    
        try {
            const loginResponse = await axios.post('http://localhost:5000/api/login', loginDetails);
            const loginData = loginResponse.data;
            localStorage.setItem('token', JSON.stringify(loginData.token));
            if (loginData.token) {
                await axios.post(
                    'http://localhost:5000/api/collectUsers',
                    { token: loginData.token },);
                redirectToUser(loginData.id);
            } else {
                console.log("Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const redirectToUser = (data)=>{
        navigate(`/user`)
      }
    return(
        <div className='login'>
            <div class="login-box">
                <div class="welcome-text">Let's drive you to meet your perfect match</div>
                <form  onSubmit={submitLoginDetails}>
                    <label for="email">Email:</label><br></br>
                    <input value={loginDetails.email} type="email" id="email" name="email" onChange={setEmail} /><br></br>
                    <label for="password">Password:</label><br></br>
                    <input value={loginDetails.password} type="password" id="password" name="password" onChange={setPassword} /><br></br>
                    <button type="submit" >Login</button>
                </form>
                <a href="" class="register-link"><Link to="/signup">New User? Register Here</Link></a>
            </div>
        </div>
    )
}

export default Login