import Header from "@/Components/header";
import Lang from "@/Components/lang";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { AspectRatio, Box, Button, Card, Divider, FormLabel, Grid, IconButton, Input, Option, Select } from "@mui/joy";
import { Toolbar, Tooltip } from "@mui/material";
import { randomUUID } from "crypto";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GrTrash } from "react-icons/gr";
const serverData = {
    title:'',
    sub_title:'',
    bg:'',
    link:'',
    linkText:'',
    target:'blank',

}
export default function Slider() {
    const router = useRouter()
    const [selectLang, setSelectLang] = useState<boolean>(false)
    const [lang, setLang] = useState<any>()
    const [unique, setUnique] = useState<any>()
    const {response, postData} = useFetch()
    const [textDynamic, setTextDynamic] = useState('')
    const [delay, setDlay] = useState(0)
    const [dynamic, setDynamic] = useState<any[]>([])
    const [formData, setFormData] = useState<any>({})
    const [file, setFile] = useState<File>()
    const [typing, setTyping] = useState<boolean>(false)
    const [fileLoad, setFileLoad] = useState<string>()
    const [mobile, setMobile] = useState<File>()
    const [fileLoadMobil, setFileLoadMobile] = useState<string>()

    useEffect(() => {
        setLang(router.query.lang)
        setUnique(router.query.unique)
        
        //get data
        let header = { 
            'Content-Type': 'multipart/form-data',
            'lang': router.query.lang
          }
        postData('plugins/slider/select',{unique:router.query.unique},header)
    }, [router])

    useEffect(() => {
        console.log(response);
        
        if(typing) {
            console.log('typing...');
            return () => {
                setTyping(false)
            }
        }

        if (response?.status && response?.msg === 'selected') {
            setFormData(response.data)
            if (JSON.parse(response.data.dynamictext)) {
                setDynamic(JSON.parse(response.data.dynamictext))
            }
            const m = response.files.filter((e: { def: number; })=> e.def === 0);
            const d = response.files.filter((e: { def: number; })=> e.def === 1);
            if (m.length) {
                setFileLoadMobile(process.env.NEXT_PUBLIC_API_URL+m[0].url)
                
            }
            if (d.length) {
                setFileLoad(process.env.NEXT_PUBLIC_API_URL+d[0].url)
                
            }            
        }
        document.body.classList.remove('loading')
    }, [response])

    //action
        const onChangeLangHadle = async (e:any) => {
            setFormData(serverData)
            setDynamic([])
            setFileLoad(undefined)
            setFileLoadMobile(undefined)
            router.push(`/plugins/sliders/typing_media/${unique}/${e}`)
        }
        const onSubmitSlider = async () => {
            document.body.classList.add('loading')

            let header = { 
              'Content-Type': 'multipart/form-data',
              'lang': lang
            }
            
            const data = {...formData,file:file,mobile:mobile,dynamictext:dynamic,unique:unique}
            console.log(data);
            
              await postData('plugins/slider/insert',data, header)
        }
        const onEditSlider = (unique:any) => {}
        const onDeleteSlider = (i:any) => {
            const arry = dynamic
            arry.splice(i,1)
            arry.splice(i-1,1)
            setDynamic(arry)
        }
    

    return (
        <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'60%',float:'right'}}>{!selectLang?'ویرایش تولید کننده':'ایجاد تولید کننده'}</h1>
            <div style={{marginTop:'25px',marginBottom:'25px',width:'40%',float:'left'}}>
                    <Lang style={{
                            width:'100%',
                        }}
                        disable={selectLang}
                        onChange={(e:any) => onChangeLangHadle(e)}
                        dv={lang}
                    />
            </div>
            <div style={{clear:'both'}}></div>
            <Divider />
            <Box component='section' width={'100%'}>                    
                    <Card className="card">
                        <h3>اطلاعات ثبت اسلاید</h3>
                        <Divider />
                        <Grid container spacing={1.5}>
                            <Grid xs={12} sm={6} md={4}>
                                <FormLabel>
                                    <span>عنوان</span>
                                    <Input
                                        fullWidth
                                        size="lg"
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        value={formData?.title}
                                        />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={6} md={4}>
                                <FormLabel>
                                    <span>زیر عنوان</span>
                                    <Input
                                        fullWidth
                                        size="lg"
                                        value={formData?.sub_title}
                                        onChange={(e) => setFormData({...formData, sub_title: e.target.value})}
                                    />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={6} md={4}>
                                <FormLabel>
                                    <span>رنگ پس زمینه</span>
                                    <Input
                                        fullWidth
                                        size="lg"
                                        type="color"
                                        value={formData?.bg}
                                        onChange={(e) => setFormData({...formData, bg: e.target.value})}
                                    />
                                </FormLabel>
                            </Grid>

                            <Grid xs={12} sm={6} md={4}>
                                <FormLabel>
                                    <span>لینک</span>
                                    <Input
                                        fullWidth
                                        size="lg"
                                        value={formData?.link}
                                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                                        />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={6} md={4}>
                                <FormLabel>
                                    <span>عنوان لینک</span>
                                    <Input
                                        fullWidth
                                        size="lg"
                                        value={formData?.linkText}
                                        onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                                    />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={6} md={4}>
                                <FormLabel>
                                    <span>پنجره هدف</span>
                                    <Select
                                    sx={{width:'100%'}}
                                    size="lg"
                                    value={formData?.target??'blank'}
                                    onChange={(e, v) => setFormData({...formData, target: v})}
                                    >
                                        <Option value='new'>جدید</Option>
                                        <Option value='blank'>همین پنجره</Option>
                                    </Select>
                                </FormLabel>
                            </Grid>

                            <Grid xs={12} sm={6} md={6}>
                                    <span>تصویر </span>
                                    <AspectRatio minHeight="120px">
                                            <img
                                            src={file?URL?.createObjectURL(file):fileLoad??'/no-image.png'}
                                            srcSet={file?URL?.createObjectURL(file):fileLoad??'/no-image.png'}
                                            loading="lazy"
                                            alt=""
                                            />
                                    </AspectRatio>
                                    <label className="primary btn btn-primary"> آپلود لوگو
                                    <Input
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setTyping(true)
                                            setFile(e.target.files[0]);
                                        }
                                    }}
                                    />
                                    </label> 
                                    {response?.errors?.file&&<span className="err">{response?.errors?.file}</span>}
                            </Grid>
                            <Grid xs={12} sm={6} md={6}>
                                    <span>تصویر موبایل</span>
                                    <AspectRatio minHeight="120px">
                                            <img
                                            src={mobile?URL?.createObjectURL(mobile):fileLoadMobil??'/no-image.png'}
                                            srcSet={mobile?URL?.createObjectURL(mobile):fileLoadMobil??'/no-image.png'}
                                            loading="lazy"
                                            alt=""
                                            />
                                    </AspectRatio>
                                    <label className="primary btn btn-primary"> آپلود لوگو
                                    <Input
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setTyping(true)
                                            setMobile(e.target.files[0]);
                                        }
                                    }}
                                    />
                                    </label> 
                                    {response?.errors?.mobile&&<span className="err">{response?.errors?.mobile}</span>}
                            </Grid>

                            <Grid xs={12} sm={6} md={8}>
                                <FormLabel>
                                    <span>متن متحرک</span>
                                    <Input
                                        fullWidth
                                        size="lg"
                                        onChange={(e) => {
                                                setTextDynamic(e.target.value)
                                        }}
                                        />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={3} md={2}>
                                <FormLabel>
                                    <span>وقفه (ms) </span>
                                    <Input
                                        fullWidth
                                        size="lg"
                                        type="number"
                                        onChange={(e) => {
                                            setDlay(Number(e.target.value))
                                        }}
                                    />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={3} md={2}>
                                <FormLabel>
                                    <span></span>
                                    <Button
                                    sx={{marginTop:4}}
                                    onClick={() => {
                                        setDynamic([...dynamic,textDynamic,delay])
                                        
                                    }}
                                    >
                                        ثبت
                                    </Button>
                                </FormLabel>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1.5}>
                        {
                            dynamic.map((v:any,i:any) => {
                                let d = ''
                                if (i % 2 !== 0) {
                                    d = 'flex'
                                }else{
                                    d = 'none'
                                }
                                return (
                                    <>
                                        <Grid xs={11} sm={5} md={5} lg={5}>{v}</Grid>
                                        <Grid xs={1} sm={2} md={2} lg={2} sx={{display:d}}>
                                            <Tooltip title="حذف" color="danger">
                                                <IconButton
                                                onClick={() => {
                                                    onDeleteSlider(i)
                                            
                                                }}
                                                >
                                                    <GrTrash />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    
                                    </>
                                )
                            })
                        }
                            </Grid>
                        <p><br/></p>
                        <p><br/></p>
                    </Card>
                    
                    <Card className="card" sx={{marginTop:'10px'}}>
                {response?.message&&<span className="err">{response?.message}</span>}
                {response?.status&&<span className="success">{response?.msg}</span>}
                    <Button onClick={()=> onSubmitSlider()
                    } className="primary">ثبت اطلاعات</Button>                    
                </Card>
            </Box>
        </Container>
    </main>
    )
}