import { Avatar, Badge, Box, Card, Container, Grid, Input, Stack } from "@mui/joy";
import { Press_Start_2P } from "next/font/google";
import { HiAdjustmentsVertical, HiChatBubbleLeftEllipsis, HiEnvelope, HiWallet } from "react-icons/hi2";

export default function Header(props:any) {
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
                        <Input readOnly value={'2,600 تومان'} startDecorator={<HiWallet />} />
                    </div>
                </Grid>
            </Grid>

            </Card>
        </Box>
    )
}