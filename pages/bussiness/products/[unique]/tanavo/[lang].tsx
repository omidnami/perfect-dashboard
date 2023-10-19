
import Header from "@/Components/header";
import Lang from "@/Components/lang";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Alert, AspectRatio, Box, Button, Card, CardOverflow, Chip, Divider, FormLabel, Grid, IconButton, Input, Option, Select, Switch, Table, Textarea, Tooltip, Typography } from "@mui/joy";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineFontSize, AiOutlineLink, AiOutlineSearch } from "react-icons/ai";

import { HiCalendar, HiCreditCard, HiDevicePhoneMobile, HiDocumentText, HiEnvelope, HiFlag, HiGlobeAlt, HiKey, HiMap, HiPencil, HiPhone, HiUser } from "react-icons/hi2";
import { ifError } from "assert";
import TagMaker from "@/Components/tagMaker";
import { GrClose, GrTrash } from "react-icons/gr";
import { BottomNavigationClassKey, FormControlLabel } from "@mui/material";
import __separate from "@/Libs/separate";
import __timeAgo from "@/Libs/timeAgo";
interface TanavoInter {
    value:string,
    type:string,
    status:boolean,
    depo:any,
    price:any,
    img:number,
    pid:number,
    data:any,
}

const serverData:TanavoInter = {
    value:'',
    type:'',
    status:true,
    depo:{quty:'',max:'',min:1,vahed:''},
    price:{prc:'',discount:'',date:'',vahed:''},
    img:0,
    pid:0,
    data:{garanty:'',tranDay:'',text:'',noQuty:'',acountingCode:''},
}
let rows:any[] = []
export default function Tanavo() {
    const router = useRouter()
    const [lang, setLang] = useState<any>()
    const [unique, setUnique] = useState<string>()
    const [formData, setFormData] = useState(serverData)
    const [selectLang, setSelectLang] = useState<boolean>(false)
    const [file, setFile] = useState<File>()
    const [fileLoad, setFileLoad] = useState<string>()
    const [onLoad, setOnLoad] = useState<boolean>(false)
    const {postData, response, status} = useFetch() 
    const [typing, setTyping] = useState(false)
    const [tags, setTags] = useState<string[]>([])
    
    const [images , setImages] = useState<any[]>([])
    const [productTitle , setProductTitle] = useState<string>()
    const [id, setId] = useState()
    const [uploading, setUploading] = useState<boolean>(false)
    const [dynamic, setDynamic] = useState<any[]>([])
    const [defaultType, setDefaultType] = useState<string>('')
    const [edit, setEdit] = useState<boolean>(false)
    const [did, setDid] = useState(0)
    
    function createData(
        value: any,
        price: string,
        discount: string,
        date: string,
        id: number,
      ) {
        return { value, price, discount, date, id };
      }


    useEffect(() => {
        console.log('router');
        setUnique(router.query.unique+'')
        setLang(router.query.lang)        
        server()
    } ,[router])

    useEffect(() => {
        console.log(response);

        if (response?.status && response?.slug) {
            console.log(response.title);
            setImages(response.img)
            setProductTitle(response.title)
            setId(response.id)

            let header = { 
                'Content-Type': 'multipart/form-data',
                'lang': lang
            }
            postData('product_dynamic/select',{pid:response.id}, header)
            
            
        }else if (response?.status && response?.msg === 'uploaded') {
            
            setImages(response.data)
            setUploading(false)
            setOnLoad(true)
            //remove back
        }else if(response?.status && response?.msg === 'success') {
            setEdit(false)
            setDid(0)
            rows = []
            setDynamic(response.data)
            if (response.data.length) {
                serverData.type = response.data[0].type
                setDefaultType(response.data[0].type)
            }else{
                setDefaultType('')
            }
            setFormData(serverData)

            for (let item of response.data) {
                let value = item.type === 'color'?<p style={{background:item.value,height:20,width:20}}></p>:item.value
                const price = JSON.parse(item.price)
                
                rows.push(
                    createData(
                        value,
                        __separate(price.prc)+' '+price.vahed,
                        __separate(price.discount)+' '+price.vahed,
                        __timeAgo(price.date), item.id)
                  )  
            }
            setOnLoad(true)
        }else if(lang && !response){
            router.back()
        }
        
    }, [response])
/******************************************************************************/
    //action
    const upload = async (file:File) => {
        console.log(file);

        let header = { 
            'Content-Type': 'multipart/form-data',
            'lang': lang
        }
        
            const data = {unique:unique,file:file}
    
            await postData('product/add_gallery',data, header)
    }
    const server = async() => {
        document.body.classList.add('loading')
        setOnLoad(false)
        console.log(router.query.lang);
        console.log(router.query.unique); 
        
        const header = {
            'lang': router.query.lang
          }
              await postData(`product/select`,{unique:router.query.unique},header)
    }

    const onChangeLangHadle = async (e:any) => {
        document.body.classList.add('loading')
        setOnLoad(false)
        router.push(`/bussiness/products/${unique}/tanavo/${e}`)

        setLang(e)
    }

    const onClickHandleFormData = async () => {
        document.body.classList.add('loading')
        setOnLoad(false)
        let header = { 
          'Content-Type': 'multipart/form-data',
          'lang': lang
        }
        
        const data = {...formData,
            pid:id,
            depo:JSON.stringify(formData.depo),
            data:JSON.stringify(formData.data),
            price:JSON.stringify(formData.price),
        }
        if (edit) {
            await postData('product_dynamic/update',{...data,id:did},header)
        }else {

            await postData('product_dynamic/insert',data,header)
        }
        
        // if (unique && unique !== 'insert' && !selectLang) {
        //   await postData('brand/update',{...data,unique:unique}, header)
        // }else {
        //   await postData('brand/insert',data, header)
        // }

    }

    const typeValueHandele = () => {
        switch(formData.type){
            case 'color':
                return 'color'
            default:
                return 'text'
        }
    }

    const deleteHandle = async(idd:any) => {
        await postData('product_dynamic/delete',{id:idd,pid:id},null)
    }

    const editHandle = (idd:any) => {
        setEdit(true)
        setDid(idd)

        let obj = dynamic.filter(e=> e.id === idd)

        let data = JSON.parse(obj[0].data)
        let depo = JSON.parse(obj[0].depo)
        let price = JSON.parse(obj[0].price)

        price = {...price,date:Math.floor((price.date - Math.floor(Date.now()/1000))/86400)}

        setFormData({...obj[0],
            data:data,
            depo:depo,
            price:price,
        })
        window.scrollTo(0, 0);
        console.log(obj[0]);
        
    }
    if (onLoad) {
            document.body.classList.remove('loading')
            
    }



    return (
    <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'60%',float:'right'}}>تنوع و قیمت گذاری</h1>
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
                        <h3>{productTitle}</h3>
                        {
                            edit&&
                        <Alert variant="soft" color="primary">شما در حال ویرایش این ایتم هستید</Alert>
                        }
                        <Divider />

                            <Grid container spacing={1.5}>
                                <Grid lg={2} md={2} sm={6} xs={12}>
                                    <FormLabel>
                                        <span>تنوع مجاز<small className="text-danger pr-1">*</small></span> 
                                    
                                    <Select
                                        size="lg"
                                        sx={{width:'100%'}}
                                        value={formData.type}
                                        onChange={(e,v:any) => {
                                            setFormData({...formData,type:v,value:''})
                                        }}
                                        disabled={defaultType?true:false}
                                    >
                                        <Option value=''>انتخاب یک سطح تنوع</Option>
                                        <Option value='color'>رنگ</Option>
                                        <Option value='size'>سایز</Option>
                                        <Option value='storage'>حافظه داخلی</Option>
                                        <Option value='weght'> وزن</Option>
                                    </Select>
                                    
                                    {response?.errors?.type&&<span className="err">{response?.errors?.type}</span>}
                                    </FormLabel>
                                </Grid>
                                <Grid lg={3} md={3} sm={6} xs={12}>
                                    <FormLabel>
                                        <span>مقدار<small className="text-danger pr-1">*</small></span> 
                                    
                                     <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.value}
                                        type={typeValueHandele()}
                                        onChange={(e) => {
                                            setFormData({...formData,value:e.target.value})}
                                        }
                                    />
                                    
                                    {response?.errors?.value&&<span className="err">{response?.errors?.value}</span>}
                                    </FormLabel>
                                </Grid>

                                <Grid  lg={5} md={5} sm={7} xs={8}>
                                    <FormLabel>
                                        <span>گارانتی</span>
                                        <Select
                                        size="lg"
                                        sx={{width:'100%'}}
                                        value={formData.data.garanty}
                                        onChange={(e,v:any) => {
                                            const data = {...formData.data,garanty:v}
                                            setFormData({...formData,data:data})
                                        }}
                                    >
                                        <Option value=''>اصالت و سلامت فیزیکی کالا</Option>
                                        <Option value='db54rg6788'>گارانتی ۱۸ ماهه سازگار ارقام</Option>
                                    </Select>

                                    </FormLabel>
                                </Grid>
                                <Grid  lg={2} md={2} sm={5} xs={4}>
                                    <FormLabel>
                                        <span>بازه ارسال<small className="text-danger pr-1">*</small></span>
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.data.tranDay}
                                        id="lname"
                                        type="number"
                                        onChange={(e) => {
                                            const data = {...formData.data,tranDay:Number(e.target.value)}
                                            setFormData({...formData,data:data})
                                        }}
                                    />
                                {response?.errors?.transDay&&<span className="err">{response?.errors?.transDay}</span>}

                                    </FormLabel>
                                </Grid>

                                <Grid lg={12} md={12}>
                                    <FormLabel>
                                    <FormControlLabel
                                        sx={{marginTop:2}}
                                        label="وضعیت کالا" 
                                        control={
                                        <Switch defaultChecked 
                                        checked={formData.status}
                                        sx={{paddingLeft:2,marginBottom:1.5,direction:'ltr'}}
                                        onChange={() => {
                                            setFormData({...formData,status:!formData.status})
                                        }} />
                                        }
                                        /> 
                                    </FormLabel>
                                        
                                </Grid>
                                <Grid  lg={3} md={3} sm={6} xs={6}>
                                    <FormLabel>
                                        <span>موجودی انبار</span>
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.depo.quty}
                                        id="lname"
                                        type="number"
                                        onChange={(e) => {
                                            const data = {...formData.depo,quty:e.target.value}
                                            setFormData({...formData,depo:data})
                                        }}
                                    />

                                    </FormLabel>
                                </Grid>
                                <Grid lg={3} md={3} sm={6} xs={6}>
                                    <FormLabel>
                                        <span>واحد اندازه گیری</span> 
                                    
                                    <Select
                                        size="lg"
                                        sx={{width:'100%'}}
                                        value={formData.depo.vahed}
                                        onChange={(e,v:any) => {
                                            const data = {...formData.depo,vahed:v}
                                            setFormData({...formData,depo:data})
                                        }}
                                    >
                                        <Option value='عدد'>عدد</Option>
                                        <Option value='بسته'>بسته</Option>
                                        <Option value='کیلوگرم'>کیلوگرم</Option>
                                        <Option value='گرم'>گرم</Option>
                                        <Option value='متر'>متر</Option>
                                        <Option value='سانتیمرد'>سانتیمرد</Option>
                                        <Option value='لیتر'>لیتر</Option>
                                    </Select>
                                    
                                    </FormLabel>
                                </Grid>
                                <Grid  lg={3} md={3} sm={6} xs={6}>
                                    <FormLabel>
                                        <span>حداقل سفارش در سبد</span>
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.depo.min}
                                        id="lname"
                                        type="number"
                                        onChange={(e) => {
                                            const data = {...formData.depo,min:e.target.value}
                                            setFormData({...formData,depo:data})
                                        }}
                                    />

                                    </FormLabel>
                                </Grid>
                                <Grid  lg={3} md={3} sm={6} xs={6}>
                                    <FormLabel>
                                        <span>حداکثر سفارش در سبد</span>
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.depo.max}
                                        id="lname"
                                        type="number"
                                        onChange={(e) => {
                                            const data = {...formData.depo,max:e.target.value}
                                            setFormData({...formData,depo:data})
                                        }}
                                    />

                                    </FormLabel>
                                </Grid>
                                <Grid xs={12}>
                                <FormLabel>
                                        <span>درج توضیح برای تنوع 100/0</span>
                                    <Textarea
                                    value={formData.data.text}
                                    minRows={6}
                                    sx={{width:'100%'}}
                                    onChange={(e) => {
                                        const data = {...formData.data,text:e.target.value}
                                        setFormData({...formData,data:data})
                                    }}
                                    />
                                </FormLabel>
                                </Grid>

                                <Grid  lg={3} md={3} sm={6} xs={6}>
                                    <FormLabel>
                                        <span> قیمت<small className="text-danger pr-1">*</small></span>
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.price.prc}
                                        id="lname"
                                        type="number"
                                        onChange={(e) => {
                                            const data = {...formData.price,prc:e.target.value}
                                            setFormData({...formData,price:data})
                                        }}
                                    />
                                    {response?.errors?.price&&<span className="err">{response?.errors?.price}</span>}

                                    </FormLabel>
                                </Grid>
                                <Grid lg={3} md={3} sm={6} xs={6}>
                                    <FormLabel>
                                        <span>واحد پول</span> 
                                    
                                    <Select
                                        size="lg"
                                        sx={{width:'100%'}}
                                        value={formData.price.vahed}
                                        onChange={(e,v:any) => {
                                            const data = {...formData.price,vahed:v}
                                            setFormData({...formData,price:data})
                                        }}
                                    >
                                        <Option value='تومان'>تومان</Option>
                                        <Option value='ریال'>ریال</Option>
                                        <Option value='usd'>usd</Option>
                                        <Option value='euro'>euro</Option>
                                        <Option value='usdt'>usdt</Option>
                                        <Option value='btc'>btc</Option>
                                    </Select>
                                    
                                    </FormLabel>
                                </Grid>
                                <Grid  lg={3} md={3} sm={6} xs={6}>
                                    <FormLabel>
                                        <span>قیمت بعد از تخفیف</span>
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.price.discount}
                                        id="lname"
                                        type="number"
                                        onChange={(e) => {
                                            const data = {...formData.price,discount:e.target.value}
                                            setFormData({...formData,price:data})
                                        }}
                                    />

                                    </FormLabel>
                                </Grid>
                                <Grid  lg={3} md={3} sm={6} xs={6}>
                                    <FormLabel>
                                        <span>زمان پایان تخفیف (روز)</span>
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.price.date}
                                        id="lname"
                                        type="number"
                                        onChange={(e) => {
                                            const data = {...formData.price,date:e.target.value}
                                            setFormData({...formData,price:data})
                                        }}
                                    />

                                    </FormLabel>
                                </Grid>

                                <Grid  lg={8} md={8} sm={12} xs={12}>
                                    <FormLabel>
                                        <span>متن در صورت عدم موجودی</span>
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.data.noQuty}
                                        id="lname"
                                        onChange={(e) => {
                                            const data = {...formData.data,noQuty:e.target.value}
                                            setFormData({...formData,data:data})
                                        }}
                                    />

                                    </FormLabel>
                                </Grid>
                                <Grid  lg={4} md={4} sm={12} xs={12}>
                                    <FormLabel>
                                        <span>کد کالا در سیستم حسابداری</span>
                                    <Input
                                        size={'lg'}
                                        startDecorator={<HiGlobeAlt />}
                                        fullWidth
                                        required
                                        value={formData.data.acountingCode}
                                        id="lname"
                                        onChange={(e) => {
                                            const data = {...formData.data,acountingCode:e.target.value}
                                            setFormData({...formData,data:data})
                                        }}
                                    />

                                    </FormLabel>
                                </Grid>
                                <Grid xs={12}>
                                    <Typography>
                                        انتخاب تصویر برای تنوع
                                    </Typography>
                                    {
                    response?.errors?.file&&

                    response.errors.file.map((v:any,i:any) => { 
                    return(<span key={i} className="err">{v}</span>)
                    })
            
                    }
                                </Grid>
                                <Grid sx={{position:'relative'}} xs={4} sm={3} md={2} lg={2}>
                    <Input 
                    // disabled = {uploading?true:false}
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
                    
                                {
                                    images.map((v:any, i:any) => {
                                            return(
                                                <Grid key={i} xs={4} sm={3} md={2} lg={2}>
                                                <Card variant="outlined">
                                                            <CardOverflow>
                                                                <AspectRatio>
                                                                <img
                                                                    src={process.env.NEXT_PUBLIC_API_URL+v.url}
                                                                    srcSet={process.env.NEXT_PUBLIC_API_URL+v.url}
                                                                    loading="lazy"
                                                                    alt=""
                                                                />
                                                                </AspectRatio>
                                                                <IconButton
                                                                aria-label="Like minimal photography"
                                                                size="md"
                                                                variant="plain"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    zIndex: 2,
                                                                    borderRadius: '50%',
                                                                    right: '1rem',
                                                                    bottom: 0,
                                                                    transform: 'translateY(50%)',
                                                                }}
                                                                >
                                                                <Switch defaultChecked
                                                                checked={formData.img === v.id?true:false}
                                                                onChange={() => {
                                                                    if (formData.img === v.id) {
                                                                        setFormData({...formData,img:0})
                                                                    }else {
                                                                        setFormData({...formData,img:v.id})
                                                                    }
                                                                }}
                                                                sx={{paddingLeft:2,marginBottom:1.5,direction:'ltr'}} />
                                                                                            
                                                                </IconButton>
                                                            </CardOverflow>
                                                            </Card>
                                                </Grid>
                                            )
                                    })
                                }
                                                                    </Grid>
                                                                    <Card className="card" sx={{marginTop:'10px'}}>
                                                        {response?.message&&<span className="err">{response?.message}</span>}
                                                        {/* {response?.status&&<span className="success">{response?.msg}</span>} */}
                                                            <Button onClick={()=> onClickHandleFormData()
                                                            } className="primary">ثبت اطلاعات</Button>                    
                                                        </Card>
                                                            </Card>

                


                </Grid>

            </Grid>

            <Card className='card'>
            <Table aria-label="table sizes" size='md'>
        <thead>
          <tr dir="rtl" style={{textAlign:'right'}}>
            <th  style={{textAlign:'right'}}>مقدار</th>
            <th style={{textAlign:'right'}}>قیمت</th>
            <th style={{textAlign:'right'}}>تخفیف</th>
            <th style={{textAlign:'right'}}>پایان تخفیف</th>
            <th style={{textAlign:'right'}}>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {rows&&rows.map((row:any) => (
            <tr key={row.id}>
              <td>{row.value}</td>
              <td>{row.price}</td>
              <td>{row.discount}</td>
              <td>{row.date}</td>
              <td>


                                        <Tooltip title="حذف" variant="solid" placement="top">
                                                <IconButton id='trush' variant="soft" color="neutral" sx={{ mr: 'auto',float:'left'  }}
                                                onClick={() => deleteHandle(row.id)}
                                                >
                                                    <GrTrash />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip id="text-copy" title="ویرایش" variant="solid" placement="top">

                                                <IconButton id='link' variant="soft" color="neutral" sx={{ mr: 'auto',float:'left' }}
                                                    onClick={() => editHandle(row.id)}
                                                >
                                                    <HiPencil />
                                                </IconButton>
                                            </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
            </Card>
            </Box>
        </Container>
    </main>  
    )
}