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
import { AiOutlineLink, AiOutlineFontSize, AiOutlineFileSearch } from "react-icons/ai"
import Lang from "@/Components/lang";
import Category from "@/Components/listItem/categury";

export default function Trash() {
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const {postData, response, status} = useFetch()
    const [data, setData] = useState({data:[],total:0,per_page:10,current_page:1})
    const [page, setPage] = useState(1)
    const [deletId, setDeleteId] = useState(0);


    const [newModal, setNewModal] = useState<boolean>(false)
    const [selectLang, setSelectLang] = useState<boolean>(true)
    const [formData, setFormData] = useState<any>({})
    const [lang, setLang] = useState('')
    const [file, setFile] = useState<File>()
    const [unique, setUnique] = useState('')
    const [id, setId] = useState(0)
    const [pid, setPid] = useState<any>(0)
    
    useEffect(() => {
      if (router.query.pid) {
        var p = router.query.pid
        setPid(p)
      }
      if (!lang) {
        setLang(localStorage.getItem('_lang_') || '')
      }

      if (router.query.page) {
        setPage(Number(router.query.page))
      }
        postData(`product_cat/select/${router.query.pid}?page=${page}`,{status:1})
    }, [router])



    useEffect(() => {
      if (!lang) {
        setLang(localStorage.getItem('_lang_') || '')
      }
    }, [page])
  
    useEffect(() => {
      console.log(response);
      
      if (response?.data?.length === 0) { 
        setData({data:[],total:0,per_page:10,current_page:1})
      }
      if (response?.total) {

        setData(response)
      }

      if (response?.status) {
        router.push(`${pid}?page=${page}`)
        setOpen(false)
        postData(`product_cat/select/${pid}`,{status:1})
      }

      if (response?.title && !selectLang && unique) {
        
        setFormData(response)
      }
      if (response?.status && selectLang) {
        setNewModal(false)
        setFormData({
          title: '',
          lang: '',
          slug: '',
          file: '',
          cid: '',
          meta_description:'',
          meta_key:'',
          canonical:''
        })
        setId(0)
        setUnique('')
      }

      document.body.classList.remove('loading')

    }, [response])


    useEffect(() => {
      setFormData({
        title: '',
        lang: '',
        slug: '',
        file: '',
        cid: '',
        meta_description:'',
        meta_key:'',
        canonical:''
      })

      

    }, [lang])

  
    const handleChange = (e:any, v:any) => {
     setPage(v)
      
      router.push(pid+'?page='+v)
      
    }



    //new


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
      
      const data = {...formData,file:file,cid:pid}

      if (unique) {
        await postData('product_cat/update',{...data,unique:unique}, header)
      }else {
        await postData('product_cat/insert',data, header)
      }
      
    }

  
    const handleDeleteCat = () => {
      if (unique) {
        document.body.classList.add('loading')
        postData('product_cat/delete',{unique:unique})
      }
    }

    const onClickEditCatHandel = async (id:any) => {
      let header = {
        'lang': lang
      }
      await postData(`product_cat/select`,{unique:id},header)

        setUnique(id)
        setNewModal(true)
        setSelectLang(false)
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
      setLang(e)
      let header = {
        'lang': e
      }
       postData(`product_cat/select`,{unique:unique},header)
    }

    return (
        <main>
            <Menu />
            <Container>
                <Header />
                <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'65%',float:'right'}}>
                  دسته بندی کالا و خدمات
                {
                  pid !== '0'?
                <small
                onClick={() => router.back()
                }
                 className="mute text-small small link"> کالا دیجیتال</small> :''} 
                </h1>
                <div style={{marginTop:'25px',marginBottom:'25px',maxWidth:'40%',float:'left'}}>
                    <Button onClick={() => router.push('/bussiness/categories/trash')} className="danger">ذباله دان</Button>
                    <Button onClick={() => onClickNewCatHandel()} className="primary">ایجاد دسته</Button>
                </div>
                <div style={{clear:'both'}}></div>

                {
          !data?
                <CircularProgress sx={{textAlign:'center',margin:'48%',marginTop:'40px'}} disableShrink />
            :
            data?.data.map((item:any) => {
              return (
            <>
                <Category 
                  title={item.title}
                  id={item.id}
                  uniqueId={item.uniqueId}
                  edithandle={(e:any) => onClickEditCatHandel(e)}
                  deletehandle={(e:any) => onClickDeleteCatHandel(e)}
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
          ایجاد دسته بندی جدید

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
                               {response?.errors?.slug&&<span className="err">{response?.errors?.slug}</span>}
                                </FormLabel>
                            </Grid>

                            <Grid lg={6} sm={12}>
                                <FormLabel>
                                    <span>کنونیکال</span> 
                                <Input
                                    size={'lg'}
                                    startDecorator={<AiOutlineLink/>}
                                    fullWidth
                                    value={formData?.canonical}
                                    onChange={(e) => setFormData({...formData,canonical:e.target.value})}
                                />
                                {response?.errors?.fname&&<span className="err">{response?.errors?.fname}</span>}
                                </FormLabel>
                            </Grid>

                            <Grid lg={6} sm={12}>
                                <FormLabel>
                                    <span>کلمات کلیدی</span> 
                                <Input
                                    size={'lg'}
                                    endDecorator={
                                        <Chip sx={{paddingTop:'8px'}} size="sm" color="danger" variant="soft">
                                        +5
                                        </Chip>
                                    }
                                    fullWidth
                                    value={formData?.meta_key}
                                    onChange={(e) => setFormData({...formData,meta_key:e.target.value})}
                                />
                                {response?.errors?.fname&&<span className="err">{response?.errors?.fname}</span>}
                                </FormLabel>
                            </Grid>
                            <Grid lg={6} sm={12}>
                                <FormLabel className="upload">
                                    <span> تصویر دسته</span> 
                                <Input
                                    size={'lg'}
                                    startDecorator={'کلیک کنید'}
                                    endDecorator={
                                        <img src={file?URL?.createObjectURL(file):'/no-image.png'} height={30} style={{float:'left'}}/>
                                    } 
                                    fullWidth
                                    value={''}
                                    id="fname"
                                    type="file"
                                    onChange={(e) => {
                                      if (e.target.files) {
                                        console.log(e.target.files[0]);
                                        
                                          setFile(e.target.files[0]);
                                        }
                                  }}
                                />
                               {response?.errors?.file&&<span className="err">{response?.errors?.file}</span>}
                                </FormLabel>
                            </Grid>

                            <Grid sm={12}>
                                <FormLabel>
                                    <span>توضیحات متا</span> 
                                <Input
                                    size={'lg'}
                                    startDecorator={<AiOutlineFileSearch />}
                                    fullWidth
                                    value={formData?.meta_description}
                                    onChange={(e) => setFormData({...formData,meta_description:e.target.value})}
                                />
                                {response?.errors?.fname&&<span className="err">{response?.errors?.fname}</span>}
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
            </Container>
        </main>
    )
}
