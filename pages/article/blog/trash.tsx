import Header from "@/Components/header";
import Category from "@/Components/listItem/categury";
import Manufacturer from "@/Components/listItem/manufactur";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Box, Button, Card, CircularProgress, Divider, Modal, ModalDialog, Typography } from "@mui/joy";
import { Pagination } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiFileWarningFill } from "react-icons/ri";
import { GrPowerReset } from "react-icons/gr";
import Blog from "@/Components/listItem/blog";

export default function Trash() {
    const router = useRouter()

    const [data, setData] = useState<any>(null)
    const [page, setPage] = useState(1)
    const [lang, setLang] = useState<any>()
    const [unique, setUnique] = useState('')
    const {postData, response, status} = useFetch()
    const [open, setOpen] = useState<boolean>(false)


    //onmund
    useEffect(() => {
      setData(null)
        if (!lang) {
            setLang(localStorage.getItem('_lang_'))
        }
        const header = {
            'lang': localStorage.getItem('_lang_')
          }
        postData(`article/blog/trash/?page=${page}`,null,header)
    }, [router])

    useEffect(() => {
         console.log(response);
         if (response?.total) {

            setData(response)
          }
    
          if (response?.status) {
            router.push(`?page=${page}`)
            setOpen(false)
            const header = {
                'lang': localStorage.getItem('_lang_')
              }
            postData(`article/blog/trash/?page=${page}`,null,header)
          }
          document.body.classList.remove('loading')
    }, [response])

    //onLoad data
    useEffect(() => {
        document.body.classList.remove('loading')
    }, [data])
    
    //actions

    const handleDeleteCat = () => {
        if (unique) {
            document.body.classList.add('loading')
            postData('article/blog/delete',{unique:unique})
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

    //paginate
    const handleChange = (e:any, v:any) => {
        setPage(v)
         router.push('?page='+v)
    }

    return (
        <main>
            <Menu />
            <Container>
                <Header />
                <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'65%',float:'right'}}>ذباله دان مقاله</h1>
                <div style={{marginTop:'25px',marginBottom:'25px',maxWidth:'40%',float:'left'}}>
                    <Button onClick={() => router.push('/article/blog')} className="primary"> بازگشت لیست مقالات</Button>
                </div>
                <div style={{clear:'both'}}></div>
        {
                    !data?
                    <p>data loading</p>
                    :
                    data?.data.map((item:any) => {
                  return (
            <>
                <Blog 
                  title={item.title}
                  id={item.id}
                  uniqueId={item.uniqueId}
                  edithandle={false}
                  deletehandle={(e:any) => onClickDeleteHandel(e)}
                  delIcon={<GrPowerReset />}
                  delTool='بازیابی'
                />
                <Divider sx={{margin:'7px'}}/>
            </>
              )
            })
        }
            </Container>

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
             ({`ID: ${unique}`}) بازیابی اطلاعات
          </Typography>
          
          <Typography component='h3' id="alert-dialog-modal-description" textColor="text.tertiary">
            جهت ادامه روند بازیابی روی دکمه تایید کلیک نمایید
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
        </main>    
    )
}

