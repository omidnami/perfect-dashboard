import { Box, Card, Checkbox, Chip, Divider, Dropdown, FormControl, FormLabel, Grid, Input, ListItemDecorator, Menu, MenuButton, MenuItem, Option, Select, Sheet, Switch, Textarea, Typography } from "@mui/joy";
import { HiGlobeAlt } from "react-icons/hi2";
import TagMaker from "../tagMaker";
import { GrClose } from "react-icons/gr";
import { useEffect, useState } from "react";
import { FormControlLabel } from "@mui/material";
import { useRouter } from "next/router";
import Cat from "./cat";

const data = {
    orginal:true,
    cat:'',
    brand:'',
    model:'',
    title:'',
    type:'F',
    wtype:'گرم',
    atype:'سانتیمتر',
    box:{l:'0',v:'0',h:'0',w:'0'},
    text:'',
    zaf:'',
    ghovat:''
}
export default function Detail(props:any) {
    const route = useRouter()
    const [zaf, setzaf] = useState<string[]>([])
    const [ghovat, setghovat] = useState<string[]>([])
    const [formData, setFormData] = useState(data)
    const [cats, setCats] = useState<any[]>([])
    const [brands, setBrands] = useState<any[]>([])
    const [brandTitle, setBrandTitle] = useState('')

    useEffect(() => {
        
        if (props.cat) {
            server(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/product_cat/select_detail/${props.cat}`,'cat')
        }

        server(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand/select_detail`,'brand')
                    window.scrollTo(0, 500);
    },[route])

    useEffect(() => {
        console.log(formData);
        
        props.setdata(formData)
    },[formData])

    useEffect(() => {
        if (props.update) {
            console.log(props.formData);
            
            if (props.formData?.id) {
                const propsData = props.formData
                let b = brands.filter(e=> e.uniqueId === propsData.brand)
                setBrandTitle(b.length?b[0].title:'');
                setFormData({...propsData,
                box:JSON.parse(propsData.box),
                atype: JSON.parse(propsData.box).atype,
                wtype: JSON.parse(propsData.box).wtype,
                cat: cats.length?propsData.mainCat:'',
                zaf: JSON.parse(propsData.noghat).zaf,
                ghovat: JSON.parse(propsData.noghat).ghovat,
                text: propsData.text??'',
                brand: b.length?propsData.brand:''
            })
            
            setzaf(JSON.parse(JSON.parse(propsData.noghat).zaf))
            setghovat(JSON.parse(JSON.parse(propsData.noghat).ghovat))
            
            }else {
                setBrandTitle('');
                setFormData(data)
                
                setzaf([])
                setghovat([])
            }
        }

    }, [brands])

    useEffect(() => {
        setFormData({...formData,zaf:JSON.stringify(zaf)})
    }, [zaf])

    useEffect(() => {
        setFormData({...formData,ghovat:JSON.stringify(ghovat)})
    }, [ghovat])

    const server = async (url:any, api:string) => {

            try {
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'lang': props.lang
                    },
                }).then(async (res:any) => {
                    let d = await res.json()
                    if (api === 'cat') {
                        setCats(d)
                    }else if(api === 'brand'){
                        console.log('oooh: ',d);

                        setBrands(d)
                    }
                })
            }catch(e) {
                console.log('ERROR product detail: => ',e)
            }

      
    }

    return (
        <Box component='section'>
            <Card className='card'>

            <Grid container >
                <Grid xs={12} sm={6} md={3} lg={3}>
                    <Box component='div' sx={{margin:1, marginTop:3}}>
                    <span>اصالت کالا</span>
                    <br />
                    <FormControlLabel
                    sx={{marginTop:2}}
                    control={<Switch defaultChecked 
                        checked={!formData.orginal}
                        onChange={() => setFormData({...formData,orginal:!formData.orginal})}
                    sx={{paddingLeft:2,marginBottom:1.5,direction:'ltr'}} />} label="کالا غیر اصل" />                    </Box>
                </Grid>

                <Grid xs={12} sm={6} md={4} lg={4}>

                <FormLabel sx={{margin:1, marginTop:3}}>
                    <span>دسته سطح پنجم</span>
                    <Select
                    value={formData.cat}
                    sx={{ width:'100%'}}
                    size="lg"
                    onChange={(e,v) => setFormData({...formData,cat:v??''})}
                    >
                    <Option value="">انتخاب یک دسته بندی</Option>
                    {
                        cats.map((v:any, i:any) => {
                           return <Option key={i} value={v.uniqueId}>{v.title}</Option>
                        })
                    }
                    </Select>

                </FormLabel>
                </Grid>

                <Grid xs={12} sm={12} md={5} lg={5}>
                <FormLabel sx={{margin:1, marginTop:3}}>
                    <span>برند | تولید کننده</span>
                    <Select
                    sx={{ width:'100%'}}
                    value={formData.brand}
                    size="lg"
                    onChange={(e,v) => {
                       let b = brands.filter(e=> e.uniqueId === v)
                       setBrandTitle(b[0]?b[0].title:'');
                       
                        setFormData({...formData,brand:v??''})
                    }
                    }
                    >
                    <Option value="">متفرقه</Option>
                    {
                        brands.map((v:any, i:any) => {
                           return <Option key={i} value={v.uniqueId}>{v.title}</Option>
                        })
                    }
                    </Select>

                </FormLabel>
                </Grid>

                <Grid xs={12} sm={12} md={4} lg={4}>
                <FormLabel sx={{margin:1, marginTop:3}}>
                    <span>مدل کالا</span>
                    <Input
                        placeholder="H05"
                        fullWidth
                        required
                        size="lg"
                        value={formData.model}
                        onChange={(e) => {
                            let v = e.target.value
                            let t = `${props.mainCat} ${brandTitle} مدل ${v}`
                            setFormData({...formData,model:v,title:t})

                        }}
                    />
                </FormLabel>
                </Grid>

                <Grid xs={12} sm={12} md={5} lg={5}>
                <FormLabel sx={{margin:1, marginTop:3}}>
                    <span> عنوان کالا (پیشنهادی)</span>
                    <Input
                        placeholder="H05"
                        fullWidth
                        required
                        value={formData.title}
                        size="lg"
                        onChange={(e) => setFormData({...formData,title:e.target.value})}
                    />
                </FormLabel>
                </Grid>

                <Grid xs={12} sm={12} md={2} lg={1}>
                <FormLabel sx={{margin:1, marginTop:3}}>
                    <span>نوع کالا</span>
                    <Select
                    value={formData.type}
                    sx={{ minWidth: 200 , width:'100%'}}
                    size="lg"
                    onChange={(e,v) => setFormData({...formData,type:v??''})}
                    >
                    <Option value="F">فیزیکی</Option>
                    <Option value="M">مجازی</Option>
                    </Select>

                </FormLabel>
                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12}>
                <FormLabel sx={{margin:1, marginTop:3}}>
                    <span> ابعاد بسته بندی</span>
    <Dropdown >
      <MenuButton sx={{marginRight:3}} size="sm">{formData.atype}</MenuButton>
      <Menu size="sm">
        <MenuItem
                onClick={() => setFormData({...formData,atype:'میلیمتر'})}
        >
          <ListItemDecorator /> میلیمتر
        </MenuItem>
        <MenuItem
                onClick={() => setFormData({...formData,atype:'سانتیمتر'})}
        >
          <ListItemDecorator /> سانتیمتر
        </MenuItem>
        <MenuItem
                onClick={() => setFormData({...formData,atype:'متر مربع'})}
        >
          <ListItemDecorator /> متر مربع
        </MenuItem>
      </Menu>
    </Dropdown>

                </FormLabel>
                </Grid>

                <Grid xs={6} sm={6} md={2} lg={2}>
                <FormLabel sx={{margin:1, marginTop:3}}>
                    <span>طول</span>
                    <Input
                        fullWidth
                        required
                        type="number"
                        size="lg"
                        value={formData.box.l}
                        onChange={(e) => {
                            setFormData({...formData,box:{...formData.box,l:e.target.value}})
                        }}
                    />
                </FormLabel>
                </Grid>
                <Grid xs={6} sm={6} md={2} lg={2}>
                <FormLabel sx={{margin:1, marginTop:3}}>
                    <span>عرض</span>
                    <Input
                        fullWidth
                        required
                        type="number"
                        size="lg"
                        value={formData.box.v}
                        onChange={(e) => {
                            setFormData({...formData,box:{...formData.box,v:e.target.value}})
                        }}
                    />
                </FormLabel>
                </Grid>
                <Grid xs={6} sm={6} md={2} lg={2}>
                <FormLabel sx={{margin:1, marginTop:3}}>
                    <span>ارتفا</span>
                    <Input
                        fullWidth
                        required
                        type="number"
                        size="lg"
                        value={formData.box.h}
                        onChange={(e) => {
                            setFormData({...formData,box:{...formData.box,h:e.target.value}})
                        }}
                    />
                </FormLabel>
                </Grid>
                <Grid xs={6} sm={6} md={2} lg={2}>
                <FormLabel sx={{margin:1, marginTop:3}}>
                    <span>وزن</span>
                    <Input
                        fullWidth
                        required
                        type="number"
                        size="lg"
                        value={formData.box.w}
                        onChange={(e) => {
                            setFormData({...formData,box:{...formData.box,w:e.target.value}})
                        }}
                    />
                </FormLabel>
                </Grid>
                <Grid xs={6} sm={6} md={2} lg={2}>
                <FormLabel sx={{margin:1, marginTop:7}}>
                    <Select
                    sx={{ width:'100%'}}
                    size="lg"
                    value={formData.wtype}
                    onChange={(e,v) => {
                        setFormData({...formData,wtype:v??''})
                    }}
                    >
                    <Option value="گرم">گرم</Option>
                    <Option value="کیلوگرم">کیلوگرم</Option>
                    <Option value="صوت">صوت</Option>
                    <Option value="مسقال">مسقال</Option>
                    </Select>

                </FormLabel>
                </Grid>

                <Grid xs={12} sm={12} md={122} lg={12}>
                    <br/>
                <span>شرح کالا</span>
                <FormLabel sx={{margin:1, marginTop:3}}>
                   <Textarea
                    sx={{
                        width:'100%'
                    }}
                    minRows={8}
                    size="lg"
                    value={formData.text}
                    onChange={(e) => {
                        setFormData({...formData,text:e.target.value})
                    }}  
                    />
                    <span className="mute text-mute">{formData.text.length}/2000</span>
                </FormLabel>
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={6}>
                <FormLabel sx={{margin:1}}>
                    <span>نقاط ضعف</span>
                    <TagMaker
                        getTags={(e:string)=>setzaf([...zaf,e])}
                        id='zaf'
                        />
                                {
                                    zaf&&
                                    zaf.map((v,i) => {
                                        return (
                                        <Chip id='tag' sx={{margin:1}} key={i}>
                                            <span className="close-tag" 
                                            onClick={() => {
                                               let t = zaf.filter(e=> v !== e)
                                               setzaf(t)
                                            }}
                                            ><GrClose /></span>
                                            
                                            {v}
                                        </Chip>
                                        )
                                    })
                                }
                </FormLabel>
                </Grid> 

                <Grid xs={12} sm={12} md={6} lg={6}>
                <FormLabel sx={{margin:1}}>
                    <span>نقاط قوت</span>
                    <TagMaker
                        getTags={(e:string)=>setghovat([...ghovat,e])}
                        id="ghovat"
                        />
                                {
                                    ghovat&&
                                    ghovat.map((v,i) => {
                                        return (
                                        <Chip id='tag' sx={{margin:1}} key={i}>
                                            <span className="close-tag" 
                                            onClick={() => {
                                               let t = ghovat.filter(e=> v !== e)
                                               setghovat(t)
                                            }}
                                            ><GrClose /></span>
                                            
                                            {v}
                                        </Chip>
                                        )
                                    })
                                }
                </FormLabel>
                </Grid> 
            </Grid>
            <br/>

            </Card>

        </Box>
    )
}