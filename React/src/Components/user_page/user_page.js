import UserProfile from '../user_profile/user_profile'
import data from '../../Data/user_data.json'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './user_page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
const UserData = props =>{

    const id = useSelector(state => state.login_id)

    const _ = require('lodash');
    useEffect(()=>{
        getUserData();
    },[])

    let [index , setIndex] = useState(0);

    const navigate = useNavigate();
    const [userData,setUserData]= useState([]);

    const getUserData = ()=>{
        if(!id){
            navigate('/login')
        }
        fetch('http://localhost:5000/api/data',{
         method : 'POST', headers: {
            'Content-Type': 'application/json'
          } ,
         body:JSON.stringify({id:id}) 
        }).then((response) => response.json()).then((data)=>{setUserData(()=>{
            if(data && data.length>0)
                return data
            else
                navigate('/login')
        })})
    }

    const previous = ()=>{
        setIndex((prev)=>{
            const newIndex = prev - 1
            if(newIndex >= 0)
                return newIndex;
            else
                return userData.length - 1
        })
    }

    const next = ()=>{
        setIndex((prev)=>{
            const newIndex = prev + 1
            if(newIndex < userData.length)
                return newIndex;
            else
                return 0
        })
    }
    return (
        <div className="user_box">
            <div className='profile-container'>
            { <div onClick={previous}  className='next'><FontAwesomeIcon  icon={faChevronLeft} /></div>}
            <UserProfile key={userData[index]} data = {userData[index]} isLogin='login'></UserProfile>
            { <div onClick={next} className='next'><FontAwesomeIcon  icon={faChevronRight} /></div>}
            </div>
        </div>
    )
}

export default UserData