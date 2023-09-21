import Header from "@/Components/header";
import Category from "@/Components/listItem/categury";
import Manufacturer from "@/Components/listItem/manufactur";
import Product from "@/Components/listItem/product";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Alert, Box, Button, Card, Chip, CircularProgress, Divider, FormLabel, Grid, Input, Modal, ModalDialog, Option, Select, Typography } from "@mui/joy";
import { FormControlLabel, Pagination, Switch } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineFileSearch, AiOutlineFontSize, AiOutlineLink } from "react-icons/ai";
import { RiDeleteBin6Line, RiFileWarningFill } from "react-icons/ri";

const serverSetting = {
  appl:false,
  comments: true,
  faq: true,
}
export default function Manufactur() {
    const router = useRouter()

    const [data, setData] = useState<any>(null)
    const [page, setPage] = useState(1)
    const [lang, setLang] = useState<any>()
    const [unique, setUnique] = useState('')
    const {postData, response, status} = useFetch()
    const [open, setOpen] = useState<boolean>(false)
    const [langDelet, setLangDelet] = useState<any>('')
    const [ldopen, setLdopen] = useState<boolean>(false)
    const [langDeletId, setLangDeletId] = useState<any>(0)
    const [settingOpen, setSettingOpen] = useState<any>(false)
    const [depo, setDepo] = useState<boolean>(false)
    const [depoDynamic, setDepoDynamic] = useState<any[]>([])
    const [depoLocation, setDepoLocation] = useState<any[]>([])
    const [sule, setSule] = useState<any[]>([])
    const [depoMain, setDepoMain] = useState<number>(0)
    const [defaultSule, setDefaultSule] = useState<number>(0)
    const [depoSaver, setdepoSaver] = useState<any[]>([])

    const [setting, setSetting] = useState(serverSetting)

    //onmund
    useEffect(() => {
        if (!lang) {
            setLang(localStorage.getItem('_lang_'))
        }
        const header = {
            'lang': localStorage.getItem('_lang_')
          }
        postData(`product/select/1/?page=${page}`,null,header)
    }, [router])

    useEffect(() => {
         console.log('r ',response);
         if (response?.total) {

            setData(response)
          }

          if (!response?.data?.length) {
            document?.body.classList.remove('loading')
          }
    
          if (response?.status) {
            router.push(`?page=${page}`)
            setOpen(false)
            setLdopen(false)
            const header = {
                'lang': localStorage.getItem('_lang_')
              }
            postData(`product/select/?page=${page}`,null,header)
          }
          if (response?.msg === 'dynamic_set') {
            setDepoDynamic(response.data)
              setDepo(true)
              setDepoLocation(response.depos)
              setDepoMain(response.depos[0].id)
              console.log(response.depos[0].id);
              const d = response.depos.filter((e: { did: any; })=> e.did === response.depos[0].id)
              setSule(d)
              setDefaultSule(d[0].id)
          }
    }, [response])

    //onLoad data
    useEffect(() => {
        document.body.classList.remove('loading')
    }, [data])
    

    //actions

    const handleDeleteProduct = () => {
        if (unique) {
            document.body.classList.add('loading')
            postData('product/delete',{unique:unique})
          }
    }
    const deleteItem = (id:string) => {

    }

    const onChangeLangHadle = async (e:any) => {
        setLang(e)
    }

    const onClickDeleteHandel = (e:any) => {
            setUnique(e)
            setOpen(true)
        
    }

    const delLang = (id:any) => {
      setLangDeletId(id)
      setLdopen(true)
    }

    //paginate
    const handleChange = (e:any, v:any) => {
        setPage(v)
         router.push('?page='+v)
    }

    const handleDeleteLang = () => {
      if (langDeletId) {
        document.body.classList.add('loading')
        postData('product/delete_lang',{id:langDeletId})
      }
    }

    const handleSettingSubmit = () => {      
      postData('product/set_settings',{unique:unique,settings:setting},null)
      setUnique('')
      setSettingOpen(false)
    }

    const handleCloseDetting = () => {
      setUnique('')
      setSettingOpen(false)
      setSetting(serverSetting)
    }

    const handleOpenSetting = (u:any) => {
      setUnique(u)
      let d = data.data.filter((e: { uniqueId: any; }) => e.uniqueId === u)
      d = d[0]
      setSetting(JSON.parse(d.settings))
      setSettingOpen(true)
      console.log(JSON.parse(d.settings));
    }

    const depoClickHandle = (uniq:any, l:any) => {
      console.log(uniq, l[0].lang);
      const header = {
        "lang" : l[0].lang
        }

      postData('product/get_dynamic',{unique:uniq},header)
    }

    const depoMainChangeHandle = async (v:any) => {
            setDepoMain(v)
            console.log('depomain',v);
            
            const d = await depoLocation.filter((e: { did: any; })=> e.did === v)
            setSule(d);
            setDefaultSule(d[0].id)
            console.log('allsule' ,d);
            console.log('sule', d[0].id);
    }

    const saveHandleDepo = async (id:any, v:any) => {
      const sul = await depoLocation.filter((e: { did: any })=> e.did === v)
      setSule(sul);
      const ds = depoSaver.filter(e=> e.id === id)
      if (!ds || !ds?.length){
        setdepoSaver([...depoSaver,{id:id, quty:0, depo:v, sule:sul[0].id}])        
      }else{
        let d:any = ds[0]
        d = {...d,depo:v, sule:sul[0].id}
        const dl = depoSaver.filter(e=> e.id !== id)
        console.log(sul);
        
        console.log(v);
        
        setdepoSaver([...dl,d])
      }
      setDefaultSule(sul[0].id)

      //console.log(depoSaver);
      
    }

    const saveHandleSule = (id:any, s:any) => {
      const ds = depoSaver.filter(e=> e.id === id)
      if (!ds || !ds?.length){
        setdepoSaver([...depoSaver,{id:id, quty:0, depo:depoMain, sule:s}])
      }else{
        let d:any = ds[0]
        d = {...d,sule:s}
        const dl = depoSaver.filter(e=> e.id !== id)
        console.log(dl);
        setdepoSaver([...dl,d])
      }
    }

    const saveHandleQuty = (id:any, q:any) => {
      const ds = depoSaver.filter(e=> e.id === id)
      if (!ds || !ds?.length){
        setdepoSaver([...depoSaver,{id:id, quty:Number(q), depo:depoMain, sule:defaultSule}])
      }else{
        let d:any = ds[0]
        d = {...d,quty:q}
        const dl = depoSaver.filter(e=> e.id !== id)
        console.log(d);
        setdepoSaver([...dl,d])
      }
    }

    return(
        <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'65%',float:'right'}}> لیست کالا ها</h1>
            <div style={{marginTop:'25px',marginBottom:'25px',maxWidth:'40%',float:'left'}}>
                <Button onClick={() => router.push('/bussiness/products/trash')} className="danger">ذباله دان</Button>
                <Button onClick={() => router.push('/bussiness/products/insert/'+lang)} className="primary">ایجاد کالا</Button>
            </div>
            <div style={{clear:'both'}}></div>

            {
                    !data?
                    <p style={{textAlign:'center'}}>داده ای وجود ندارد</p>
                    :
                    data?.data.map((item:any) => {
                  return (
            <>
                <Product 
                  title={item.title}
                  id={item.id}
                  uniqueId={item.uniqueId}
                  edithandle={(e:any) => router.push('/bussiness/products/'+item.uniqueId+'/'+item.lang)}
                  deletehandle={(e:any) => onClickDeleteHandel(e)}
                  delIcon={<RiDeleteBin6Line />}
                  delTool='حذف'
                  langDelete={(l:string) => {
                    setLangDelet(l)
                    delLang(item.id)
                  }}
                  depoClick={(e:any, l:any) => {
                    depoClickHandle(e, l)
                  }}
                  lang={item.lang}
                  clicked={(u:any) => handleOpenSetting(u)}
                />
                <Divider sx={{margin:'7px'}}/>
            </>
              )
            })
        }
    {data&&<Card className='card'>
    <Pagination 
      count={data?Math.ceil(data.total/data.per_page):0} 
      size="large"
      page={page} 
      onChange={(e,v) => handleChange(e,v)}
      />
    </Card>}
            </Container>

    

    <Modal open={open}
     onClose={() => {
      setUnique('')
      setOpen(false);
    }}
    >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="alert-dialog-modal-title"
          aria-describedby="alert-dialog-modal-description"
        >
          <Typography
            id="alert-dialog-modal-title"
            level="h2"
            startDecorator={<RiFileWarningFill />}
          >
             ({`ID: ${unique}`})  حذف  کالا
          </Typography>
          
          <Typography component='h3' id="alert-dialog-modal-description" textColor="text.tertiary">
            جهت ادامه روند حذف روی دکمه تایید کلیک نمایید
          </Typography>
          <Typography className="text-danger" id="alert-dialog-modal-description" textColor="text.tertiary">
            با حذف  کالا امکان غیر فعال شدن تمامی محتوا وابسته به این مورد وجود دارد.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button variant="solid" color="danger" onClick={() => handleDeleteProduct()}>
              تایید 
            </Button>
          </Box>
        </ModalDialog>
   </Modal>


   <Modal open={ldopen}
     onClose={() => {
      setUnique('')
      setLdopen(false);
    }}
    >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="alert-dialog-modal-title"
          aria-describedby="alert-dialog-modal-description"
        >
          <Typography
            id="alert-dialog-modal-title"
            level="h2"
            startDecorator={<RiFileWarningFill />}
          >
             ({langDelet})  حذف  محتوا
          </Typography>
          
          <Typography component='h3' id="alert-dialog-modal-description" textColor="text.tertiary">
            <b> شما در حال حذف یک محتوا با برچسب 
                 ({langDelet})  
                هستید،
            </b>
            جهت ادامه روند حذف روی دکمه تایید کلیک نمایید
          
          </Typography>
          <Typography className="text-danger" id="alert-dialog-modal-description" textColor="text.tertiary">
            حذف کالا با زبان مد نظر باعث میشود کالا در این زبان به صورت کامل حذف گردد و دیگر قادر به بازیابی ان نیستید!
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button variant="solid" color="danger" onClick={() => handleDeleteLang()}>
              تایید 
            </Button>
          </Box>
        </ModalDialog>
   </Modal>


   <Modal open={settingOpen}
     onClose={() => handleCloseDetting()}
    >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="alert-dialog-modal-title"
          aria-describedby="alert-dialog-modal-description"
          className='modal-omid'
        >
          <Typography
            id="alert-dialog-modal-title"
            level="h2"
            startDecorator={<RiFileWarningFill />}
          >
             تنظیمات پیشرفته
          </Typography>
          <Grid container >

                <Grid xs={12}>
                    <Box component='div'>
                    <br />
                    <FormControlLabel
                    sx={{marginTop:2}}
                    control={<Switch defaultChecked 
                        checked={setting.appl}
                        onChange={() => setSetting({...setting,appl:!setting.appl})}
                    sx={{direction:'ltr'}} />} label="نمایش فقط اپ موبایل" />                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Box component='div'>
                    <br />
                    <FormControlLabel
                    sx={{marginTop:2}}
                    control={<Switch defaultChecked 
                        checked={setting.comments}
                        onChange={() => {
                          setSetting({...setting,comments:!setting.comments})}
                        }
                    sx={{direction:'ltr'}} />} label="نمایش کامنت ها" />                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Box component='div'>
                    <br />
                    <FormControlLabel
                    sx={{marginTop:2}}
                    control={<Switch defaultChecked 
                        checked={setting.faq}
                        onChange={() => setSetting({...setting,faq:!setting.faq})}
                    sx={{direction:'ltr'}} />} label="نمایش پرسش و پاسخ" />                    </Box>
                </Grid>
          </Grid>
          
          
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => handleCloseDetting()}>
              انصراف
            </Button>
            <Button variant="solid" color="danger" onClick={() => handleSettingSubmit()}>
              تایید 
            </Button>
          </Box>
        </ModalDialog>
   </Modal>

   <Modal open={depo}
     onClose={() => setDepo(false)}
    >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="alert-dialog-modal-title"
          aria-describedby="alert-dialog-modal-description"
          sx={{width:'95%',maxWidth:'600px',maxHeight:'400px',overflow:'auto'}}
          className="modal-omid"
        >

          <Typography
            id="alert-dialog-modal-title"
            level="h2"
            startDecorator={<RiFileWarningFill />}
            sx={{float:'right',width:'70%'}}
          >
          موجودی جدید

          </Typography>
          <Divider />
          <Alert sx={{opacity:.5}} variant="soft" color="primary">
            <p>موجودی جدید به موجودی قبلی افزوده میشود.</p>
            <p>موجودی جدید در انبار انتخابی قرار دارد</p>
            
          </Alert>
          <br/>
          {
            depoDynamic.map(item => {
              const arry = depoSaver.filter(e=> e.id === item.id)
              return (
                <Grid key={item.id} container spacing={1.5}>
                  <Grid xs={12}>{item.type} {item.value}</Grid>
                                  <Grid xs={5}>
                                      <FormLabel>
                                          <span>انبار<small className="text-danger pr-1">*</small></span> 
                                      <Select
                                          size={'lg'}
                                          value={arry.length?arry[0].depo:depoMain}
                                          sx={{width:'100%'}}
                                          onChange={(e, v:any) => {
                                            saveHandleDepo(item.id, v)
                                          }}  
                                      >
                                        {depoLocation.map(d => {
                                          if (d.did) {
                                            return false
                                          }
                                          return(
                                            <Option key={d.id} value={d.id}>{d.title} انبار {d.depo}</Option>

                                          )
                                        })}
                                      </Select>
                                      </FormLabel>
                                  </Grid>

                                  <Grid xs={3}>
                                      <FormLabel>
                                          <span>سوله</span> 
                                          <Select
                                          size={'lg'}
                                          value={arry.length?arry[0].sule:defaultSule}
                                          sx={{width:'100%'}}
                                          onChange={(e, v:any) => {
                                            saveHandleSule(item.id, v)
                                          }}
                                      >
                                        {sule.map(s => {
                                          return(
                                            <Option key={s.id} value={s.id}>ر {s.row} ق{s.Shelf}</Option>
                                          )
                                        })}
                                      </Select>
                                      </FormLabel>
                                  </Grid>

                                  <Grid xs={3}>
                                      <FormLabel>
                                          <span>تعداد ({JSON.parse(item.depo).vahed})</span> 
                                      <Input
                                          size={'lg'}
                                          fullWidth
                                          value={arry.length && arry[0]?.quty?arry[0].quty:''}
                                          type="number"
                                          onChange={(e) => {
                                            saveHandleQuty(item.id, e.target.value)
                                          }}
                                      />
                                      </FormLabel>
                                  </Grid>
                                  <Grid xs={1}>
                                      <FormLabel>
                                        <Button
                                        sx={{marginTop:4.3}}
                                        >+</Button>
                                      </FormLabel>
                                  </Grid>
                                  <Grid xs={12}><Divider/><br/></Grid>

                </Grid>

              )
            })
          }

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="plain" color="neutral">
              بستن
            </Button>

          </Box>
        </ModalDialog>
   </Modal>
        </main>    
    )
}

