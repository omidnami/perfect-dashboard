import useFetch from "@/Hooks/useFetch";
import { Alert, AspectRatio, Box, Button, Card, CardContent, Chip, Divider, Grid, IconButton, Input, LinearProgress, Link, Skeleton, Stack, Tooltip, Typography } from "@mui/joy";
import { FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { GrTrash } from "react-icons/gr";
import {IoIosAdd} from 'react-icons/io'
export default function Gallery(props:any) {
    const [uploading, setUploading] = useState<boolean>(false)
    const [img, setImg] = useState<any[]>([])

    const {postData, response, status} = useFetch() 

    useEffect(() => {
        if (props.update) {
            setImg(props.imgData??[])
            setUploading(false)
            console.log(props.imgData);
            
        }
    }, [])

    useEffect(() => {
        console.log(response);

        //add back
        if (response?.status && response?.msg === 'uploaded') {
            
            setImg(response.data)
            setUploading(false)
            //remove back
        }else if(response?.status && response?.msg === 'removed'){
            setImg(response.data)
            setUploading(false)
            //set default
        }else if(response?.status && response?.msg === 'defaulted'){
            setImg(response.data)
            setUploading(false)
        }else if(response?.errors){
            setUploading(false)
        }
        
    }, [response])

    const upload = async (file:File) => {
        console.log(props.unique);

        let header = { 
            'Content-Type': 'multipart/form-data',
            'lang': props.lang
        }

        
            const data = {unique:props.unique,file:file}
    
            await postData('product/add_gallery',data, header)
    }

    const removeFile = async (v:any) => {
        setUploading(true)
        await postData('product/remove_gallery',v)
    }

    const defaultChange = async (id:any,pid:any) => {
        setUploading(true)
        await postData('product/default_gallery',{id:id,pid:pid})
    }

    return (
            <Card className="card">
                <Typography component='h3'> گالری تصاویر</Typography>
            <Divider />
                <Grid container>
                    <Grid xs={12} sm={12} md={12} lg={12}>
                    <Stack spacing={1} sx={{ width: '100%', color:'white'}}>
                    <Alert variant='solid' color="primary">
                        <p>تصاویر بهتر است به صورت مربع ۱:۱ باشند</p>
                    </Alert>
                    <Alert variant='solid' color="primary">
                        <p>فرمت قابل بارگذاری (jpg, png, gif, svg, jpeg, webp)</p>
                    </Alert>
                    <Alert variant='solid' color="primary">
                        <p>تصویر باید کمتر از ۲ مگابایت (2000 kb)  باشد</p>
                    </Alert>
                    <Alert variant='solid' color="primary">
                        <p>از تصویر با عرض کمتر از ۸۰۰ پیکسل و بیشتر اذ ۱۴۰۰ پیکسل استفاده نکنید</p>
                    </Alert>
                    {
                    response?.errors&& 
                    
                    <Alert variant='solid' color="danger">
                        <p>{response.message}</p>
                    </Alert>
                    }
                    {
                    response?.errors?.file&&

                    response.errors.file.map((v:any,i:any) => { 
                    return(    <Alert key={i} variant='solid' color="warning">
                        <p>{v}</p>
                    </Alert>)
                    })
            
                    }

                    </Stack>
                    <br></br>
                    </Grid>

                    <Grid sx={{position:'relative'}} xs={12} sm={12} md={4} lg={4}>
                    <Input 
                    disabled = {uploading?true:false}
                    sx={{
                        position:'absolute',
                        height:'100%',
                        width:'100%',
                        zIndex:9999,
                        cursor:'pointer',
                        opacity:0
                    }}
                    onChange={(e) => {
                        if (e.target.files) {
                            setUploading(true)
                            upload(e.target.files[0])
                            
                        }
                    }}
                    type="file" />
                        <AspectRatio
                        variant="outlined"
                        ratio="1/1"
                        sx={{
                            width: '100%',
                            bgcolor: 'background.level2',
                            borderRadius: 'md',
                        }}
                        >
                        <Typography level="h2" component="div">
                            1:1
                        </Typography>
                        <Typography sx={{textAlign:'center',color:'gray !important',marginTop:'200px'}}
                        component="div"
                        level="h4"
                        >
                            جهت بارگزاری تصویر کلیک کنید
                        </Typography>
                        </AspectRatio>
                    </Grid>

                <Grid sx={{position:'relative'}} xs={12} sm={12} md={8} lg={8}>
                    {
                        uploading &&
                        <>
                <LinearProgress size="sm" />

                {/* <Card className="no-bg"
                                    variant="outlined"
                                    orientation="horizontal"
                                    sx={{
                                        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                                    }}
    >
      <CardContent orientation="horizontal">
        <Skeleton variant="rectangular" width={90} height={90} />
        <div>
          <Skeleton variant="text" width={200} />
          <p></p>
          <Skeleton level="body-sm" variant="text" width={100} />
        </div>
      </CardContent>


    </Card> */}
                        </>

                    }
                    {
                        img.map((v,i) => {
                            return(
                                <>
                                <Card key={i} className="no-bg"
                                    variant="outlined"
                                    orientation="horizontal"
                                    sx={{
                                        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                                    }}
                                >
                                    <AspectRatio ratio="1" sx={{ width: 90 }}>
                                        <img
                                            src={`http://127.0.0.1:8000${v.url}`}
                                            srcSet={`http://127.0.0.1:8000${v.url}`}
                                            loading="lazy"
                                            alt="" />
                                    </AspectRatio>
                                    <CardContent>
                                        <Typography level="title-lg" id="card-description">
                                            {v.title}
                                        </Typography>
                                        <Typography level="body-sm" aria-describedby="card-description" mb={1}>

                                            {JSON.parse(v.data).size/1000} (کیلوبایت) 
                                            <span style={{paddingRight:'5px'}}>{JSON.parse(v.data).format}</span>
                                        </Typography>
                                        <Box className="icon-box text-left">
                                            <Tooltip title="تصویر اصلی" variant="solid" placement="top">
                                                <Button id='tack-pic' variant="plain" color="neutral" sx={{ mr: 'auto', marginLeft: '20px', background: 'none' }}>
                                                    <FormControlLabel
                                                        sx={{ marginTop: 2 }}
                                                        control={<Switch defaultChecked
                                                            onChange={(e) => {
                                                                console.log(e);
                                                                
                                                                defaultChange(v.id,v.pid)
                                                            }}
                                                            checked={v.def}
                                                            sx={{ paddingLeft: 2, marginBottom: 1.5 }} />} label="" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="حذف" variant="solid" placement="top">
                                                <IconButton id='trush' variant="soft" color="neutral" sx={{ mr: 'auto' }}
                                                onClick={() => removeFile(v)}
                                                >
                                                    <GrTrash />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip id="text-copy" title="کپی لینک تصویر" variant="solid" placement="top">

                                                <IconButton id='link' variant="soft" color="neutral" sx={{ mr: 'auto' }}
                                                    onClick={() => {
                                                        const c = document.getElementById(`id__${v.id}`)
                                                    c?c.innerText = 'کپی شد':''
                                                    navigator.clipboard.writeText(`http://127.0.0.1:8000${v.url}`)
                                                    
                                                    }}
                                                >
                                                    <AiOutlineLink />
                                                </IconButton>
                                            </Tooltip>
                                            <span id={`id__${v.id}`} style={{position:'absolute',left:'15px',bottom:'3px',color:'green',fontSize:'12px'}}></span>
                                        </Box>
                                    </CardContent>
                                </Card>
                                <Divider />
                                </>
                            )
                        })
                    }

 

                </Grid>
                </Grid>
            </Card>
        ) 
}