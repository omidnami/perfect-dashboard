import Header from "@/Components/header";
import Lang from "@/Components/lang";
import AttrList from "@/Components/listItem/attr";
import Category from "@/Components/listItem/categury";
import Menu from "@/Components/menu";
import TagMaker from "@/Components/tagMaker";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Box, Button, Chip, CircularProgress, Divider, FormLabel, Grid, Input, Modal, ModalDialog, Option, Radio, RadioGroup, Select, Typography, getCardUtilityClass } from "@mui/joy";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineFileSearch, AiOutlineFontSize, AiOutlineLink } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import { RiDeleteBin6Line, RiFileWarningFill } from "react-icons/ri";
const dataModel = {dataType:'text',type:'input',data:[],title:''}
export default function Attr() {

    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const [ldopen, setLdopen] = useState<boolean>(false)
    const [langDelet, setLangDelet] = useState<any>('')
    const [langDeletId, setLangDeletId] = useState<any>(0)
    const [data, setData] = useState({data:[],total:0,per_page:10,current_page:1})
    const [page, setPage] = useState(1)
    const [lang, setLang] = useState('')
    const [onload, setOnload] = useState(false)
    const [newModal, setNewModal] = useState<boolean>(false)
    const [formData, setFormData] = useState<any>({dataType:'text',type:'input',data:[],title:''})
    const [unique, setUnique] = useState('')
    const [id, setId] = useState('')
    const [selectLang, setSelectLang] = useState<boolean>(true)

    
    const {postData, response, status} = useFetch()

    useEffect(() => {
        if (!lang) {
          setLang(localStorage.getItem('_lang_')||'')
        }
        setUnique(router.query.attr+'')
        server()
      }, [router])

      useEffect(() => {
        setOnload(true)
          console.log(response);
          
        if (response?.total) {
          //get all data 10
          setData(response)
        }else if (response?.id) {
          //edit handle get data
          setFormData({...response,data:JSON.parse(response.data)})
        }else if (response?.status && response?.msg) {
          //insert or edit or delete or lang delete
          if (selectLang) {
            //insert
            setFormData(dataModel)
            setNewModal(false)
            router.push(`/bussiness/attribute/${unique}`)
          }else {

          }
          if (open || ldopen) {
            setOpen(false)
            setLdopen(false)
          }
        }
      }, [response])

      useEffect(() => {

      },[lang])

          //actions
    const server = async (l:string=lang) => {
        console.log(l);
        console.log('uniq: ',router.query.attr);
        
        const header = {
          'lang': l
        }
        await postData(`attribute/select/1`,{gp:router.query.attr},header)
    }

      const onClickNewHandel = () => {
        setNewModal(true)
      }
      
      const onClickEditHandel = async (id:any) => { 
        let header = {
          'lang': lang
        }
        await postData(`attribute/select`,{unique:id},header)
  
          setId(id)
          setNewModal(true)
          setSelectLang(false)
      }

      const onClickDeleteHandel = (e:any) => {
        setId(e)
        setOpen(true)
      }
      const handleCloseEditModal = () => {
        setFormData(dataModel)
        setNewModal(false)
        setSelectLang(true)
        setLang(localStorage.getItem('_lang_') || '')
      }
      const onChangeLangHadle = (e:any) => {
        setFormData(dataModel)
        setLang(e) 
        let header = {
          'lang': e
        }
        postData(`attribute/select`,{unique:id},header)
      }
      const handleNewSubmit = async () => {
        console.log(unique);
        
        const data = {...formData,lang:lang,data:JSON.stringify(formData.data),gp:unique}
        console.log(data);
        if (selectLang) {
          //insert
          console.log('insert');
          
          await postData('attribute/insert',data)
        // JSON.stringify(tags)
      }else {
        //update
        console.log('update');
        await postData('attribute/update',{...data,unique:id},{'Lang':lang})
      }
    }
      const handleDeleteCat = () => {
        if (id) {
          document.body.classList.add('loading')
          postData('attribute/delete',{unique:id})
        }
      }
      const handleDeleteLang = () => {
        if (langDeletId) {
          document.body.classList.add('loading')
          postData('attribute/delete_lang',{id:langDeletId})
        }
      }
      const delLang = (id:any) => {
        setLangDeletId(id)
        setLdopen(true)
      }

      const getDataType = () => {
        switch(formData.dataType) {
          case 'text' :
            return 'متن'
          case 'img' :
              return 'آدرس عکس'
          case 'code' :
                return 'تگ HTML'
          case 'color' :
                  return 'رنگ با فرمت هش'
        }
      }

      if (onload) {
        document.body.classList.remove('loading')
        
      }
      
    return(
        <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'65%',float:'right'}}>
                  خصوصیات  کالا و خدمات
                </h1>
                <div style={{marginTop:'25px',marginBottom:'25px',maxWidth:'40%',float:'left'}}>
                    <Button onClick={() => router.push(`/bussiness/attribute/${unique}/trash`)} className="danger">ذباله دان</Button>
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
                <AttrList
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
           خصوصیات

          </Typography>
          <Divider />
          <Grid container spacing={1.5}>
                            <Grid md={6} sm={12}>
                                <FormLabel>
                                    <span>عنوان<small className="text-danger pr-1">*</small></span> 
                                <Input
                                    size={'lg'}
                                    startDecorator={<AiOutlineFontSize />}
                                    fullWidth
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData,title:e.target.value})}
                                    id="fname"
                                />
                               {response?.errors?.title&&<span className="err">{response?.errors?.title}</span>}
                               {response?.errors?.slug&&<span className="err">{response?.errors?.slug}</span>}
                                </FormLabel>
                            </Grid>


                            <Grid md={6} sm={12}>
                                <FormLabel>
                                    <span>نوع داده</span> 
                                    <Select
                                      onChange={async (e, v) => {
                                        setFormData({...formData,type:v,dataType:'text'})
                                      }}
                                      placeholder="متن"
                                      sx={{ width: '100%' }}
                                      slotProps={{
                                        listbox: {
                                          placement: 'bottom-start',
                                        },
                                      }}
                                      value={formData.type}
                                      size="lg"
                                    >
                                      <Option value="input">
                                        ورودی متن
                                      </Option>
                                      <Option value="select">
                                        لیست کشویی (تک اتخاب)
                                      </Option>
                                      <Option value="checkBox">
                                       چک باکس (چند اتخاب)
                                      </Option>
                                    </Select>
                                </FormLabel>
                            </Grid>
                            {
  formData.type === 'input' ?'':
  <>
  
                            <Grid md={12} sm={12}>
                                <FormLabel>
                                    <span>نوع ورودی
                                     
                                      </span> 
                                    <Select
                                      onChange={async (e, v) => {
                                          setFormData({...formData,dataType:v})
                                      }}
                                      placeholder="متن"
                                      sx={{ width: '100%' }}
                                      slotProps={{
                                        listbox: {
                                          placement: 'bottom-start',
                                        },
                                      }}
                                      value={formData.dataType}
                                      size="lg"
                                    >
                                      <Option value="text">
                                        متن
                                      </Option>
                                      <Option value="code">
                                        کد
                                      </Option>
                                      <Option value="img">
                                       تصویر
                                      </Option>
                                      <Option value="color">
                                       رنگ
                                      </Option>
                                    </Select>
                                </FormLabel>
                            </Grid>


                          <Grid md={12} sm={12}>
                                <FormLabel>
                                    <span>مقادیر 
                                    {
                                      `( ${getDataType()} )`
                                      }
                                      </span> 
                                      <TagMaker
                                          getTags={(e:string)=>setFormData({...formData,data:[...formData.data,e]})}
                                      />
                                                                      {
                                    formData.data&&
                                    formData.data.map((v:any,i:any) => {
                                        return (
                                        <Chip id='tag' sx={{margin:1}} key={i}>
                                            <span className="close-tag" 
                                            onClick={() => {
                                               let t = formData.data.filter((e: any)=> v !== e)
                                               setFormData({...formData,data:t})
                                            }}
                                            ><GrClose /></span>
                                            
                                            {v}
                                        </Chip>
                                        )
                                    })
                                }
                                </FormLabel>
                            </Grid>
  
  </>

}
            </Grid>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          {response?.message&&<span className="err">{response?.message}</span>}
          {response?.status&&<span className="success">{response?.msg}</span>}
            <Button variant="plain" color="neutral" onClick={() => handleCloseEditModal()}>
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
            با حذف  خصوصیات امکان غیر فعال شدن تمامی محتوا وابسته به این مورد وجود دارد.
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