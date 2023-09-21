import Container from "@/Layouts/Continer"
import { Box, Button, Card, Divider, FormLabel, Input, Option, Select, Typography } from "@mui/joy"
import { IconButton } from "@mui/material"
import Link from "next/link"
import { AiOutlineKey, AiOutlineUser } from "react-icons/ai"
import { HiMap } from "react-icons/hi2"

export default function Dynamic() {

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
                                            value=''
                                            className="text-center"
                                        />
                                </FormLabel>
                                <FormLabel>
                                        <span>انتخاب زبان</span>
                                        <Select
                                            size={'lg'}
                                            value=''
                                            sx={{width:'100%'}}
                                        >
                                            <Option value='FA'>Persian</Option>
                                            <Option value='EN'>English</Option>
                                            <Option value='AR'>Arabic</Option>
                                        </Select>
                                </FormLabel>
                                    <IconButton 
                                    sx={{textAlign:'left',width:'25%',float:'left',fontSize:16}}
                                    >
                                        <Link href='/login'>
                                            <AiOutlineKey /> 
                                            ورود با کلمه عبور 
                                        </Link>
                                    </IconButton>
                                <Button variant="soft" >ورود به سایــــت</Button>
<br/>
                    
                    </Card>
                </Box>
        </main>
    )
}