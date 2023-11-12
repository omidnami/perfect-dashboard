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
    cat:null,
    data:null,
}

const page_title = ' خدمات'
export default function Store() {
    const router = useRouter()
    const [lang, setLang] = useState<any>()
    const [formData, setFormData] = useState<any>({})
    const [unique, setUnique] = useState('')
    const {response, postData} = useFetch()
    const [selectLang, setSelectLang] = useState(true)
    const [cat, setCat] = useState<any>({cat1:null,cat2:null,cat3:null,cat4:null})
    const [mainCat, setMainCat] = useState<any>(null)
    const [data, setData] = useState<any>({max_price:0,min_price:0,completed:0,serviceing:0,vahed:'تومان'})
    const [file, setFile] = useState<File>()
    const [fileLoad, setFileLoad] = useState<string>()
    const [typing, setTyping] = useState<boolean>(false)

    useEffect(() => {

        if (!lang) {
            setLang(localStorage.getItem('_lang_'))
        }
        setUnique(String(router.query.unique))
        server()

    }, [router])

    useEffect(() => {

        if (response?.status && response?.msg === 'service_inserted') {
            router.push('/bussiness/services/')
        }
        if (response?.status && response?.id) {

            setData(JSON.parse(response.data))
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
        await postData('service/select', {unique:String(router.query.unique)},header)
        document.body.classList.remove('loading')
    }

    const onChangeLangHadle = (e:any) => {

        setData({max_price:0,min_price:0,completed:0,serviceing:0,vahed:'تومان'})
        setFormData(serverData)
        setFileLoad('')
        setLang(e)
        router.push(`/bussiness/services/${unique}/${e}`)

    }

    const onSubmitHandle = async () => {
        if (mainCat === null) {
            if (cat.cat4) {
                setMainCat(cat.cat4)
            }else if (cat.cat3) {
                setMainCat(cat.cat3)
            }else if (cat.cat2) {
                setMainCat(cat.cat2)
            }else if (cat.cat1) {
                setMainCat(cat.cat1)
            }
        }
        document.body.classList.add('loading')

        let header = { 
          'Content-Type': 'multipart/form-data',
          'lang': lang
        }
        
        const dataSubmit = {...formData,file:file,mainCat:mainCat,cat:cat,data:JSON.stringify(data)}
  
        if (unique && unique !== 'insert' && !selectLang) {
          await postData('service/update',{...dataSubmit,unique:unique}, header)
        }else {
          await postData('service/insert',dataSubmit, header)
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
                        <h3>اطلاعات خدمات</h3>
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

                                <Grid xs={12} sm={6} md={3} lg={3}>
                                    <FormLabel>
                                        <span>دسته بندی</span>
                                        <Select
                                        sx={{width:'100%'}}
                                        className="form-control"
                                        value={cat.cat1}
                                        onChange={(e:any, v:any) => {
                                            setFormData({...cat,cat1:v})
                                            setMainCat(v)
                                        }}
                                        >
                                            <Option value={null}>بدون دسته</Option>
                                        </Select>
                                    </FormLabel>
                                </Grid>
                                <Grid xs={12} sm={6} md={3} lg={3}>
                                    <FormLabel>
                                        <span>دسته بندی</span>
                                        <Select
                                        sx={{width:'100%'}}
                                        className="form-control"
                                        value={cat.cat2}
                                        onChange={(e:any, v:any) => {
                                            setFormData({...cat,cat2:v})
                                            setMainCat(v)
                                        }}
                                        >
                                            <Option value={null}>بدون دسته</Option>
                                        </Select>
                                    </FormLabel>
                                </Grid>
                                <Grid xs={12} sm={6} md={3} lg={3}>
                                    <FormLabel>
                                        <span>دسته بندی</span>
                                        <Select
                                        sx={{width:'100%'}}
                                        className="form-control"
                                        value={cat.cat3}
                                        onChange={(e:any, v:any) => {
                                            setFormData({...cat,cat2:v})
                                            setMainCat(v)
                                        }}
                                        >
                                            <Option value={null}>بدون دسته</Option>
                                        </Select>
                                    </FormLabel>
                                </Grid>
                                <Grid xs={12} sm={6} md={3} lg={3}>
                                    <FormLabel>
                                        <span>دسته بندی</span>
                                        <Select
                                        sx={{width:'100%'}}
                                        className="form-control"
                                        value={cat.cat4}
                                        onChange={(e:any, v:any) => {
                                            setFormData({...cat,cat4:v})
                                        }}
                                        >
                                            <Option value={null}>بدون دسته</Option>
                                        </Select>
                                    </FormLabel>
                                </Grid>

                                <Grid   xs={12} sm={5} md={2.5} lg={2.5}>
                                    <FormLabel>
                                        <span>کمترین مبلغ</span>
                                        <Input
                                        fullWidth
                                        className="form-control ltr"
                                        required
                                        type="number"
                                        value={data.min_price}
                                        onChange={(e:any) => {
                                            setData({...data,min_price:e.target.value})
                                        }}
                                        />
                                    </FormLabel>
                                </Grid>
                                <Grid xs={12} sm={5} md={2.5} lg={2.5}>
                                    <FormLabel>
                                        <span>بیشترین مبلغ</span>
                                        <Input
                                        fullWidth
                                        className="form-control ltr"
                                        required
                                        type="number"
                                        value={data.max_price}
                                        onChange={(e:any) => {
                                            setData({...data,max_price:e.target.value})
                                        }}
                                        />
                                    </FormLabel>
                                </Grid>
                                <Grid   xs={12} sm={2} md={1} lg={1}>
                                    <FormLabel>
                                        <span>واحد پول</span>
                                        <Select
                                        sx={{width:'100%'}}
                                        className="form-control"
                                        value={data.vahed}
                                        onChange={(e:any, v:any) => {
                                            setData({...data,vahed:v})
                                        }}
                                        >
                                            <Option value="تومان">تومان</Option>
                                            <Option value="ریال">ریال</Option>
                                            <Option value="$">$</Option>
                                            <Option value="EURU">EURU</Option>
                                        </Select>
                                    </FormLabel>
                                </Grid>
                                <Grid xs={12} sm={6} md={3} lg={3}>
                                    <FormLabel>
                                        <span>درحال انجام</span>
                                        <Input
                                        fullWidth
                                        className="form-control ltr"
                                        required
                                        type="number"
                                        value={data.serviceing}
                                        onChange={(e:any) => {
                                            setData({...data,serviceing:e.target.value})
                                        }}
                                        />
                                    </FormLabel>
                                </Grid>
                                <Grid xs={12} sm={6} md={3} lg={3}>
                                    <FormLabel>
                                        <span>انجام شده</span>
                                        <Input
                                        fullWidth
                                        className="form-control ltr"
                                        required
                                        type="number"
                                        value={data.completed}
                                        onChange={(e:any) => {
                                            setData({...data,completed:e.target.value})
                                        }}
                                        />
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
                            setTyping(true)
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