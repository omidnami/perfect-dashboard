import { createContext } from "react";


const UserContext = createContext({
  fname:'',
  lname:'',
  id:0,
})


export default UserContext