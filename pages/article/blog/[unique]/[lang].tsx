
import Header from "@/Components/header";
import Lang from "@/Components/lang";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { AspectRatio, Avatar, Box, Button, Card, Checkbox, Chip, Divider, FormLabel, Input, ListDivider, ListItemDecorator, Modal, ModalDialog, Radio, Textarea, Typography } from "@mui/joy";
import { List as ListItem } from "@mui/joy";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { AiFillPlusCircle, AiOutlineFontSize, AiOutlineLink, AiOutlineSearch } from "react-icons/ai";

import { HiCalendar, HiCreditCard, HiDevicePhoneMobile, HiDocumentText, HiEnvelope, HiFlag, HiGlobeAlt, HiKey, HiMap, HiPhone, HiUser } from "react-icons/hi2";
import { ifError } from "assert";
import TagMaker from "@/Components/tagMaker";
import { GrAdd, GrClose } from "react-icons/gr";
import List from "..";
import ConfContext from "@/Context/ConfConext";
import Link from "next/link";
import { EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { editorStateFromRaw, editorStateToRaw } from '@/Libs/fa';

// import CKeditor from "@/Components/editor/CkEditor";


// import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Head from "next/head";
import { Grid } from "@mui/material";

const CKeditor = dynamic(() => import("@/Components/editor/CkEditor"), { ssr: false });
interface BrandInter {
    title:string,
    text:string,
    cat:string[],
    mainCat:string,
    meta_key:string,
    desc:string,
    canonical:string
}

const serverData:BrandInter = {
    title:'',
    text:'',
    cat:[],
    mainCat:'',
    meta_key:'',
    desc:'',
    canonical:'',
}
export default function Store() {
    const conf = useContext(ConfContext)
    const router = useRouter()
    const [lang, setLang] = useState<any>()
    const [unique, setUnique] = useState<any>()
    const [formData, setFormData] = useState(serverData)
    const [selectLang, setSelectLang] = useState<boolean>(true)
    const [file, setFile] = useState<File>()
    const [fileLoad, setFileLoad] = useState<string>()
    const {postData, response, status} = useFetch() 
    const [typing, setTyping] = useState(false)
    const [tags, setTags] = useState<string[]>([])   
    const [open, setOpen] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [catsList, setCatsList] = useState<any[]>([])
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [data, setData] = useState("");

    useEffect(() => {
    }, []);
    
    useEffect(() => {
        setUnique(router.query.unique)
        setLang(router.query.lang)
        
        server()
        
        setEditorLoaded(true);
    } ,[router])

    useEffect(() => {
        console.log(status);
        
        //edit
        if (response && response?.id) {

            setFormData({
                ...response,
                desc: response.meta_description,
                cat: JSON.parse(response.cat)
            })
            setData(response.text || '')

            if (response.url) {
                setFileLoad(`${process.env.NEXT_PUBLIC_UPLOAD_PATH}${response.url}`)
            }else {
                setFileLoad('')
            }

            setSelectLang(false)
            setTags(response?.meta_key?JSON.parse(response.meta_key):[])
        }
        //insert
        else if (unique === 'insert') {
            if (response?.msg === 'blog_inserted') {
            setFormData(serverData)
            setSelectLang(true)
            setFile(undefined)
            setTags([])
            setSuccess(true)
            }

        }
        //response masage store on server exsample status = true with editing
        else if(response?.status){
            console.log('editing submit handle');

        }
        //handle error
        else if(unique !== 'insert' && !response?.id){
            setSelectLang(false)

        }

        else if(status === 100){

        }
        //chang lang empty
        else {
            //404
            setFormData(serverData)
            setData('')
            setSelectLang(true)
            setFileLoad('')
            setFile(undefined)
            setTags([])
        }
        if (response?.msg === 'cat_selected') {
            setCatsList(response.data)
            
        }
        document.body.classList.remove('loading')
    }, [response])

    useEffect(() => {      
        console.log('formData: ',formData);
    }, [formData])



/******************************************************************************/
    //action

    const server = async() => {
        console.log(lang);
        console.log(router.query.unique);
        
        const header = {
            'lang': lang
          }
              await postData(`article/blog/select`,{unique:router.query.unique},header)

    }

    const onChangeLangHadle = async (e:any) => {
        router.push(`/article/blog/${unique}/${e}`)

        setLang(e)
    }

    const onClickHandleFormData = async () => {
        document.body.classList.add('loading')

        let header = { 
          'Content-Type': 'multipart/form-data',
          'lang': lang
        }

        const dataForm = {...formData,file:file,meta_key:JSON.stringify(tags),text:data}
  
        if (unique && unique !== 'insert' && !selectLang) {
          await postData('article/blog/update',{...dataForm,unique:unique}, header)
        }else {
          await postData('article/blog/insert',dataForm, header)
        }

    }

    const handleSelectCat = async () => {
            //get article cat
            //open modal select cat
            document.body.classList.add('loading')
            let header = { 
                'Content-Type': 'multipart/form-data',
                'lang': lang
              }
            await postData('article/cat/select_detail',null,header)
              setOpen(true)
    }
    const handleEntryCat = async (cat:any) => {
        //filter for by name cat
        //set to main cat
    }

    const handleCatToCat = (cat:string) => {
        console.log(cat);
        // push uniqueid to cat data array
        const c =  formData.cat.filter(e=> e === cat)
        if (c.length) {
            const cr =  formData.cat.filter(e=> e !== cat)
            setFormData({...formData,cat:cr})
        }else {
            const ci = formData.cat
            ci.push(cat)

            setFormData({...formData,cat:ci})

        }
    }

    const handleImageUpload = async (file:any) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('dir', 'blog_post');
    
          const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/v1/upload', {
            method: 'POST',
            body: formData,
          });
    
          if (response.ok) {
            
            const imageUrl = await response.text();
            const url = process.env.NEXT_PUBLIC_UPLOAD_PATH+JSON.parse(imageUrl).url
            const imgElement = `<img src="${url}" alt="Uploaded Image" />`;
            setData(data + imgElement);
          }else{
            alert('تصویر بارگذاری نشد')
          }
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      };
    
    return (
        <>
        <Head>
            <title>{!selectLang?'ویرایش مقاله':'ایجاد مقاله'}</title>
        </Head>
    <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'60%',float:'right'}}>{!selectLang?'ویرایش مقاله':'ایجاد مقاله'}</h1>
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
                        <h3>اطلاعات پایه</h3>
                        <Divider />

                            <Grid container spacing={1.5}>
                                <Grid lg={6} md={12}>
                                    <FormLabel>
                                        <span>عنوان<small className="text-danger pr-1">*</small></span> 
                                    <Input
                                        className="form-control"
                                        size={'lg'}
                                        // startDecorator={<AiOutlineFontSize />}
                                        fullWidth
                                        required
                                        value={formData.title}
                                        onChange={(e) => {
                                            setTyping(true)
                                                setFormData({...formData,title:e.target.value})}
                                        } 
                                    />
                                    
                                    {response?.errors?.title&&<span className="err">{response?.errors?.title}</span>}
                                    {response?.errors?.slug&&<span className="err">{response?.errors?.slug}</span>}
                                    </FormLabel>
                                </Grid>
                                <Grid lg={4} md={9}>
                                    <FormLabel>
                                        <span>دسته بندی<small className="text-danger pr-1">*</small></span>
                                    <Input
                                    className="form-control"
                                        size={'lg'}
                                        fullWidth
                                        required
                                        readOnly
                                        value={formData.cat&&formData.cat.length + ' عدد'}
                                        id="lname"
                                        onChange={(e) => {
                                            setTyping(true)
                                            setFormData({...formData,mainCat:e.target.value})}
                                        }
                                        onClick={() => handleSelectCat()}
                                    />
                                {response?.errors?.country&&<span className="err">{response?.errors?.mainCat}</span>}

                                    </FormLabel>
                                </Grid>
                                <Grid lg={2} md={3}>
                                <Button color="danger" variant="plain" startDecorator={<GrAdd />}
                                        sx={{ padding:0, marginTop:4 }}
                                        onClick={() => handleSelectCat()}
                                        >
                                            add
                                </Button>
                                </Grid>

                                <Grid lg={12} md={12}>
                                    <FormLabel>
                                        <span> اطلاعات تکمیلی</span>
                                    </FormLabel>
                                    <div>
                                                <CKeditor
                                                    editorLoaded={editorLoaded}
                                                    value={data}
                                                    onChange={(e: any) => setData(e)} name={""}               
                                                />
                                    </div>
                                </Grid>
                            </Grid>
 
                    </Card>


                </Grid>
                    <p><br/></p>
                <Grid sm={12} md={12}>
                        <Card className="card" variant="outlined">
                    <Grid container spacing={1.5}>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <div style={{padding:'12px'}}>
                                                <h3>اطلاعات سئو</h3>
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
                    </div>
                        </Grid>
                        <Grid xs={12} sm={12} md={6} lg={6} sx={{paddingTop:3,paddingBottom:3}}>
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
                        id='tag'
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
                        </Grid>
                    </Grid>


                </Card>
                </Grid>
            </Grid>
            </Box>
            <p><br/></p>
            <Card className="card" sx={{marginTop:'10px'}}>
                {response?.message&&<span className="err">{response?.message}</span>}
                {response?.status&&<span className="success">{response?.msg}</span>}
                    <Button onClick={()=> onClickHandleFormData()
                    } className="primary">ثبت اطلاعات</Button>                    
                </Card>
        </Container>

        <Modal
            open={open}
            onClose={() => setOpen(false)}
            >
            <ModalDialog>
            <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 4,
                overflow:'auto',
                maxHeight:'250px'
            }}
            >
          <div>
            <Typography level="body-xs" mb={2}>
            </Typography>
            <ListItem
              variant="outlined"
              sx={{
                minWidth: 240,
                borderRadius: 'sm',
              }}
            >
                {
                    catsList.map(v => {
                        const c = formData.cat.filter(e=> e===v.uniqueId)

                        return (
                            <>
                            <ListItem key={v.id}
                            >
                              <ListItemDecorator>
                              <Checkbox label={v.title}
                              checked={c.length?true:false}
                                onChange={() => handleCatToCat(v.uniqueId)}
                              />
                              </ListItemDecorator>
                            </ListItem>
                            <ListDivider  />
                            {
                    v.child.map((c:any) => {
                        const m = formData.cat.filter(e=> e===c.uniqueId)

                        return (
                            <>
                            <ListItem key={c.id}
                            
                            >
                              <ListItemDecorator>
                              <Checkbox sx={{marginRight:3}} label={c.title}
                              onChange={() => handleCatToCat(c.uniqueId)}
                              checked={m.length?true:false}
                              />
                              </ListItemDecorator>
                            </ListItem>
                            <ListDivider  />
                            </>
                        )
                    })
                }
                            </>
                        )
                    })
                }

            </ListItem>
          </div>
    </Box>
            </ModalDialog>
        </Modal>

            <Modal
            open={success}
            onClose={() => {return false}}
            >
            <ModalDialog>
                <Typography>مقاله با موفقیت ایجاد شد</Typography>
                <br/>
                <Divider />
                <br/>
                <Button color="primary"
                onClick={() => {
                    router.push('/article/blog')
                }}
                >لیست مقالات</Button>
                <br/>
                <Button color="primary"
                                onClick={() => {
                                    location.href = ''
                                }}
                >ایجاد مقاله جدید</Button>
                <br/>
                <Link color="primary"
                                    href={conf.domain+'blog'}
                >نمایش مقاله در سایت</Link>
            </ModalDialog>
            </Modal>
    </main>  
        </>
    )
}