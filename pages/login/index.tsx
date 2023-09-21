import useFetch from "@/Hooks/useFetch"
import Container from "@/Layouts/Continer"
import { Box, Button, Card, Divider, FormLabel, Input, Option, Select, Typography } from "@mui/joy"
import { IconButton } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { AiOutlineKey, AiOutlineUser } from "react-icons/ai"

export default function Login() {
        const router = useRouter()
        const [data, setData] = useState({userName:'',password:''})
        const [lang, setLang] = useState<any>('FA')
        const {response, postData} = useFetch()
        
        useEffect(() => {
                postData('auth/check',{token:localStorage.getItem('_token_')})
        },[])
        useEffect(() => {
            console.log(response);
            if (response?.status && response?.msg === 'hase_Login') {
                router.push('/')
            }
            if (response?.status && response?.msg === 'success') {
                localStorage.setItem('_lang_', lang)
                localStorage.setItem('_token_',response.authorisation.token)
                router.push('/')
            }
            document.body.classList.remove('loading')
        }, [response])

        const onLoginHandle = () => {
            document.body.classList.add('loading')
            console.log(data);
            
            postData('auth/login',data)
        }
    return (
        <main>
                <Box
                sx={{
                    width:'98%',
                    height:'600px',
                    maxWidth:'600px',
                    margin:'0 auto',
                    verticalAlign:'center',
                    marginTop:'10%'
                }}
                component='section'>
                    <Card className='card'>
                        <Box sx={{float:'left',width:'50%'}}></Box>
                        <Box sx={{float:'left',width:'50%'}}>
                            <Typography
                                component='h5'>
                                    ورود مدیر
                                </Typography>
                        </Box>
                        <Divider />
                        <br/>
                                <FormLabel>
                                        <span>ایمیل یا شماره موبایل</span>
                                        <Input
                                            size={'lg'}
                                            startDecorator={<AiOutlineUser />}
                                            fullWidth
                                            value={data.userName}
                                            className="text-center"
                                            onChange={(e) => {
                                                setData({...data,userName:e.target.value})
                                            }}
                                        />
                                </FormLabel>
                                <FormLabel>
                                        <span> کلمه عبور  </span>
                                        <Input
                                            size={'lg'}
                                            startDecorator={<AiOutlineKey />}
                                            fullWidth
                                            value={data.password}
                                            className="text-center"
                                            type="password"
                                            onChange={(e) => {
                                                setData({...data,password:e.target.value})
                                            }}
                                        />
                                </FormLabel>

                                <FormLabel>
                                        <span>انتخاب زبان</span>
                                        <Select
                                            size={'lg'}
                                            value={lang}
                                            sx={{width:'100%'}}
                                            onChange={(e, v) => {
                                                    setLang(v)
                                            }}
                                        >
                                            <Option value='FA'>Persian</Option>
                                            <Option value='EN'>English</Option>
                                            <Option value='AR'>Arabic</Option>
                                        </Select>
                                </FormLabel>
                                    <IconButton 
                                    sx={{textAlign:'left',width:'25%',float:'left',fontSize:16}}
                                    >
                                        <Link href='/login/dynamic'>
                                            <AiOutlineKey /> 
                                            ورود با رمز پویا
                                        </Link>
                                    </IconButton>
                                <Button variant="soft"
                                onClick={() => onLoginHandle()}
                                >ورود به سایــــت</Button>
<br/>
                    
                    </Card>
                    <br/>
                    <Typography sx={{textAlign:'center',color:'gray'}}
                    className='mute text-mute text-small'
                    >
                        powered: portalirani 2023
                    </Typography>
                </Box>
        </main>
    )
}