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


export default function Categories() {
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

    useEffect(() => {
      if (!lang) {
        setLang(localStorage.getItem('_lang_') || '')
      }

      if (router.query.page) {
        setPage(Number(router.query.page))
      }
        postData(`product_cat/select/-1?page=${page}`,null)
    }, [])



    useEffect(() => {
      
      if (!lang) {
        setLang(localStorage.getItem('_lang_') || '')
      }
        postData(`product_cat/select/-1?page=${page}`,null)
    }, [page])
  
    useEffect(() => {
      if (response?.total) {
        console.log(response);

        setData(response)
      }

      if (response?.status) {
        router.push(`?page=${page}`)
        setOpen(false)
        //setNewModal(false)
      }

      if (response?.title && !selectLang && unique) {
        
        setFormData(response)
      }
      if (!response) {
        
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
      }
      document.body.classList.remove('loading')

    }, [response])

  
    const handleChange = (e:any, v:any) => {
     setPage(v)
      
      router.push('?page='+v)
      
    }



    //new
  
    const handleDeleteCat = () => {
      if (unique) {
        postData('product_cat/delete',{unique:unique})
      }
    }

    const onClickDeleteCatHandel = (id:string) => {
        setUnique(id)
        setOpen(true)
    }

    return (
        <main>
            <Menu />
            <Container>
                <Header />
                <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'65%',float:'right'}}>دسته بندی کالا و خدمات</h1>
                <div style={{marginTop:'25px',marginBottom:'25px',maxWidth:'40%',float:'left'}}>
                    <Button onClick={() => router.push('/bussiness/categories/0')} className="danger">بازگشت به دسته</Button>
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
            </Container>
        </main>
    )
}
