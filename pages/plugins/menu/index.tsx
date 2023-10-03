import Header from "@/Components/header";
import Lang from "@/Components/lang";
import AttrGp from "@/Components/listItem/attrGp";
import Category from "@/Components/listItem/categury";
import MenuLists from "@/Components/listItem/menuLists";
import Menu from "@/Components/menu";
import ThemplateContext from "@/Context/ThemplateContext";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Box, Button, Chip, CircularProgress, Divider, FormLabel, Grid, Input, Modal, ModalDialog, Option, Select, Typography, getCardUtilityClass } from "@mui/joy";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AiOutlineFileSearch, AiOutlineFontSize, AiOutlineLink } from "react-icons/ai";
import { RiDeleteBin6Line, RiFileWarningFill } from "react-icons/ri";

export default function MainMenu() {
    const router = useRouter()
    const template = useContext(ThemplateContext)

    const [open, setOpen] = useState<boolean>(false)
    const [ldopen, setLdopen] = useState<boolean>(false)
    const [langDelet, setLangDelet] = useState<any>('')
    const [langDeletId, setLangDeletId] = useState<any>(0)
    const [data, setData] = useState({data:[],total:0,per_page:10,current_page:1})
    const [page, setPage] = useState(1)
    const [lang, setLang] = useState<any>()
    const [newModal, setNewModal] = useState<boolean>(false)
    const [formData, setFormData] = useState<any>({})
    const [unique, setUnique] = useState('')
    const [selectLang, setSelectLang] = useState<boolean>(true)

    
    const {postData, response, status} = useFetch()

    useEffect(() => {
      if (!lang) {
        setLang(localStorage.getItem('_lang_'))
      }
      postData(`plugins/menu/select`,{unique:unique})

    }, [router])

    useEffect(() => {
      console.log('response: ', response);
      
      if (response?.total) {
        //load datas
        setData(response)
      }
      else if(response?.status && response?.msg === 'menu_inserted'){
        if (selectLang) {
          //insert success
          handleCloseEditModal()
          router.push('/plugins/menu')
        }else {
          //update success
        }
        if (open || ldopen) {
          setOpen(false)
          setLdopen(false)
        }
        
      }else if(response?.id){
        //edit handle
        console.log('edit');
        
        setFormData({title:response.title,position:response.position})
        setUnique(response.uniqueId)
        //setSelectCat(JSON.parse(response.cid))
      }
      else {
      }
      document.body.classList.remove('loading')
    } ,[response])


    useEffect(() => {
      let header = {
        'lang': lang
      }
      postData(`plugins/menu/select`,{unique:unique},header)
    },[lang])



    //actions

    const handleCloseEditModal = () => {

      setFormData({})
      setNewModal(false)
      setSelectLang(true)
      setUnique('')
      setLang(localStorage.getItem('_lang_'))
    }
    const onChangeLangHadle = async (e:any) => {

      setFormData({title:'',position:''})
      setLang(e)      
    }
    const onClickNewHandel = () => {
      setNewModal(true)
    }

    const onClickEditHandel = async (id:any) => {

      let header = {
        'lang': lang
      }
      await postData(`plugins/menu/select`,{unique:id},header)

        setUnique(id)
        setNewModal(true)
        setSelectLang(false)
    }


    const onClickDeleteHandel = (e:any) => {
      setUnique(e)
      setOpen(true)
    }

    const handleNewSubmit = async () => {
      if (selectLang) {
        //insert
        console.log('insert');

        console.log(formData);
        
        let header = { 
          'Content-Type': 'multipart/form-data',
          'lang': lang
        }
        await postData('plugins/menu/insert',formData, header)
      }
      else {
        //update
        console.log('update');
        let header = {
          'Content-Type': 'multipart/form-data',
          'lang': lang
        }
        await postData('plugins/menu/update',{...formData,unique:unique},header)
      }
    }



    const handleDeleteLang = () => {}

    const handleDeleteCat = () => {}

  const delLang = (id:any) => {
    setLangDeletId(id)
    setLdopen(true)
  }

    return (
        <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'65%',float:'right'}}>
                        مدیریت منو
                </h1>
                <div style={{marginTop:'25px',marginBottom:'25px',maxWidth:'40%',float:'left'}}>
                    <Button onClick={() => router.push('/bussiness/attribute/trash')} className="danger">ذباله دان</Button>
                    <Button onClick={() => onClickNewHandel()} className="primary">ایجاد </Button>
                </div>
                <div style={{clear:'both'}}></div>

                {
          !data?
                ''// <CircularProgress sx={{textAlign:'center',margin:'48%',marginTop:'40px'}} disableShrink />
            :
            data?.data.map((item:any) => {
              return (
            <>
                <MenuLists 
                  title={item.title}
                  id={item.id}
                  uniqueId={item.uniqueId}
                  edithandle={(e:any) => onClickEditHandel(e)}
                  deletehandle={(e:any) => onClickDeleteHandel(e)}
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
          ایجاد منو

          </Typography>
          <Divider />
          <Grid container spacing={1.5}>
                            <Grid md={6} sm={12}>
                                <FormLabel>
                                    <span>عنوان منو<small className="text-danger pr-1">*</small></span> 
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

                            <Grid md={6} sm={12}>
                                <FormLabel>
                                    <span>موقعیت نمایش</span> 
                                    <Select
                                      placeholder="انتخاب یک موقعیت"
                                      sx={{ width: '100%' }}
                                      slotProps={{
                                        listbox: {
                                          placement: 'bottom-start',
                                        },
                                      }}
                                      value={formData.position}
                                      onChange={(e, v) => setFormData({...formData,position:v})}
                                    >
                                      <Option value="">
                                      انتخاب یک موقعیت
                                      </Option>
                                        {
                                          template.menu_position.map((v:any,i:any) => {
                                            return(
                                              <Option key={i} value={v}>
                                                {v}
                                              </Option>

                                            )
                                          })

                                        }
                                     
                                    </Select>
                                </FormLabel>
                            </Grid>

            </Grid>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          {response?.message&&<span className="err">{response?.message}</span>}
          {response?.status&&<span className="success">{response?.msg}</span>}
            <Button variant="plain" color="neutral" onClick={() => setNewModal(false)}>
              انصراف
            </Button>
            <Button variant="solid" color="danger" onClick={() => handleNewSubmit()}>
              ثبت اطلاعات 
            </Button>
          </Box>
        </ModalDialog>
   </Modal>

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
             ({`ID: ${unique}`})  حذف  گروه خصوصیات
          </Typography>
          
          <Typography component='h3' id="alert-dialog-modal-description" textColor="text.tertiary">
            جهت ادامه روند حذف روی دکمه تایید کلیک نمایید
          </Typography>
          <Typography className="text-danger" id="alert-dialog-modal-description" textColor="text.tertiary">
            با حذف گروه خصوصیات امکان غیر فعال شدن تمامی محتوا وابسته به این مورد وجود دارد.
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
           همچنان با حذف این مورد تمام ویذگی های فرزند حذف میگردد
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