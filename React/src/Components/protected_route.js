import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { updateGlobalProp } from "../update_global_store";

function ProtectedRoute({ elemnt: Component, redirectToUser = false }) {
    const [isLoggedIn, setLoggedIn] = useState(null); // Initialize with null to handle loading state

    useEffect(() => {
        const getToken = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/token",{token:JSON.parse(localStorage.getItem('token'))});
                if(!localStorage.getItem('token')){
                    setLoggedIn(false);
                    return;
                }
                updateGlobalProp('login_id', response.data.login_id)
                setLoggedIn(response.data.login);
                if(!response.data.login){
                    localStorage.clear('token')
                }
            } catch (error) {
                console.error("Error fetching token", error);
                setLoggedIn(false); // Set to false if there's an error
            }
        };

        getToken(); // Call the async function
    }, [Component]);

    if (isLoggedIn === null) {
        // Show a loading indicator or nothing while waiting for the token
        return <div>Loading...</div>;
    }

    if (!redirectToUser) {
        return isLoggedIn ? <Component /> : <Navigate to="/login" />;
    } else {
        return !isLoggedIn ? <Component /> : <Navigate to="/user" />;
    }
}

export default ProtectedRoute;
