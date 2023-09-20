import Header from "@/Components/header";
import Category from "@/Components/listItem/categury";
import Manufacturer from "@/Components/listItem/manufactur";
import Product from "@/Components/listItem/product";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Box, Button, Card, CircularProgress, Divider, Grid, Modal, ModalDialog, Typography } from "@mui/joy";
import { FormControlLabel, Pagination, Switch } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line, RiFileWarningFill } from "react-icons/ri";

const serverSetting = {
  appl:false,
  comments: true,
  faq: true,
}
export default function Services() {
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
        </main>    
    )
}

