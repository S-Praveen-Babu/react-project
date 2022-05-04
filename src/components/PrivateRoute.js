import {useAuthStatus} from './useAuthStatus'
import { Navigate , Outlet } from 'react-router-dom'
// import   Spinner from '../assets/spinner.gif' 

const PrivateRoute = () => {
 const {logged,loading}=useAuthStatus()
   if(loading) return <p>Loading....</p>
   return logged? <Outlet />:<Navigate to="/sign-in" />
}

export default PrivateRoute