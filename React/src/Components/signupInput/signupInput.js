import { useEffect, useState } from "react"

const SignUpInput = (props)=>{

        const [value,setValue] = useState('');
            useEffect(()=>{
                setValue('')
            },[props.data?.value])

    return(
        <>
            <input value={value} placeholder={props.data?.placeholder}ref = {props.data?.value} id={props.data?.id} name={props.data?.name} type={props.data?.type} onChange={(e)=>{setValue(e.target.value)}}/>
        </>
    )
}

export default SignUpInput