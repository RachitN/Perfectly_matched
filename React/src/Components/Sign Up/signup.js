import { useEffect, useState, useRef } from 'react'
import './signup.css'
import data from '../../Data/signUpData.json'
import { Link, useNavigate } from 'react-router-dom'
import SignUpInput from '../signupInput/signupInput'
const SignUp = props =>{


    const [signUpDetails , setSignUpDetails] = useState({
        email:'',
        mobile:'',
        password: '',
        confirmPassword:'',
        dob:'',
        bio:'',
        location:'',
        interests:'',
        name:'',
        gender:''
    })

    const navigate = useNavigate();


    useEffect(()=>{
        console.log(signUpDetails)
        console.log(data)
        if(fieldNo<10)
            setNextValue()
        else
            callSignUpApi()
    },[signUpDetails])

    const name = useRef();
    const email = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const dob = useRef();
    const bio = useRef();
    const location = useRef();
    const interests = useRef();
    const mobile = useRef();
    const gender = useRef();
    const details = {"name": name, "email": email, "mobile": mobile, "password": password, "confirmPassword": confirmPassword, 
        "dob" : dob, "bio": bio,"location" : location, "interests":interests , "gender": gender}
    const fields ={1: "name", 2: "email", 7:"mobile", 3: "password", 4: "confirmPassword", 5:"dob", 6:"bio", 10:"location", 8:"interests", 9:"gender"}
    let [fieldNo, setFieldNo] = useState(0);


    const submitSignUpDetails = (event)=>{
        event.preventDefault()
        console.log(signUpDetails);

        setSignUpDetails(()=>{
            return {
                name: signUpDetails.name ? signUpDetails.name :name.current?.value ,
                email: signUpDetails.email ? signUpDetails.email :email.current?.value,
                password:signUpDetails.password ? signUpDetails.password :password.current?.value,
                confirmPassword:signUpDetails.confirmPassword ? signUpDetails.confirmPassword :confirmPassword.current?.value,
                dob: signUpDetails.dob ? signUpDetails.dob :dob.current?.value,
                bio: signUpDetails.bio ? signUpDetails.bio :bio.current?.value,
                location: signUpDetails.location ? signUpDetails.location :location.current?.value,
                interests: signUpDetails.interests ? signUpDetails.interests :interests.current?.value.split(','),
                mobile: signUpDetails.mobile ? signUpDetails.mobile :mobile.current?.value,
                gender: signUpDetails.gender ? signUpDetails.gender :gender.current?.value
            }
        })
    }

    const callSignUpApi = ()=>{
        fetch('http://localhost:5000/api/signUp',{      method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpDetails)}).then(res=>{
            navigate('/login')
            console.log(res)
        }).catch(error=>{
            console.log(error)
        })
    }
    const [inputDetails,setInputDetails] = useState({})

    const setNextValue = ()=>{
        setFieldNo(prevFieldNo => {
            const newFieldNo = prevFieldNo + 1;
    
            // Use the updated fieldNo for the next state change
            setInputDetails({
                value: details[fields[newFieldNo]],
                id: data[newFieldNo - 1][fields[newFieldNo]]['id'],
                name: data[newFieldNo - 1][fields[newFieldNo]]['name'],
                type: data[newFieldNo - 1][fields[newFieldNo]]['type'],
                placeholder: data[newFieldNo - 1][fields[newFieldNo]]['placeholder']
            });
    
            return newFieldNo; // Return the updated field number
        });
    }

    return (
        <div className='signup'>
  <div class="login-box">
  <div class="welcome-text">Let's Start Your Jorney to meet your perfect match</div>
    <form className='sign_up_form' onSubmit={submitSignUpDetails}>
    <SignUpInput  data={inputDetails}> </SignUpInput>
    {fieldNo < 10 && <button type='submit'>Next</button>}
    {fieldNo == 10 &&<button type='submit'>Register</button>}
    </form>
        <h5>Already a User. <Link to="/login">Login Here</Link>  </h5> 
    </div>
        </div>
    )
}

export default SignUp