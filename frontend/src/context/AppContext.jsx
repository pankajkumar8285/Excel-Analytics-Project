import axios from "axios";
import { createContext, useState } from "react"
import { toast } from "react-toastify";


const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl ="https://excel-analytics-project-7jke.onrender.com";
    const [isLoggedin, setLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [adminData, setAdminData] = useState(null)

    const getUserData = async() => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/v1/user/get-user`, {
        withCredentials: true, 
    });
            data.success ? setUserData(data.data)
 :
            toast.error(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            
        }
    }

    const getAdminData = async() => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/v1/admin/profile`, {
                withCredentials: true
            });
            data.success ? setAdminData(data.data) :
            toast.error(data.message)
        } catch (error) {
            toast.error(error.response?.data?.me || "Somthing went wrong")
            
        }
    }
    const value = {
        backendUrl,
        isLoggedin, setLoggedin,
        userData, setUserData,
        adminData,setAdminData,
        getAdminData,
        getUserData

    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}


export { AppContext }
