import Header from "@/Components/header";
import ServiceList from "@/Components/listItem/service";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Box, Button, Card, Divider, Modal, ModalDialog, Typography } from "@mui/joy";
import { Pagination } from "@mui/material";
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
        postData(`service/select/?page=${page}`,null,header)
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
            postData(`service/select/?page=${page}`,null,header)
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
            postData('service/delete',{unique:unique})
          }
    }
    // const deleteItem = (id:string) => {

    // }

    // const onChangeLangHadle = async (e:any) => {
    //     setLang(e)
    // }

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
        postData('service/delete_lang',{id:langDeletId})
      }
    }

    return(
        <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'65%',float:'right'}}> لیست خدمات</h1>
            <div style={{marginTop:'25px',marginBottom:'25px',maxWidth:'40%',float:'left'}}>
                <Button onClick={() => router.push('/bussiness/services/trash')} className="danger">ذباله دان</Button>
                <Button onClick={() => router.push('/bussiness/services/insert/'+lang)} className="primary">ایجاد کالا</Button>
            </div>
            <div style={{clear:'both'}}></div>

            {
                    !data?
                    <p style={{textAlign:'center'}}>داده ای وجود ندارد</p>
                    :
                    data?.data.map((item:any) => {
                  return (
            <>
                <ServiceList 
                  title={item.title}
                  id={item.id}
                  uniqueId={item.uniqueId}
                  edithandle={(e:any) => router.push('/bussiness/services/'+item.uniqueId+'/'+item.lang)}
                  deletehandle={(e:any) => onClickDeleteHandel(e)}
                  delIcon={<RiDeleteBin6Line />}
                  delTool='حذف'
                  langDelete={(l:string) => {
                    setLangDelet(l)
                    delLang(item.id)
                  }}
                  lang={item.lang}
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
             ({`ID: ${unique}`})  حذف خدمات
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
            حذف محتوا با زبان مد نظر باعث میشود این سرویس در این زبان به صورت کامل حذف گردد و دیگر قادر به بازیابی ان نیستید!
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



        </main>    
    )
}

