
import useFetch from "@/Hooks/useFetch";
import Author from "@/Libs/Auth";
import { Avatar, Badge, Box, Card, Container, Grid, Input, Stack } from "@mui/joy";
import { Press_Start_2P } from "next/font/google";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { HiAdjustmentsVertical, HiChatBubbleLeftEllipsis, HiEnvelope, HiWallet } from "react-icons/hi2";

export default function Header(props:any) {
    const router = useRouter()
    const {postData, response}  = useFetch()
    const [dataUser, setDataUser] = useState<any>({})

    useEffect(() => {
            postData('auth/check',{token:localStorage.getItem('_token_')})
            
            
    },[])

    useEffect(() => {
        if (response?.status && response?.msg === 'hase_Login') {
            setDataUser(response.user)            
        }

        if (!response?.status && response?.msg === 'dont_access') {
            router.push('/login')
            
        }
        
    }, [response])

    return (
            <Box component='header' className="center">
                <Card className="card" variant="outlined" sx={{ width: '100vw' }}>
                <Grid container spacing={2}>
                    <Grid xs={1}>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" size="md" />
                    </Grid>
                    <Grid xs={0.7}>
                    <Badge badgeContent={360}>
                        <HiEnvelope />
                    </Badge> 
                    </Grid>
                    <Grid xs={0.7}>
                    <Badge badgeContent={4}>
                    <HiChatBubbleLeftEllipsis />
                    </Badge>
                    </Grid>
                    <Grid xs={0.7}>
                    <HiAdjustmentsVertical />
                    </Grid>
                    <Grid xs={8.9}>
                        <div className="wallet" style={{float:'left',textAlign:'left'}}>
                            <Input readOnly value={dataUser?.fname} startDecorator={<HiWallet />} />
                        </div>
                    </Grid>
                </Grid>

                </Card>
            </Box>
    )
}