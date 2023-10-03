import { createContext } from "react";


const ConfContext = createContext({
  title:'',
  domain:'',
  logoDark:'',
  logoLight:'',
  defaultLang:''
})


export default ConfContext