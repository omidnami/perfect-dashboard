import CodeHtml from "@/Components/code/html";
import Header from "@/Components/header";
import Lang from "@/Components/lang";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { AspectRatio, Box, Button, Card, Divider, FormLabel, Grid, IconButton, Input, Option, Select, Textarea } from "@mui/joy";
import { Toolbar, Tooltip } from "@mui/material";
import { randomUUID } from "crypto";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GrTrash } from "react-icons/gr";
const serverData = {
    title:'',
    link:'',
    linkText:'',
    target:'blank',
}
export default function TextView() {
    const router = useRouter()
    const [selectLang, setSelectLang] = useState<boolean>(true)
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
    const [area, setArea] = useState<boolean>(true)

    const [text, setText] = useState('')

    useEffect(() => {
        setLang(router.query.lang)
        setUnique(router.query.unique)
        
        //get data
        let header = { 
            'Content-Type': 'multipart/form-data',
            'lang': router.query.lang
          }
        postData('plugins/text_view/select',{unique:router.query.unique},header)
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
            setText(response.art.text)
            if (response.data.id) {
                setSelectLang(false)
            }          
        }
        document.body.classList.remove('loading')
    }, [response])

    //action
        const onChangeLangHadle = async (e:any) => {
            setFormData(serverData)
            setText('')
            setDynamic([])
            setFileLoad(undefined)
            setFileLoadMobile(undefined)
            router.push(`/plugins/text_view/${unique}/${e}`)
        }
        const onSubmitSlider = async () => {
            document.body.classList.add('loading')

            let header = { 
              'Content-Type': 'multipart/form-data',
              'lang': lang
            }
            
            const data = {...formData,text:text}
            if (unique && unique !== 'insert' && !selectLang) {
                await postData('plugins/text_view/update',{...data,unique:unique}, header)
            }else {
                  await postData('plugins/text_view/insert',data, header)
              }
        }

        const onViewHandle = () => {
            setArea(!area)
            
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
                                    <span>لینک</span>
                                    <Input
                                    className="form-control"
                                        fullWidth
                                        size="lg"
                                        sx={{direction:'ltr', textAlign:'left'}}
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
                            <Grid xs={12}>
                                <div style={{width:'60%',float:'right',textAlign:'right'}}>
                                    <span>متن (HTML)</span>
                                </div>
                                    <div style={{width:'40%',float:'left',textAlign:'left'}}>
                                    <span
                                    style={{cursor:'pointer'}}
                                    onClick={() => onViewHandle()}
                                    >{!area?'مخفی':'نمایش'}</span>
                                    </div>
                                    
                            </Grid>
                            <Grid xs={12} sx={{direction:'ltr', textAlign:'left'}}>
                                <CodeHtml value={(e:any) => setText(e)} 
                                defaultValue={text}
                                />
                            </Grid>
                            <Grid xs={12}>

                                {
                                    !area&&
                                    <section dangerouslySetInnerHTML={{__html: text}}></section>
                                }
                            </Grid>
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