import { useState } from "react"
import axios from "axios"

const useFetch = () => {
       const [response, setResponse] = useState(null as any)
       const [status, setStatus] = useState(0)

    const postData = async(api='', data:any, header:any= {}) => {
        
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${api}`, data,{
            headers: header
        }).then((result:any) => {
            setResponse(result.data)
            setStatus(200)
        }).catch((err) => {
             setResponse(err?.response?.data)
             setStatus(100)
        })
    }

    const getData = async(api='', data=null) => {
        await axios.get(api, { params:data }).then((result:any) => {
            setResponse(result.data)
            setStatus(result.status)
        }).catch((err) => {
            setResponse(err.message)
            setStatus(err.response.status)
        })
    }

    return {response, status, postData, getData}
}

export default useFetch