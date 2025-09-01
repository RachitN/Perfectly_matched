import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UserProfile from "../user_profile/user_profile";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const Match = props =>{

    const id = useSelector(state => state.login_id)
    const [matches , setMatches] = useState([]);
    let [index , setIndex] = useState(0);

    useEffect(()=>{
        const getMatches = async()=>{
            try{
                const response = await axios.post('http://localhost:5000/api/getmatch',{
                    id:id
                })
                setMatches(()=>{
                    return response.data
                })
            }catch(err){

            }
        }

        getMatches()
       },[])

       const previous = ()=>{
        setIndex((prev)=>{
            const newIndex = prev - 1
            if(newIndex >= 0)
                return newIndex;
            else
                return matches.length - 1
        })
    }

    const next = ()=>{
        setIndex((prev)=>{
            const newIndex = prev + 1
            if(newIndex < matches.length)
                return newIndex;
            else
                return 0
        })
    }

    return (
        <div className="user_box">
            <div className='profile-container'>
            { <div onClick={previous}  className='next'><FontAwesomeIcon  icon={faChevronLeft} /></div>}
            <UserProfile key={matches[index]} data = {matches[index]}></UserProfile>
            { <div onClick={next} className='next'><FontAwesomeIcon  icon={faChevronRight} /></div>}
            </div>
        </div>
    )
}

export default Match;