
import Header from "@/Components/header";
import Lang from "@/Components/lang";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { AspectRatio, Avatar, Box, Button, Card, Checkbox, Chip, Divider, FormLabel, Grid, Input, ListDivider, ListItemDecorator, Modal, ModalDialog, Option, Radio, Select, Textarea, Typography } from "@mui/joy";
import { List as ListItem } from "@mui/joy";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { AiFillPlusCircle, AiOutlineFontSize, AiOutlineLink, AiOutlineSearch } from "react-icons/ai";

import { HiCalendar, HiCreditCard, HiDevicePhoneMobile, HiDocumentText, HiEnvelope, HiFlag, HiGlobeAlt, HiKey, HiMap, HiPencil, HiPhone, HiTrash, HiUser } from "react-icons/hi2";
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


const serverData = {
    title:'',
    meta_key:'',
    desc:'',
    canonical:'',
    link:''
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
    const [plugin, setPlugin] = useState<any>({type:"",pos:"",loc:1,id:0,class:'',ids:''})
    const [selectType, setSelectType] = useState<any[]>([])
    const [options, setOptions] = useState<any>({footer:true, header:true, robot: true, home:false})

    useEffect(() => {
        setUnique(router.query.unique)
        setLang(router.query.lang)


        setHtnl('')
        setJavascript('')
        setCss('')
        setTools([])
        setOptions({footer:true, header:true, robot: true, home:false})
        setMeta('')
        setFormData(serverData)
        setTags([])

        server()
    } ,[router])

    useEffect(() => {
        console.log(response);
        
        //edit
        if (response && response?.id) {
            console.log(JSON.parse(response.options));
            const opt = JSON.parse(response.options);
            setHtnl(response.text??'')
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
                            <Grid container spacing={1.5}>
                                {
                                    template.position.map((v:any, i:any) => {
                                       const t = tools.filter((e: { pos: any; })=> e.pos === v)
                                       const h:number = (t.length+1) * 4
                                        return(
                                            <Box key={i} component='section'
                                            sx={{
                                                border:'dashed 1px gray',
                                                padding:h,
                                                width:'100%',
                                                borderRadius:7,
                                                marginBottom:3,
                                                textAlign:'center',
                                                cursor:'pointer',
                                                position:'relative',
                                                }}
                                            >
                                                <Box component='div'
                                                sx={{
                                                    width:'99%',
                                                
                                                    position:'absolute',
                                                    top:0,
                                                    right:0
                                                }}
                                                >
                                                    {
                                                        t.map((item, i) => {
                                                            return (
                                                                <Box
                                                                key={i}
                                                                sx={{
                                                                    margin:.5,
                                                                    padding:1.3,
                                                                    backgroundColor:'rgba(0,0,0,.1)',
                                                                    width:'100%'
                                                                }}
                                                                >
                                                                <Grid container spacing={1}>
                                                                    <Grid xs={.5}><HiTrash 
                                                                    onClick={() => {
                                                                        const d = tools.filter(e=> e !== item)
                                                                        setTools(d)
                                                                    }}
                                                                    /></Grid>
                                                                    <Grid xs={.5}><HiPencil /></Grid> 
                                                                    <Grid xs={2}>{item.type}</Grid>
                                                                    <Grid xs={7.5}>{item.id}</Grid>
                                                                    <Grid xs={1.5}><Input type="number" size="sm" placeholder={item.loc}
                                                                    onChange={(e) => {
                                                                        const edit = {...item,loc:e.target.value}
                                                                        const d = tools.filter(e=> e !== item)
                                                                        setTools([...d,edit])
                                                                    }}
                                                                    /></Grid>
                                                                </Grid>
                                                                </Box>
                                                            )
                                                        })
                                                    }
                                                </Box>

                                                <Box component='div'
                                                sx={{fontSize:30, textAlign:'center',
                                                position:'absolute',
                                                bottom:0
                                                }}
                                                onClick={() => {
                                                    const t = tools.filter(e=> e.pos=== v)
                                                    
                                                    setPlugin({...plugin,pos:v,loc:t.length+1})
                                                    setOpen(true)
                                                    setPosition(v)
                                                }}
                                                >
                                                    {v}
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
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
                setPlugin({type:"",pos:"",loc:1,id:0,class:'',ids:''})
            }}
            >
            <ModalDialog
            className={'modal-omid'}
            sx={{width:'100%', maxWidth:'660px'}}
            >
                موقعیت {position}
                <br />
                <Divider />
                <br />
                {/* "type":"slider","pos":"pos1","loc":1,"id":1 */}
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
                        setPlugin({...plugin,type:s})
                    }}
                    value={plugin.type}
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
                                    
                                }
                                return (
                                    <Option key={i} value={v}>{title}</Option>
                                )
                            })
                        }
                    </Select>
                    
                </FormLabel>
                    <br />
                <FormLabel>
                    <span>ابزارک</span>
                    <Select 
                    size='lg'
                    sx={{width:'100%'}}
                    value={plugin.id}
                    onChange={(e, v) => setPlugin({...plugin,id:v})}
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
                <br />
                <Grid container spacing={1.5}>
                    <Grid xs={12} sm={6}>
                        <FormLabel>
                            <span>شناسه</span>
                            <Input
                            className='form-control'
                            size="lg"
                            fullWidth
                            value={plugin.ids}
                            sx={{direction:'ltr', textAlign:'left'}}
                            onChange={(e)=>{setPlugin({...plugin,ids:e.target.value})}}
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
                <br />
                <Button className="primaty"
                    onClick={() => {
                        // const t = tools
                        // t.push(plugin)
                        setTools([...tools,plugin])
                        setOpen(false)
                        
                    }}
                >تایید</Button>
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