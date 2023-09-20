import Header from "@/Components/header";
import Lang from "@/Components/lang";
import Menu from "@/Components/menu";
import TagMaker from "@/Components/tagMaker";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Box, Button, Card, Chip, Divider, FormLabel, Grid, Input, Textarea } from "@mui/joy";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GrClose } from "react-icons/gr";
import { HiGlobeAlt } from "react-icons/hi2";

let serverData = {
    title:'',
    slug:'',
    canonical:'',
    des:''
}
export default function Search() {
    const router = useRouter()
    const [lang, setLang] = useState<any>()
    const [productTitle , setProductTitle] = useState<string>()
    const [unique , setUnique] = useState<string>('')
    const [onLoad, setOnLoad] = useState<boolean>(false)
    const [id, setId] = useState<any>(0)
    const [formData, setFormData] = useState(serverData)
    const [tags, setTags] = useState<any[]>([])


    const {response, postData} = useFetch()

    useEffect(() => {
        console.log('router');
        setUnique(router.query.unique+'')
        setLang(router.query.lang)        
        server()
    }, [router])

    useEffect(() => {

        if (response?.status && response?.slug) {
            console.log(response);
            setProductTitle(response.title)
            setFormData(response)
            setTags(JSON.parse(response.meta_key))
            setId(response.id)
            setOnLoad(true)
        }else if(lang && !response){
            router.back()
        }
    }, [response])


    //actions
    const server = async() => {
        document.body.classList.add('loading')
        setOnLoad(false)
        console.log(router.query.lang);
        console.log(router.query.unique); 
        
        const header = {
            'lang': router.query.lang
          }
              await postData(`product/search_engin/select`,{unique:router.query.unique},header)
    }

    const onChangeLangHadle = (e:any) => {
        document.body.classList.add('loading')
        setOnLoad(false)
        router.push(`/bussiness/products/${unique}/search/${e}`)

        setLang(e)
    }

    const onClickHandleFormData = () => {
        const data = {...formData,meta_key:JSON.stringify(tags),pid:id}
        console.log(data);

        postData('product/search_engin/insert',data);
    }

    if (onLoad) {
        document.body.classList.remove('loading')
        
    }

    return (
        <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'60%',float:'right'}}>تنظیمات سئو</h1>
            <div style={{marginTop:'25px',marginBottom:'25px',width:'40%',float:'left'}}>
                    <Lang style={{
                            width:'100%',
                        }}
                        disable={false}
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
                        <h3>{productTitle}</h3>
                        <Divider />

                        <Grid container spacing={1.5}>
                            <Grid lg={6} md={6} sm={12} xs={12}>
                                <FormLabel>
                                        <span>عنوان کالا<small className="text-danger pr-1">*</small></span> 
                                    
                                     <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData({...formData,title:e.target.value})}
                                        }
                                    />
                                    
                                    {response?.errors?.title&&<span className="err">{response?.errors?.title}</span>}
                                </FormLabel>
                            </Grid>
                            <Grid lg={6} md={6} sm={12} xs={12}>
                                <FormLabel>
                                        <span>اسلاگ (در ادرس نمایش داده میشود)<small className="text-danger pr-1">*</small></span> 
                                    
                                     <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.slug}
                                        onChange={(e) => {
                                            setFormData({...formData,slug:e.target.value})}
                                        }
                                    />
                                    
                                    {response?.errors?.slug&&<span className="err">{response?.errors?.slug}</span>}
                                </FormLabel>
                            </Grid>
                            <Grid lg={6} md={6} sm={12} xs={12}>
                                <FormLabel>
                                        <span> کلمات کلیدی<small className="text-danger pr-1">*</small></span> 
                                        <TagMaker
                                            getTags={(e:string)=>setTags([...tags,e])}
                                            id='tag'
                                        />
                                {
                                    tags&&
                                    tags.map((v,i) => {
                                        return (
                                        <Chip id='tag' sx={{margin:1}} key={i}>
                                            <span className="close-tag" 
                                            onClick={() => {
                                            let t = tags.filter(e=> v !== e)
                                            setTags(t)
                                            }}
                                            ><GrClose /></span>
                                            
                                            {v}
                                        </Chip>
                                        )
                                    })
                                }   
                                    {response?.errors?.meta_key&&<span className="err">{response?.errors?.meta_key}</span>}
                                </FormLabel>
                            </Grid>
                            <Grid lg={6} md={6} sm={12} xs={12}>
                                <FormLabel>
                                        <span>کنونیکال<small className="text-danger pr-1">*</small></span> 
                                    
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.canonical}
                                        onChange={(e) => {
                                            setFormData({...formData,canonical:e.target.value})}
                                        }
                                    />
                                    
                                    {response?.errors?.canonical&&<span className="err">{response?.errors?.canonical}</span>}
                                </FormLabel>
                            </Grid>
                            <Grid lg={12} md={12} sm={12} xs={12}>
                                <FormLabel>
                                        <span>توضیحات متا <small className="text-danger pr-1">*</small></span> 
                                    
                                     <Textarea
                                        required
                                        value={formData.des}
                                        sx={{width:'100%'}}
                                        minRows={3}
                                        onChange={(e) => {
                                            setFormData({...formData,des:e.target.value})}
                                        }
                                    />
                                    <span>{formData.des&&formData.des.length}/150</span>
                                    
                                    {response?.errors?.des&&<span className="err">{response?.errors?.des}</span>}
                                </FormLabel>
                            </Grid>
                        </Grid>
                    </Card>
                    <Card className="card" sx={{marginTop:'10px'}}>
                {response?.message&&<span className="err">{response?.message}</span>}
                {response?.status&&<span className="success">{response?.msg}</span>}
                    <Button onClick={()=> onClickHandleFormData()
                    } className="primary">ثبت اطلاعات</Button>                    
                </Card>
                </Grid>
                </Grid>
            </Box>
        </Container>
        </main>
    )
}