import { useNavigate, useSearchParams } from 'react-router-dom';
import './user_profile.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
const UserProfile = props=>{
    const id = useSelector(state => state.login_id)
    const navigate = useNavigate()
    const getAge = (dob)=>{
        let difference = (new Date().getTime()- new Date(dob).getTime())/31536000000
        difference = Math.floor(difference)
        return difference;
    }

    const [matchVariables, setMatchVariables] = useState();

    useEffect(()=>{
        checkMatch();
    },[props.data?.id])

    const checkMatch = async ()=>{
        try {
            const response = await axios.post('http://localhost:5000/api/checkmatch',{
                selfid : id,
                matchid: props.data.id
            })
            setMatchVariables(()=>{
                return response.data[0]
            })
            console.log(response.data)
        }
        catch(err){

        }
    }

    const redirectToMessage = ()=>{
        console.log(props)
        // match()
        localStorage.setItem(`${props.data?.id}`, `${props.data?.name}`)
        localStorage.setItem('messageId',`${props.data?.id}`)
        navigate(`/message`)
    }

    const matchUser = async ()=>{
        try{
           const response =  await axios.post('http://localhost:5000/api/match',{
                selfid:id,
                matchid:props.data.id
            })
            navigate(`/user/match`)
        }

        catch(err){

        }
    }

    const accept = async ()=>{

        try {
            const response = await axios.post('http://localhost:5000/api/accept',{
                selfid : id,
                matchid: props.data.id
            })

            console.log(response)
        }

        catch(err){

        }
    }
    return (
        <div className={(props.isLogin == 'login' && props.data?.ismatch) ? 'profile_box' : 'profile_box'} >
            <h1 className="name_age">{props.data?.name}({getAge(props.data?.dob)})</h1>
            <h3>{props.data?.gender}</h3>
            <p className="location">{props.data?.location}</p>
            <p className="bio">{props.data?.bio}</p>
            <p className="interests">Interests: </p>
            <ul>{props.data?.interests.map(((value,key)=>{
                return <li key ={value}>{value}</li>
            }))}</ul>
            {(props.isLogin != 'login' && !matchVariables?.selfmatch) && <button onClick={accept}> Accept</button>}
            {(props.isLogin != 'login' && matchVariables?.selfmatch && matchVariables?.othermatch) && <button onClick={redirectToMessage}> Message</button>}
            {(props.isLogin != 'login' && matchVariables?.selfmatch && !matchVariables?.othermatch) && <button> Waiting For Acceptance</button>}
            {(props.isLogin == 'login' && !props.data?.ismatch) && <button onClick={matchUser}>Match</button>}
            {(props.isLogin == 'login' && props.data?.ismatch) && <button >Interest Sent Already</button>}
            {/* {matchVariables} */}
        </div>
    )
}

export default UserProfile