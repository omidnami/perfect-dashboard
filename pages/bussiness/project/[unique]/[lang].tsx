import Header from "@/Components/header"
import Lang from "@/Components/lang"
import Menu from "@/Components/menu"
import useFetch from "@/Hooks/useFetch"
import Container from "@/Layouts/Continer"
import { AspectRatio, Box, Button, Card, Divider, FormLabel, Grid, Input, Option, Select } from "@mui/joy"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const serverData = {
    title:'',
    link:'',
    page:'',
}
const page_title = ' پروژه'
export default function Project() {
    const router = useRouter()
    const [lang, setLang] = useState<any>()
    const [formData, setFormData] = useState<any>({})
    const [unique, setUnique] = useState('')
    const {response, postData} = useFetch()
    const [selectLang, setSelectLang] = useState(true)
    const [cat, setCat] = useState<any>({cat1:null,cat2:null,cat3:null,cat4:null})
    const [mainCat, setMainCat] = useState<any>(null)
    const [file, setFile] = useState<File>()
    const [fileLoad, setFileLoad] = useState<string>()

    useEffect(() => {

        if (!lang) {
            setLang(localStorage.getItem('_lang_'))
        }
        setUnique(String(router.query.unique))
        server()

    }, [router])

    useEffect(() => {

        if (response?.status && response?.msg === 'project_inserted') {
            router.push('/bussiness/project/')
        }
        if (response?.status && response?.id) {
            setFormData(response)
            if (response.url) {
                setFileLoad(process.env.NEXT_PUBLIC_UPLOAD_PATH+response.url)
            }
            setSelectLang(false)
        }
        document.body.classList.remove('loading')

    }, [response])


    //action

    const server = async () => {
        const header = {
            'lang': router.query.lang
          }
        await postData('project/select', {unique:String(router.query.unique)},header)
        document.body.classList.remove('loading')
    }

    const onChangeLangHadle = (e:any) => {
        setFormData(serverData)
        setFileLoad('')
        setLang(e)
        router.push(`/bussiness/project/${unique}/${e}`)

    }

    const onSubmitHandle = async () => {

        document.body.classList.add('loading')

        let header = { 
          'Content-Type': 'multipart/form-data',
          'lang': lang
        }
        
        const dataSubmit = {...formData,file:file}
  
        if (unique && unique !== 'insert' && !selectLang) {
          await postData('project/update',{...dataSubmit,unique:unique}, header)
        }else {
          await postData('project/insert',dataSubmit, header)
        }
    }

    return (
        <>
        <Head>
            <title>{page_title}</title>
        </Head>
        <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'60%',float:'right'}}>{!selectLang?' ویرایش'+page_title:'ایجاد '+page_title}</h1>
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
                <Grid container columnSpacing={1}>
                    
                <Grid sm={12} md={12}>
                    <Card className="card">
                        <h3>اطلاعات</h3>
                        <Divider />
                        <br />
                            <Grid container spacing={1.5}>
                                <Grid xs={12} sm={12} md={6} lg={6}>
                                    <FormLabel>
                                        <span>عنوان</span>
                                        <Input
                                        fullWidth
                                        className="form-control"
                                        required
                                        value={formData?.title}
                                        onChange={(e:any) => {
                                            setFormData({...formData,title:e.target.value})
                                        }}
                                        />
                                    </FormLabel>
                                </Grid>

                                <Grid xs={12} sm={12} md={6} lg={6}>
                                    <FormLabel>
                                        <span>لینک</span>
                                        <Input
                                        fullWidth
                                        className="form-control ltr"
                                        required
                                        value={formData?.link}
                                        onChange={(e:any) => {
                                            setFormData({...formData,link:e.target.value})
                                        }}
                                        />
                                    </FormLabel>
                                </Grid>

                                <Grid xs={12} sm={6} md={6} lg={6}>
                                    <FormLabel>
                                        <span>صفحه</span>
                                        <Select
                                        sx={{width:'100%'}}
                                        className="form-control"
                                        value={cat.cat1}
                                        onChange={(e:any, v:any) => {
                                            setFormData({...formData,page:v})
                                            setMainCat(v)
                                        }}
                                        >
                                            <Option value={null}>استفاده از لینک</Option>
                                        </Select>
                                    </FormLabel>
                                </Grid>
                            </Grid>
                            <Grid xs={12} sm={12} md={6} lg={6}>
                            <h3> تصویر</h3>
                    <Divider />
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
                            //setTyping(true)
                            setFile(e.target.files[0]);
                        }
                    }}
                    />
                    </label> 
                    {response?.errors?.file&&<span className="err">{response?.errors?.file}</span>}

                            </Grid>
                    </Card>
                </Grid>
                </Grid>
<br />
            <Card className="card" sx={{marginTop:'10px'}}>
                {response?.message&&<span className="err">{response?.message}</span>}
                {response?.status&&<span className="success">{response?.msg}</span>}
                    <Button onClick={()=> onSubmitHandle()
                    } className="primary">ثبت اطلاعات</Button>                    
                </Card>
            </Box>
        </Container>
        </main>
        </>
    )
}