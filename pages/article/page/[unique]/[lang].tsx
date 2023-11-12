
import Header from "@/Components/header";
import Lang from "@/Components/lang";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { AspectRatio, Avatar, Box, Button, Card, Checkbox, Chip, Divider, FormLabel, Grid, IconButton, Input, ListDivider, ListItemDecorator, Modal, ModalDialog, Option, Radio, Select, Textarea, Typography } from "@mui/joy";
import { List as ListItem } from "@mui/joy";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { AiFillPlusCircle, AiOutlineFontSize, AiOutlineLink, AiOutlineSearch } from "react-icons/ai";

import { HiCalendar, HiComputerDesktop, HiCreditCard, HiDevicePhoneMobile, HiDocumentText, HiEnvelope, HiFlag, HiGlobeAlt, HiKey, HiMap, HiPencil, HiPhone, HiTrash, HiUser } from "react-icons/hi2";
import { ifError } from "assert";
import TagMaker from "@/Components/tagMaker";
import { GrAdd, GrClose } from "react-icons/gr";
import List from "..";
import ConfContext from "@/Context/ConfConext";
import Link from "next/link";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import ThemplateContext from "@/Context/ThemplateContext";
import CodeJavascript from "@/Components/code/javascript";
import CodeHtml from "@/Components/code/html";
import CodeLess from "@/Components/code/css";
import { TfiMobile } from "react-icons/tfi";
import { BiMobileAlt, BiMobileLandscape } from "react-icons/bi";
import { FaTabletAlt } from "react-icons/fa";
import dynamic from 'next/dynamic';
const CKeditor = dynamic(() => import("@/Components/editor/CkEditor"), { ssr: false });

const serverData = {
    title:'',
    meta_key:'',
    desc:'',
    canonical:'',
    link:''
}
const PLUGIN = {
    tools:'',
    type:'',
    grid:{xs:0, sm:0, md:12, lg:12},
    pull:'',
    element:'div',
    title:'',
    display:true,
    id:'',
    class:'',
    color:'',
    colorType:false,
    img:'',
    periority:1
}
export default function Store() {
    const conf = useContext(ConfContext)
    const template = useContext(ThemplateContext)
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
    const [position, setPosition] = useState<string>('')
    const [javascript, setJavascript] = useState<any>('')
    const [css, setCss] = useState<any>('')
    const [html, setHtnl] = useState<any>('')
    const [meta, setMeta] = useState<any>('')
    const [tools, setTools] = useState<any[]>([])
    const [plugin, setPlugin] = useState<any>(PLUGIN)
    const [selectType, setSelectType] = useState<any[]>([])
    const [options, setOptions] = useState<any>({footer:true, header:true, robot: true, home:false})
    const [code, setCode] = useState<boolean>(false)
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [editCode, setEditCode] = useState('')

    useEffect(() => {
        setUnique(router.query.unique)
        setLang(router.query.lang)


        setHtnl('')
        setEditCode('')
        setJavascript('')
        setCss('')
        setTools([])
        setOptions({footer:true, header:true, robot: true, home:false})
        setMeta('')
        setFormData(serverData)
        setTags([])

        server()
        setEditorLoaded(true)
    } ,[router])

    useEffect(() => {
        console.log(response);
        
        //edit
        if (response && response?.id) {
            console.log(JSON.parse(response.options));
            const opt = JSON.parse(response.options);
            setHtnl(response.text??'')
            setEditCode(response.editor??'')
            setJavascript(JSON.parse(response.javascript)??'')
            setCss(JSON.parse(response.css)??'')
            setTools(JSON.parse(response.data)??[])
            const h = Boolean(Number(response.home))
            setOptions({...opt,home:h})
            setMeta(JSON.parse(response.meta)??'')
            const data = {
                title:response.title,
                meta_key:'',
                desc:response.meta_description,
                canonical:response.canonical,
                link:response.slug
            }
            setFormData(data)
            setSelectLang(false)
            setTags(response?.meta_key?JSON.parse(response.meta_key):[])
        }
        //insert
        else if (unique === 'insert') {
            if (response?.msg === 'page_inserted') {
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
        else if(status === 100){

        }else if(router.query.unique !== 'insert'){
            setSelectLang(false)

        }
        //chang lang empty
        else {
            //404
            setFormData(serverData)

            setSelectLang(true)
            setTags([])
        }
        if (response?.msg === 'cat_selected') {
            setCatsList(response.data)
            
        }
        if (response?.msg === 'plugin_selected') {
            setSelectType(response.plugin)
            console.log(response.plugin);
            
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
            'lang': router.query.lang
          }
              await postData(`article/page/select`,{unique:router.query.unique},header)
              document.body.classList.remove('loading')

    }

    const onChangeLangHadle = async (e:any) => {
        router.push(`/article/page/${unique}/${e}`)

        setLang(e)
    }

    const onClickHandleFormData = async () => {
        document.body.classList.add('loading')

        let header = { 
          'Content-Type': 'multipart/form-data',
          'lang': lang
        }
        
        const data = {...formData,
            meta_key:JSON.stringify(tags),
            javascript:javascript,
            html:html,
            css:css,
            meta:meta,
            data:tools,
            text:editCode,
            options:JSON.stringify(options)
        }

        console.log(data);
        

        if (unique && unique !== 'insert' && !selectLang) {
            await postData('article/page/update',{...data,unique:unique}, header)
        }else {
            await postData('article/page/insert',data, header)
        }

    }

    const handleSlider = async () => {
        //select slider parent 0 , status 0, lang in header select this lang
        let header = { 
            'Content-Type': 'multipart/form-data',
            'lang': lang
          }
        await postData('plugins/slider/select/detail',{},header)
    }
    const handleText = async () => {
        //select slider parent 0 , status 0, lang in header select this lang
        let header = { 
            'Content-Type': 'multipart/form-data',
            'lang': lang
          }
        await postData('plugins/text_view/select/detail',{},header)
    }
    const handleProduct = async () => {
        let header = { 
            'Content-Type': 'multipart/form-data',
            'lang': lang
          }
        await postData('plugins/product/one/all',{},header)
        console.log('on product');
        
    }

    const handleMenu = async () => {
        let header = { 
            'Content-Type': 'multipart/form-data',
            'lang': lang
          }
        await postData('plugins/menu',{},header)
        console.log('on menu');
        
    }

    const uploadHandle = async (file:File) => {
        setTyping(true)
        //get to upload image
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('dir', 'page_post');
      
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/v1/upload', {
              method: 'POST',
              body: formData,
            });
      
            if (response.ok) {
              
              const imageUrl = await response.text();
              const url = process.env.NEXT_PUBLIC_UPLOAD_PATH+JSON.parse(imageUrl).url
              setPlugin({...plugin,img: url})
              console.log(typeof url, url);
              
                setTyping(false)
                return true
            }else{
              alert('تصویر بارگذاری نشد')
              setTyping(false)

            }
          } catch (error) {
            alert('تصویر بارگذاری نشد')
            setTyping(false)

            console.error('Image upload failed:', error);
          }
        //set to plugin.img.url
    }

    const addToolsHandle = () => {
        const p = tools.length+1
        const t = {...plugin, periority:p}
        setTools([...tools,t])

        setOpen(false)
    }

    const periorityHandle = (v:any, val:any) => {
            const p = {...v,periority:val}
            const t = tools.filter(e=> e !== v)

    }

    const pluginTostring = (v:any) => {
        switch(Number(v)){
            case 0:
                return 'مخفی'
            case 12:
                return '1/1'
            case 6:
                return '1/2'
            case 4:
                return '1/3'
            case 3:
                return '1/4'
            case 8:
                return '2/3'
        }
        return 'ok'
    }

    return (
    <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'60%',float:'right'}}>{!selectLang?'ویرایش  صفحه':'ایجاد صفحه'}</h1>
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
                        <h3>مدیریت ابزارک ها</h3>
                        <Divider />
                        {/* "type":"slider","pos":"pos1","loc":1,"id":1 */}
                        <p><br/></p>

                            <Grid container spacing={1.5}>
                                
                                            <Box component='section'
                                            sx={{
                                                border:'dashed 1px gray',
                                                padding:10,
                                                width:'100%',
                                                borderRadius:7,
                                                marginBottom:3,
                                                textAlign:'center',
                                                cursor:'pointer',
                                                position:'relative',
                                                }}
                                                onClick={() => setOpen(true)}
                                            >
                                                <Box component='div'
                                                sx={{
                                                    width:'99%',
                                                    fontSize:50,
                                                    position:'absolute',
                                                    top:'20%',
                                                    right:0
                                                }}
                                                >
                                                    ابزارک
                                                </Box>

                                            </Box>
                                            {
                                                tools.map((v, i) => {
                                                    return (
                                                        <Box key={i} sx={{width:'100%'}}>
                                                            <Box
                                                            sx={{
                                                                border:'dashed 1px gray',
                                                                padding:1,
                                                                borderRadius:7,
                                                                width:'100%',
                                                                margin:'.5%',
                                                            }}
                                                            >
                                                                <h5
                                                                style={{float:'right', textAlign:'right'}}
                                                                >{v.tools}
                                                                <p>{v.type}</p>
                                                                </h5>
                                                                <div style={{float:'left', textAlign:'left'}}>
                                                                <span style={{margin:'6px'}}><BiMobileAlt size="large"/>{pluginTostring(v.grid.xs)}</span>
                                                                <span style={{margin:'6px'}}><BiMobileLandscape size='large'/>{pluginTostring(v.grid.sm)}</span>
                                                                <span style={{margin:'6px'}}><FaTabletAlt size="large"/>{pluginTostring(v.grid.md)}</span>
                                                                <span style={{margin:'6px'}}><HiComputerDesktop size="large"/>{pluginTostring(v.grid.lg)}</span>
                                                                </div>
                                                                <div style={{clear:'both'}}></div>
                                                                <Divider />
                                                                <br/>
                                                                    <span>عنوان: {v.title}</span>
                                                                    <span style={{marginRight:'10px'}}>({v.display?'نمایش':'مخفی'})</span>
                                                                    <div style={{float:'left', textAlign:'left'}}>
                                                                        <IconButton>
                                                                            <span style={{margin:'6px'}}><HiPencil fontSize="lg"/></span>
                                                                        </IconButton>
                                                                        <IconButton
                                                                        onClick={() => {
                                                                            const t = tools.filter(e=> e !== v)
                                                                            setTools(t)
                                                                        }}
                                                                        >
                                                                            <span style={{margin:'6px'}}><HiTrash fontSize='lg'/></span>
                                                                        </IconButton>
                                                                    </div>
                                                                    <br/>
                                                                    <p>اولویت نمایش</p>
                                                                    <Select
                                                                    value={v.periority}
                                                                    sx={{width:'40%'}}
                                                                    >
                                                                        {
                                                                            [...Array(tools.length)].map((_, index) => {
                                                                                return (
                                                                                    <Option key={index} value={index+1}>{index+1}</Option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Select>
                                                                <div style={{clear:'both'}}></div>
                                                            </Box>
                                                        </Box>
                                                    )
                                                })
                                            }
                                        

                                            <Grid xs={12}>
<br/>

                                            {/* نمایش ادیتور */}
                                            <FormLabel>ادیتور</FormLabel>
                                            <CKeditor 
                                            editorLoaded={editorLoaded}
                                            value={String(editCode)}
                                            onChange={(e: any) => setEditCode(e)} 
                                            name={""} 
                                            />
                                            </Grid>

                                        <Button sx={{background:'none'}}
                                        onClick={() => {
                                            setCode(!code)
                                        }}
                                        >
                                            {
                                                code?'مخفی سازی کد':'نمایش کد'
                                            }
                                        </Button>
                                
                                                <br/>
                                   {

                                    code&&
                                    <>
                                    <Grid xs={12} sx={{direction:'ltr', textAlign:'left'}}>
                                    <FormLabel>Html</FormLabel>

                                        <CodeHtml value={(e:any) => setHtnl(e)} 
                                        defaultValue={html}
                                        />
                                    </Grid>
                                    <Grid xs={12} sx={{direction:'ltr', textAlign:'left'}}>
                                        <FormLabel>Less (css)</FormLabel>
                                        <CodeLess value={(e:any) => setCss(e)} 
                                        defaultValue={css}
                                        />
                                    </Grid>

                                    <Grid xs={12} sx={{direction:'ltr', textAlign:'left'}}>
                                    <FormLabel>Javascript</FormLabel>

                                        <CodeJavascript value={(e:any) => setJavascript(e)} 
                                        defaultValue={javascript}
                                        />
                                    </Grid>

                                    <Grid xs={12} sx={{direction:'ltr', textAlign:'left'}}>
                                    <FormLabel>Meta</FormLabel>
                                        <CodeHtml value={(e:any) => setMeta(e)} 
                                        defaultValue={meta}
                                        />
                                    </Grid>
                                    </>
                                   } 

                            </Grid>
                    </Card>


                </Grid>

                <Grid sm={12} md={4}>
                <Card className="card" variant="outlined">
                    <h3>تنظیمات پیشرفته</h3>
                    <Divider />
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={options.header} 
                            onChange={() => setOptions({...options,header:!options.header})}
                        />} label="نمایش هدر" />
                        <FormControlLabel control={<Switch checked={options.footer} 
                            onChange={() => setOptions({...options,footer:!options.footer})}
                        />} label="نمایش فوتر" />
                        <FormControlLabel control={<Switch checked={options.robot} 
                            onChange={() => setOptions({...options,robot:!options.robot})}
                        />} label="نمایش به رباط ها" />
                        <FormControlLabel control={<Switch checked={options.home} 
                            onChange={() => setOptions({...options,home:!options.home})}
                        />} label="صفحه اصلی" />
                    </FormGroup>

                                    <FormLabel>
                                        <span>لینک سفارشی</span> 
                                    <Input
                                        className="form-control"
                                        size={'lg'}
                                        // startDecorator={<AiOutlineFontSize />}
                                        fullWidth
                                        required
                                        value={formData.link}
                                        sx={{direction:'ltr',textAlign:'left'}}
                                        onChange={(e) => {
                                            setTyping(true)
                                                setFormData({...formData,link:e.target.value})}
                                        } 
                                    />
                                    <span>لینک باید تک کلمه ای و منحصر باشد</span>
                                    {response?.errors?.slug&&<span className="err">{response?.errors?.slug}</span>}
                                    </FormLabel>   

                                    <FormLabel>
                                        <span>عنوان صفحه</span> 
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
                                    </FormLabel>                       
                                    
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
                </Card>
                </Grid>

            </Grid>
            <Card className="card" sx={{marginTop:'10px'}}>
                {response?.message&&<span className="err">{response?.message}</span>}
                {response?.status&&<span className="success">{response?.msg}</span>}
                    <Button onClick={()=> onClickHandleFormData()
                    } className="primary">ثبت اطلاعات</Button>                    
                </Card>
            </Box>
        </Container>

        <Modal
            open={open}
            onClose={() => {
                setOpen(false)
                setPosition('')
                setPlugin(PLUGIN)
            }}
            >
            <ModalDialog
            className={'modal-omid'}
            sx={{width:'100%', maxWidth:'660px', maxHeight:'700px',overflow:'auto'}}
            >
                <br />
                <Divider />
                <br />
                {/* "type":"slider","pos":"pos1","loc":1,"id":1 */}
                <Grid container spacing={1.5}>
                    <Grid xs={12} sm={12} md={6} lg={6}>
                            <FormLabel>
                                <span>ابزارک</span>
                                <Select 
                                size='lg'
                                sx={{width:'100%'}}
                                onChange={(e, s) => {
                                    setSelectType([])
                                    switch(s){
                                    case"product":
                                        setSelectType(template.product_plugins || [])
                                        break;
                                    case"one_product":
                                        handleProduct()
                                        break;
                                    case"service":
                                        setSelectType(template.service_plugins || [])
                                        break;
                                    case"paralax":
                                        setSelectType([])
                                        break;
                                    case"blog":
                                        setSelectType(template.blog_plugins || [])
                                        break;
                                    case"text":
                                    //to database
                                        handleText()
                                        break;
                                    case"menu":
                                        //to database
                                            handleMenu()
                                            break;
                                    case"slider":
                                    // to database
                                        handleSlider()
                                        break;
                                    case"project":
                                        setSelectType(template.project_plugins || [])
                                        break;
                                    default:
                                        setSelectType([])
                                    }
                                    setPlugin({...plugin,tools:s})
                                    setPlugin({...plugin,tools:s})
                                }}
                                value={plugin.tools}
                                >
                                    <Option value="">انتخاب یک ابزارک</Option>
                                    {
                                        template.plugins.map((v:string, i:number) => {
                                            let title = ''
                                            switch(v){
                                                case"product":
                                                    title = 'نمایش کالا';
                                                    break;
                                                case"one_product":
                                                    title = 'کالا تکی';
                                                    break;
                                                case"service":
                                                title = 'نمایش خدمات';
                                                    break;
                                                case"paralax":
                                                title = 'پارالاکس';
                                                    break;
                                                case"blog":
                                                title = 'نمایش مقاله';
                                                    break;
                                                case"text":
                                                title = ' نمایش متن (کد)';
                                                    break;
                                                case"slider":
                                                title = 'اسلایدر';
                                                    break;
                                                case"project":
                                                title = 'نمایش نمونه کار';
                                                    break;
                                                case"menu":
                                                    title = 'نمایش منو';
                                                        break;
                                            }
                                            return (
                                                <Option key={i} value={v}>{title}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                
                            </FormLabel>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6}>
                        <FormLabel>
                            <span><br/></span>
                            <Select 
                            size='lg'
                            sx={{width:'100%'}}
                            value={plugin.type}
                            onChange={(e, v) => setPlugin({...plugin,type:v})}
                            >
                                <Option value="">انتخاب یک ابزارک</Option>
                                {
                                    selectType.map((v:any, i:any) => {
                                        
                                        return(
                                            <Option key={i} value={typeof v === "object"?v.id:v}>{typeof v === "object"?v.title:v}</Option>
                                        )
                                    })
                                }
                            </Select>
                            
                        </FormLabel>
                    </Grid>
                </Grid>
                    <p><br/></p>
                    <label>موبایل عمودی</label>
                    <Grid container spacing={1}>
                        <Grid xs={2}>
                            <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.xs===0?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,xs:0}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    مخفی
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.xs===12?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,xs:12}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/1
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.xs===6?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,xs:6}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/2
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.xs===4?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,xs:4}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/3
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.xs===3?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,xs:3}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/4
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.xs===8?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,xs:8}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    2/3
                            </Button>
                        </Grid>
                    </Grid>
                    <p><br/></p>
                    <label>موبایل افقی</label>
                    <Grid container spacing={1}>
                        <Grid xs={2}>
                            <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.sm===0?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,sm:0}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    مخفی
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.sm===12?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,sm:12}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/1
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.sm===6?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,sm:6}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/2
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.sm===4?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,sm:4}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/3
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.sm===3?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,sm:3}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/4
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.sm===8?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,sm:8}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    2/3
                            </Button>
                        </Grid>
                    </Grid>
                    <p><br/></p>
                    <label>تبلت</label>
                    <Grid container spacing={1}>
                        <Grid xs={2}>
                            <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.md===0?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,md:0}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    مخفی
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.md===12?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,md:12}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/1
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.md===6?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,md:6}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/2
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.md===4?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,md:4}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/3
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.md===3?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,md:3}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/4
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.md===8?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,md:8}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    2/3
                            </Button>
                        </Grid>
                    </Grid>
                    <p><br/></p>
                    <label>دسکتاپ</label>
                    <Grid container spacing={1}>
                        <Grid xs={2}>
                            <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.lg===0?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,lg:0}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    مخفی
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.lg===12?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,lg:12}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/1
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.lg===6?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,lg:6}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/2
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.lg===4?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,lg:4}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/3
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.lg===3?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,lg:3}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    1/4
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                        <Button
                            sx={{
                                border:'1px dashed gray',
                                padding:.3,
                                textAlign:'center',
                                cursor:'pointer',
                                background:plugin.grid.lg===8?'gray':'none',
                                width:'100%'
                            }}
                            onClick={() => {
                                const d = {...plugin.grid,lg:8}
                                setPlugin({...plugin,grid:d})
                            }}
                            >
                                    2/3
                            </Button>
                        </Grid>
                    </Grid>

                    <p><br/></p>

<Grid container spacing={1.5}>
    <Grid xs={12} sm={6}>
        <FormLabel>
            <span>موقعیت قرارگیری</span>
            <Select
            sx={{width:'100%'}}
            value={plugin.pull}
            onChange={(e:any, v:any) => {
                setPlugin({...plugin,pull:v})
            }}
            >
                <Option value=''>بدون موقعیت</Option>
                <Option value='left'>چپ</Option>
                <Option value='right'>راست</Option>
            </Select>
        </FormLabel>
    </Grid>
    <Grid xs={12} sm={6}>
        <FormLabel>
            <span>نوع المان</span>
            <Select
            sx={{width:'100%'}}
            value={plugin.element}
            onChange={(e:any, v:any) => {
                setPlugin({...plugin,element:v})
            }}
            >
                <Option value='div'>تگ div</Option>
                <Option value='asid'> تگ asid</Option>
                <Option value='section'>تگ section</Option>
            </Select>
        </FormLabel>
    </Grid>
</Grid>
<p><br/></p>

<Grid container spacing={1.5}>
    <Grid xs={12} sm={6}>
        <FormLabel>
            <span>عنوان ابزارک</span>
            <Input
            className='form-control'
            size="lg"
            fullWidth
            value={plugin.title}
            onChange={(e:any) => setPlugin({...plugin,title:e.target.value})}
            />
        </FormLabel>
    </Grid>
    <Grid xs={12} sm={6}>
        <FormLabel>
            <span>حالت نمایش عنوان</span>
            <Select
            sx={{width:'100%'}}
            value={plugin.display}
            onChange={(e:any, v:any) => setPlugin({...plugin,display:v})}
            >
                <Option value={true}>نمایش</Option>
                <Option value={false}>مخفی</Option>
            </Select>
        </FormLabel>
    </Grid>
</Grid>
                    <p><br/></p>
                    <Grid container spacing={1.5}>
                        <Grid xs={5}>
                            <FormLabel>
                                <Select
                                sx={{width:'100%'}}
                                value={plugin.colorType}
                                onChange={(e, v) => {
                                    if (!v) {
                                        setPlugin({...plugin, color:''})
                                    }
                                    setPlugin({...plugin, colorType:v})
                                }}
                                >
                                    <Option value={false}>پیشفرض سایت</Option>
                                    <Option value={true}>انتخاب رنگ</Option>
                                </Select>
                            </FormLabel>
                        </Grid>
                        <Grid xs={2}>
                        {
                            plugin.colorType?
                            <Input
                            fullWidth
                            value={plugin.color}
                            onChange={(e) => setPlugin({...plugin,color:e.target.value})}
                            type="color"/>
                            :<Box sx={{width:'100%'}}></Box>
                        }
                        </Grid>
                        <Grid xs={5}>

                            <FormLabel
                            sx={{
                                width:'100%',
                                height:'150px',
                                border:'1px dashed gray',
                                backgroundColor:'none',
                                background:'url('+plugin.img+') no-repeat',
                                backgroundSize:'cover',
                                color:'gray',
                                textAlign:'center',
                                cursor:'pointer'
                            }}>
                                <Input type="file" hidden
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setTyping(true)
                                        uploadHandle(e.target.files[0]);
                                    }
                                }}
                                />
                                بارگذاری تصویر
                            </FormLabel>
                            {
                                typing?
                                <>
                                درحال بارگذاری تصویر
                                <span className="small-loading"></span>
                                </>
                                : ''
                            }
                        </Grid>
                    </Grid>
                    <p><br/></p>

                <Grid container spacing={1.5}>
                    <Grid xs={12} sm={6}>
                        <FormLabel>
                            <span>شناسه</span>
                            <Input
                            className='form-control'
                            size="lg"
                            fullWidth
                            value={plugin.id}
                            sx={{direction:'ltr', textAlign:'left'}}
                            onChange={(e)=>{setPlugin({...plugin,id:e.target.value})}}
                            />
                        </FormLabel>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <FormLabel>
                            <span>کلاس</span>
                            <Input
                            className='form-control'
                            size="lg"
                            fullWidth
                            value={plugin.class}
                            sx={{direction:'ltr', textAlign:'left'}}
                            onChange={(e)=>{setPlugin({...plugin,class:e.target.value})}}
                            />
                        </FormLabel>
                    </Grid>
                </Grid>
                <p><br/></p>

                <Button className="primaty"
                    onClick={() => {
                        // const t = tools
                        // t.push(plugin)
                    addToolsHandle()
                        
                    }}
                >تایید</Button>
                                    <p><br/></p>

            </ModalDialog>
        </Modal>

            <Modal
            open={success}
            onClose={() => {return false}}
            >
            <ModalDialog>
                <Typography>صفحه با موفقیت ایجاد شد</Typography>
                <br/>
                <Divider />
                <br/>
                <Button color="primary"
                onClick={() => {
                    router.push('/article/page')
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
    )
}