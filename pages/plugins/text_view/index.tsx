import Header from "@/Components/header";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Avatar, Box, Button, Card, Chip, ChipDelete, Divider, FormLabel, Grid, Input, List, ListDivider, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Modal, ModalDialog, Option, Select, SelectOption, Sheet, Skeleton, Switch, Table, Tooltip, Typography } from "@mui/joy";
import { CircularProgress, Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line, RiPencilLine, RiArrowLeftSLine, RiFileWarningFill } from "react-icons/ri";
import { AiOutlineLink, AiOutlineFontSize, AiOutlineFileSearch, AiOutlineFieldTime } from "react-icons/ai"
import Lang from "@/Components/lang";
import Category from "@/Components/listItem/categury";
import ArticleCat from "@/Components/listItem/articleCat";
import { getArticleCatParent } from "@/Libs/getParent";
import Slider from "@/Components/listItem/slider";
import TextViewList from "@/Components/listItem/textView";

export default function TextView() {
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState<any>({data:[],total:0,per_page:10,current_page:1})
    const [page, setPage] = useState(1)
    const [deletId, setDeleteId] = useState(0);
    
    const {postData, response} = useFetch()

    const [newModal, setNewModal] = useState<boolean>(false)
    const [selectLang, setSelectLang] = useState<boolean>(true)
    const [formData, setFormData] = useState<any>({})
    const [lang, setLang] = useState<any>()
    const [file, setFile] = useState<File>()
    const [unique, setUnique] = useState<any>('')
    const [id, setId] = useState<any>(0)
    const [langDelet, setLangDelet] = useState<any>('')
    const [ldopen, setLdopen] = useState<boolean>(false)
    const [langDeletId, setLangDeletId] = useState<any>(0)
    useEffect(() => {
      setData({data:[],total:0,per_page:10,current_page:1})
      if (router.query.unique) {
        var u = router.query.unique
        setId(u)
      }
      if (!lang) {
        setLang(localStorage.getItem('_lang_'))
      }
        postData(`plugins/text_view/select`,{page: page})
    }, [router])



    useEffect(() => {
      if (!lang) {
        setLang(localStorage.getItem('_lang_') || '')
      }
    }, [page])
  
    useEffect(() => {
      console.log(response);
      if (response?.status) {
            if (response?.msg === 'cat_inserted') {
                setNewModal(false)
                setFormData({})
                router.push(`/article/category/${id}/?page=1`)
            }else if (response?.slug) {
                setFormData(response)
            }else if (response?.msg === 'cat_updated') {
                router.push(`/article/category/${id}/?page=1`)

            }else if (response?.msg === 'cat_deleted') {
                setUnique('')
                setOpen(false)
                setLdopen(false)
                router.push(`/article/category/${id}/?page=${page}`)

            }

      }else if (response?.total) {
        setData(response)
      }else if (response?.data?.length === 0) { 
          setData({data:[],total:0,per_page:10,current_page:1})
      }
     
      document.body.classList.remove('loading')
    }, [response])


    useEffect(() => {

    }, [lang])

  
    
    
    
    //action
    
    const handleChange = (e:any, v:any) => {
        setPage(v)      
    }

    const onClickNewCatHandel = () => {
        setNewModal(true)
        setSelectLang(true)
        setFormData({}) 

    }

    const handleNewCatSubmit = async () => {
      document.body.classList.add('loading')

      let header = {
        'Content-Type': 'multipart/form-data',
        'lang': lang
      }
      
      

      if (unique) {
        await postData('article/cat/update',{...formData,unique:unique}, header)
      }else {
        await postData('plugins/slider/insert',formData, header)
      }
      
    }

  
    const handleDeleteCat = () => {
      if (unique) {
        document.body.classList.add('loading')
        postData('article/cat/delete',{unique:unique})
      }
    }

    const onClickEditCatHandel = async (id:any) => {
        document.body.classList.add('loading')

      router.push(`/plugins/text_view/${id}/${lang}`)
    }

    const onClickDeleteCatHandel = (id:string) => {
        setUnique(id)
        setOpen(true)
    }


    const handleCloseEditModal = () => {
      setNewModal(false);
      setId(0)
      setUnique('')
      setFormData({})
      setLang(localStorage.getItem('_lang_') || '')
      setFile(undefined)

    }
    
    const onChangeLangHadle = async (e:any) => {
      setFormData({title:'',canonical:'',meta_key:'',meta_description:''})
      setLang(e)
      let header = {
        'lang': e
      }
      await postData(`article/cat/select`,{unique:unique},header)
    }

    const delLang = (id:any) => {
      setLangDeletId(id)
      setLdopen(true)
    }

    const handleDeleteLang = () => {
      if (langDeletId) {
        document.body.classList.add('loading')
        postData('article/cat/delete_lang',{id:langDeletId})
      }
    }

    return (
        <main>
            <Menu />
            <Container>
                <Header />
                <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'65%',float:'right'}}>
                  نمایش متن
                {
                  id !== '0'?
                <small
                onClick={() => router.back()
                }
                 className="mute text-small small link">{getArticleCatParent(id, lang)}</small> :''} 
                </h1>
                <div style={{marginTop:'25px',marginBottom:'25px',maxWidth:'40%',float:'left'}}>
                    <Button onClick={() => router.push('/article/category/trash')} className="danger">ذباله دان</Button>
                    <Button onClick={() => router.push('/plugins/text_view/insert/'+lang)} className="primary">ایجاد ابزارک</Button>
                </div>
                <div style={{clear:'both'}}></div>

                {
          !data?
                <CircularProgress sx={{textAlign:'center',margin:'48%',marginTop:'40px'}} disableShrink />
            :
            data?.data.map((item:any) => {
              return (
            <>
                <TextViewList 
                  title={item.title}
                  id={item.id}
                  uniqueId={item.uniqueId}
                  edithandle={(e:any) => onClickEditCatHandel(e)}
                  deletehandle={(e:any) => onClickDeleteCatHandel(e)}
                  delIcon={<RiDeleteBin6Line />}
                  delTool='حذف'
                  langDelete={(l:string) => {
                    setLangDelet(l)
                    delLang(item.id)
                  }}
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
    

    <Modal open={open}
     onClose={() => {
      setDeleteId(0)
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
             ({`ID: ${unique}`}) حذف دسته
          </Typography>
          
          <Typography component='h3' id="alert-dialog-modal-description" textColor="text.tertiary">
            جهت ادامه روند حذف روی دکمه تایید کلیک نمایید
          </Typography>
          <Typography className="text-danger" id="alert-dialog-modal-description" textColor="text.tertiary">
            با حذف دسته، امکان غیر فعال شدن تمامی زیر دسته های مرتبط و همچنان تمام محتوا وابسته به این مورد وجود دارد.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button variant="solid" color="danger" onClick={() => handleDeleteCat()}>
              تایید 
            </Button>
          </Box>
        </ModalDialog>
   </Modal>

   <Modal open={newModal}
     onClose={() => handleCloseEditModal()}
    >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="alert-dialog-modal-title"
          aria-describedby="alert-dialog-modal-description"
          sx={{width:'95%',maxWidth:'600px'}}
          className="modal-omid"
        >
        <Lang style={{
                    float:'left',
                    width:'30%',
                    position:'absolute',
                    left:7,
                    top:7
                }}
                disable={selectLang}
                onChange={(e:any) => onChangeLangHadle(e)}
                dv={lang}
        />
          <Typography
            id="alert-dialog-modal-title"
            level="h2"
            startDecorator={<RiFileWarningFill />}
            sx={{float:'right',width:'70%'}}
          >
          ایجاد اسلایدر

          </Typography>
          <Divider />
          <Grid container spacing={1.5}>
                            <Grid lg={6} sm={12}>
                                <FormLabel>
                                    <span>عنوان<small className="text-danger pr-1">*</small></span> 
                                <Input
                                    size={'lg'}
                                    startDecorator={<AiOutlineFontSize />}
                                    fullWidth
                                    required
                                    value={formData?.title}
                                    onChange={(e) => setFormData({...formData,title:e.target.value})}
                                    id="fname"
                                />
                               {response?.errors?.title&&<span className="err">{response?.errors?.title}</span>}
                                </FormLabel>
                            </Grid>

                            <Grid lg={6} sm={12}>
                                <FormLabel>
                                    <span>وقفه زمانی(ms)</span> 
                                <Input
                                    size={'lg'}
                                    startDecorator={<AiOutlineFieldTime/>}
                                    fullWidth
                                    type="number"
                                    value={formData?.delay}
                                    onChange={(e) => setFormData({...formData,delay:e.target.value})}
                                />
                                {response?.errors?.delay&&<span className="err">{response?.errors?.delay}</span>}
                                </FormLabel>
                            </Grid>
                        </Grid>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setNewModal(false)}>
              انصراف
            </Button>
            <Button variant="solid" color="danger" onClick={() => handleNewCatSubmit()}>
              ثبت اطلاعات 
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
            زبان حذف شده دیگر قادر به بازیابی نیست.
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
            </Container>
        </main>
    )
}
