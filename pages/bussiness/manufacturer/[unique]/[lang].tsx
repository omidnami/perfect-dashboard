
import Header from "@/Components/header";
import Lang from "@/Components/lang";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { AspectRatio, Box, Button, Card, Chip, Divider, FormLabel, Grid, Input, Textarea } from "@mui/joy";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineFontSize, AiOutlineLink, AiOutlineSearch } from "react-icons/ai";
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { HiCalendar, HiCreditCard, HiDevicePhoneMobile, HiDocumentText, HiEnvelope, HiFlag, HiGlobeAlt, HiKey, HiMap, HiPhone, HiUser } from "react-icons/hi2";
import { ifError } from "assert";
import TagMaker from "@/Components/tagMaker";
import { GrClose } from "react-icons/gr";
interface BrandInter {
    title:string,
    text:string,
    country:string,
    meta_key:string,
    desc:string,
    canonical:string
}

const serverData:BrandInter = {
    title:'',
    text:'',
    country:'',
    meta_key:'',
    desc:'',
    canonical:'',
}
export default function Store() {
    const router = useRouter()
    const [lang, setLang] = useState(localStorage.getItem('_lang_'))
    const [unique, setUnique] = useState<string>()
    const [formData, setFormData] = useState(serverData)
    const [selectLang, setSelectLang] = useState<boolean>(true)
    const [file, setFile] = useState<File>()
    const [fileLoad, setFileLoad] = useState<string>()
    const [onLoad, setOnLoad] = useState<boolean>(false)
    const {postData, response, status} = useFetch() 
    const [typing, setTyping] = useState(false)
    const [tags, setTags] = useState<string[]>([])   

    useEffect(() => {
        console.log('router');
        setUnique(router.query.unique+'')        
        server()
    } ,[router])

    useEffect(() => {
        console.log(status);
        
        //edit
        if (response && response.id) {

            setFormData({
                ...response,
                desc: response.meta_description,
                country: JSON.parse(response.data).country
            })

            if (response.url) {
                setFileLoad(`http://127.0.0.1:8000${response.url}`)
            }else {
                setFileLoad('')
            }

            setSelectLang(false)
            setOnLoad(true)
            setTags(response?.meta_key?JSON.parse(response.meta_key):[])
        }
        //insert
        else if (unique === 'insert') {
            if (status === 200) {
            setFormData(serverData)
            setSelectLang(true)
            setOnLoad(true)
            setFile(undefined)
            setTags([])
            }

        }
        //response masage store on server exsample status = true with editing
        else if(response?.status){
            console.log('editing submit handle');
            
        }
        //handle error
        else if(status === 100){

        }
        //chang lang empty
        else {
            //404
            setFormData(serverData)

            setSelectLang(false)
            setOnLoad(true)
            setFileLoad('')
            setFile(undefined)
            setTags([])
            console.log('404 ', lang); 
        }
        
    }, [response])

    useEffect(() => {      
        console.log('formData');
        if (response?.message) {
            console.log('error...');
            return () => {
                setTyping(false)
            }
        }
        else if(typing) {
            console.log('typing...');
            return () => {
                setTyping(false)
            }
        }
        else if (response?.id) {
            console.log('yes has id');
            
            setFormData({
                ...response,
                desc: response.meta_description,
                country: JSON.parse(response.data).country
            })
            setTyping(true)
            // setTags([])
        }else {
            console.log('id not set');
            setFormData(serverData)
            setTags([])
        }
        console.log(formData);
        

    }, [formData])



/******************************************************************************/
    //action

    const server = async() => {
        console.log(lang);
        console.log(router.query.unique);
        
        const header = {
            'lang': lang
          }
              await postData(`brand/select`,{unique:router.query.unique},header)

    }

    const onChangeLangHadle = async (e:any) => {
        router.push(`/bussiness/manufacturer/${unique}/${e}`)

        setLang(e)
    }

    const onClickHandleFormData = async () => {
        document.body.classList.add('loading')

        let header = { 
          'Content-Type': 'multipart/form-data',
          'lang': lang
        }
        
        const data = {...formData,file:file,meta_key:JSON.stringify(tags)}
  
        if (unique && unique !== 'insert' && !selectLang) {
          await postData('brand/update',{...data,unique:unique}, header)
        }else {
          await postData('brand/insert',data, header)
        }

    }
    if (onLoad) {
            document.body.classList.remove('loading')
            
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
                <Grid container columnSpacing={1}>
                    
                <Grid sm={12} md={8}>
                    <Card className="card">
                        <h3>اطلاعات تولیدکننده</h3>
                        <Divider />

                            <Grid container spacing={1.5}>
                                <Grid lg={6} md={12}>
                                    <FormLabel>
                                        <span>عنوان<small className="text-danger pr-1">*</small></span> 
                                    <Input
                                        size={'lg'}
                                        startDecorator={<AiOutlineFontSize />}
                                        fullWidth
                                        required
                                        value={formData.title}
                                        defaultValue={formData.title}
                                        onChange={(e) => {
                                            setTyping(true)
                                                setFormData({...formData,title:e.target.value})}
                                        } 
                                    />
                                    
                                    {response?.errors?.title&&<span className="err">{response?.errors?.title}</span>}
                                    {response?.errors?.slug&&<span className="err">{response?.errors?.slug}</span>}
                                    </FormLabel>
                                </Grid>
                                <Grid lg={6} md={12}>
                                    <FormLabel>
                                        <span>کشور<small className="text-danger pr-1">*</small></span>
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.country}
                                        id="lname"
                                        onChange={(e) => {
                                            setTyping(true)
                                            setFormData({...formData,country:e.target.value})}
                                        }
                                    />
                                {response?.errors?.country&&<span className="err">{response?.errors?.country}</span>}

                                    </FormLabel>
                                </Grid>

                                <Grid lg={12} md={12}>
                                    <FormLabel>
                                        <span> اطلاعات تکمیلی</span>
                                    </FormLabel>

                                        
                                            <CKEditor
                                                editor={ ClassicEditor }
                                                data={formData.text || ''}
                                                onReady={ editor => {
                                                    // You can store the "editor" and use when it is needed.
                                                } }
                                                onChange={ ( event, editor ) => {
                                                    setTyping(true)
                                                    const data = editor.getData();
                                                    // console.log( { event, editor, data } );
                                                    setFormData({...formData,text:data})
                                                } }
                                                onBlur={ ( event, editor ) => {
                                                    console.log( 'Blur.', editor );
                                                } }
                                                onFocus={ ( event, editor ) => {
                                                    console.log( 'Focus.', editor );
                                                } }
                                            />
                                        
                                </Grid>
                            </Grid>
                            <Card className="card" sx={{marginTop:'10px'}}>
                {response?.message&&<span className="err">{response?.message}</span>}
                {response?.status&&<span className="success">{response?.msg}</span>}
                    <Button onClick={()=> onClickHandleFormData()
                    } className="primary">ثبت اطلاعات</Button>                    
                </Card>
                    </Card>


                </Grid>

                <Grid sm={12} md={4}>
                <Card className="card" variant="outlined">
                    <h3>اطلاعات سیو</h3>
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
                        <FormLabel>
                        <span>  توضیحات متا<small className="text-danger pr-1"></small></span> 

                        <Textarea
                        sx={{width:'100%'}}
                                        className="userName"
                                        onChange={(e) => {
                                            setTyping(true)
                                            setFormData({...formData,desc:e.target.value})}
                                        }
                                        minRows={2}
                                        value={formData?.desc}
                        />
                        <span className={formData?.desc?.length>120?"success":'error'}>120-150/{formData?.desc?.length||0}</span>

                        </FormLabel>
                        <FormLabel> 
                        <span> کلمات کلیدی</span> 
                        <TagMaker
                        getTags={(e:string)=>setTags([...tags,e])}
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
                        </FormLabel>
                        <FormLabel>
                        <span>   کنونیکال</span> 

                        <Input
                                        size={'lg'}
                                        startDecorator={<AiOutlineLink />}
                                        fullWidth
                                        value={formData?.canonical}
                                        type=""
                                        onChange={(e) => {
                                            setTyping(true)
                                            setFormData({...formData,canonical:e.target.value})}
                                        }
                        />

                        </FormLabel>
                        <div style={{marginTop:'25px'}}>
                            {/* <Button className="primary" type="submit">ثبت اطلاعات کاربری</Button> */}
                        </div>
                </Card>
                </Grid>
            </Grid>
            </Box>
        </Container>
    </main>  
    )
}