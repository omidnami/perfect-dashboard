import Header from "@/Components/header";
import Lang from "@/Components/lang";
import Menu from "@/Components/menu";
import TagMaker from "@/Components/tagMaker";
import Container from "@/Layouts/Continer";
import { AspectRatio, Box, Button, Card, Divider, FormLabel, Grid, Input, Option, Select, Textarea } from "@mui/joy";
import { FormControlLabel, Switch } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Base() {
    const router = useRouter()
    const [file, setFile] = useState()
    const [fileLoad, setFileLoad] = useState()
    return (
        <main className="main">
            <Menu />
            <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'60%',float:'right'}}>تنظیمات اصلی</h1>
            <div style={{marginTop:'25px',marginBottom:'25px',width:'40%',float:'left'}}>
                    <Lang style={{
                            width:'100%',
                        }}
                    />
            </div>
            <div style={{clear:'both'}}></div>
            <Divider />
                <Box component='section'>
                    <Card className="card">
                        <Grid container spacing={1.5} sx={{paddingBottom:'30px',paddingTop:'30ox'}}>
                            <Grid xs={12} sm={12} md={5} lg={5}>
                            <FormLabel>
                                    <span>عنوان صفحه</span>
                                <Input
                                    size={'lg'}
                                    startDecorator={'T'}
                                    fullWidth
                                    value=''
                                />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={12} md={5} lg={5}>
                            <FormLabel>
                                    <span>دامنه سایت</span>
                                <Input
                                    size={'lg'}
                                    startDecorator={'T'}
                                    fullWidth
                                    value=''
                                />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={12} md={2} lg={2}>
                            <FormLabel>
                                    <span>زبان اصلی سایت</span>
                                <Select
                                    size={'lg'}
                                    value=''
                                    sx={{width:'100%'}}
                                >
                                    <Option value="FA">persian</Option>
                                    <Option value="EN">english</Option>
                                    <Option value="AR">arabic</Option>
                                </Select>
                                </FormLabel>
                            </Grid>

                            <Grid xs={12}>
                            <FormLabel>
                                    <span>توضیحات کوتاه</span>
                                <Textarea
                                sx={{width:'100%'}}
                                minRows={3}></Textarea>
                                <span>0/150</span>
                            </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={12} md={4} lg={4}>
                            <FormLabel>
                                    <br />
                            <FormControlLabel
                                sx={{marginTop:2}}
                                control={<Switch defaultChecked 
                                sx={{paddingLeft:2,marginBottom:1.5,direction:'ltr'}} />} label="وضعیت سایت" />  
                            </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={12} md={8} lg={8}>
                            <FormLabel>
                                    <span>کلمات کلیدی</span>
                                <TagMaker
                                id='tag'
                                    />
                            </FormLabel>
                            </Grid>
<Grid xs={12}>
    <Divider/>
    <br/>
</Grid>
                            <Grid xs={12} sm={12} md={4} lg={4}>
                            <AspectRatio minHeight="120px">
                            <img
                            src={file?URL?.createObjectURL(file):fileLoad??'/no-image.png'}
                            srcSet={file?URL?.createObjectURL(file):fileLoad??'/no-image.png'}
                            loading="lazy"
                            alt=""
                            />
                            </AspectRatio>
                            <label className="primary btn btn-primary"> آپلود لوگو لایت
                            <Input
                            type="file"
                            hidden
                            />
                            </label> 
                            </Grid>
                            <Grid xs={12} sm={12} md={4} lg={4}>
                            <AspectRatio minHeight="120px">
                            <img
                            src={file?URL?.createObjectURL(file):fileLoad??'/no-image.png'}
                            srcSet={file?URL?.createObjectURL(file):fileLoad??'/no-image.png'}
                            loading="lazy"
                            alt=""
                            />
                            </AspectRatio>
                            <label className="primary btn btn-primary"> آپلود لوگو دارک
                            <Input
                            type="file"
                            hidden
                            />
                            </label> 
                            </Grid>
                            <Grid xs={12} sm={12} md={4} lg={4}>
                            <AspectRatio minHeight="120px">
                            <img
                            src={file?URL?.createObjectURL(file):fileLoad??'/no-image.png'}
                            srcSet={file?URL?.createObjectURL(file):fileLoad??'/no-image.png'}
                            loading="lazy"
                            alt=""
                            />
                            </AspectRatio>
                            <label className="primary btn btn-primary"> آپلود ایکون
                            <Input
                            type="file"
                            hidden
                            />
                            </label> 
                            </Grid>
                        </Grid>
                    </Card>

                    <Card className="card" sx={{marginTop:'10px'}}>

                    <Button className="primary">ثبت اطلاعات</Button>                    
                </Card>
                </Box>
                
            </Container>
        </main>
    )
}