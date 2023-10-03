import Header from "@/Components/header";
import Lang from "@/Components/lang";
import AttrGp from "@/Components/listItem/attrGp";
import Category from "@/Components/listItem/categury";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Box, Button, Chip, CircularProgress, Divider, FormLabel, Grid, Input, Modal, ModalDialog, Option, Select, Typography, getCardUtilityClass } from "@mui/joy";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineFileSearch, AiOutlineFontSize, AiOutlineLink } from "react-icons/ai";
import { RiDeleteBin6Line, RiFileWarningFill } from "react-icons/ri";

export default function Attribute() {
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
    const [formData, setFormData] = useState<any>({})
    const [unique, setUnique] = useState('')
    const [selectLang, setSelectLang] = useState<boolean>(true)
    const [selectCat, setSelectCat] = useState<any>({
      c1:true,
      c2:false,
      c3:false,
      c4:false,
      c5:false
    })
    const [cat, setCat] = useState<any>({
      c1:null,
      c2:null,
      c3:null,
      c4:null,
      c5:null
    })
    const [catData, setCatData] = useState<any>({
      c1:null,
      c2:null,
      c3:null,
      c4:null,
      c5:null
    })
    
    const {postData, response, status} = useFetch()

    useEffect(() => {
      if (!lang) {
        setLang(localStorage.getItem('_lang_')||'')
      }
      server()
    }, [router])

    useEffect(() => {
      console.log('response: ', response);
      
      setOnload(true)

      if (response?.total) {
        //load datas
        setData(response)
      }
      else if(response?.status && response?.msg){
        if (selectLang) {
          //insert success
          handleCloseEditModal()
          router.push('/bussiness/attribute')
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
        
        setFormData({title:response.title,link:response.link})
        const obj = JSON.parse(response.cid)
        //setSelectCat(JSON.parse(response.cid))
        che(obj)
        
      }
      else {
      }
    } ,[response])

    const che = async (obj:any) => {
      if (obj.c1) {
        const r = getCat(obj.c1,'c1')
      }
      if (obj.c2 && selectCat.c2) {
        const r = getCat(obj.c2,'c2')
      }
      if (obj.c3) {
        const r = getCat(obj.c3,'c3')
      }
      if (obj.c4) {
        const r = getCat(obj.c4,'c4')
      }
      setCat(obj)
      console.log(JSON.parse(response.cid));
    }

    useEffect(() => {
      getCat(0,'c0')
      let header = {
        'lang': lang
      }
      postData(`attribute/select`,{unique:unique},header)
    },[lang])



    //actions
    const server = async (l:string=lang) => {
      console.log(l);
      
      const header = {
        'lang': l
      }
      await postData(`attribute/select`,{gp:null},header)
    }

    const handleCloseEditModal = () => {
      setCat({
        c1:null,
        c2:null,
        c3:null,
        c4:null,
        c5:null
      })
      setCatData({
        c1:null,
        c2:null,
        c3:null,
        c4:null,
        c5:null
      })
      setSelectCat({
        c1:null,
        c2:null,
        c3:null,
        c4:null,
        c5:null
      })
      setFormData({})
      setNewModal(false)
      setSelectLang(true)
      setUnique('')
      setLang(localStorage.getItem('_lang_') || '')
    }
    const onChangeLangHadle = async (e:any) => {
      setCat({
        c1:null,
        c2:null,
        c3:null,
        c4:null,
        c5:null
      })
      setCatData({
        c1:null,
        c2:null,
        c3:null,
        c4:null,
        c5:null
      })
      setSelectCat({
        c1:null,
        c2:null,
        c3:null,
        c4:null,
        c5:null
      })
      setFormData({title:'',link:''})
      setLang(e)      
    }
    const onClickNewHandel = () => {
      getCat(0,'c0')
      setNewModal(true)
    }
    const onClickEditHandel = async (id:any) => {
      await getCat(0,'c0')

      let header = {
        'lang': lang
      }
      await postData(`attribute/select`,{unique:id},header)

        setUnique(id)
        setNewModal(true)
        setSelectLang(false)
    }
    const onClickDeleteHandel = (e:any) => {
      setUnique(e)
      setOpen(true)
    }

    const handleNewSubmit = async () => {
      const data = {...formData,lang:lang,cid:cat,gp:null}
      console.log(data);
      if (selectLang) {
        //insert
        console.log('insert');
        
        await postData('attribute/insert',data)
      }
      else {
        //update
        console.log('update');
        
        await postData('attribute/update',{...data,unique:unique},{'Lang':lang})
      }
    }

    const getCat = async (uq:any=0, t:string, l=lang) => {
        let data = null
        console.log(cat.c1);

        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/product_cat/select_child/`+uq, {
            method: 'POST',
            headers: {
              'lang': l
            },
          }).then(async (res:any) => {
            let d = await res.json()
            
            switch(t){
              case 'c1':
                  setCatData({...catData,c2:d})
                  if (d) {
                    setSelectCat({...selectCat,c2:true})
                  }
              return
              case 'c2':
                setCatData({...catData,c3:d})
                if (d) {
                  setSelectCat({...selectCat,c2:true,c3:true})
                }
              return
              case 'c3':
                setCatData({...catData,c4:d})
                if (d) {
                  setSelectCat({...selectCat,c2:true,c3:true,c4:true})
                }
              return
              case 'c4':
                setCatData({...catData,c5:d})
                if (d) {
                  setSelectCat({...selectCat,c2:true,c3:true,c4:true,c5:true})
                }
              return
              default:
                setCatData({...catData,c1:d})
            }
            
          }).catch(err => console.log(err))
        } catch (error) {
          console.log('catch: ',error);
        }

        return true
    }

    const handleDeleteLang = () => {
      if (langDeletId) {
        document.body.classList.add('loading')
        postData('attribute/delete_lang',{id:langDeletId})
      }
    }

    const handleDeleteCat = () => {
      if (unique) {
          document.body.classList.add('loading')
          postData('attribute/delete',{unique:unique})
        }
  }

  const delLang = (id:any) => {
    setLangDeletId(id)
    setLdopen(true)
  }

    if (onload) {
      document.body.classList.remove('loading')
      
    }

    return (
        <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'65%',float:'right'}}>
                        گروه خصوصیات
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
                <AttrGp 
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
          ایجاد گروه خصوصیات

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
                                    <span>دسته  بندی اول</span> 
                                    <Select
                                      onChange={async (e, v) => {
                                          if (v) {
                                            await getCat(v,'c1')
                                            setSelectCat({...selectCat,c2:true})
                                            setCat({...cat,c1:v})
                                            
                                          }else{
                                            setSelectCat({
                                              c1:true,
                                              c2:false,
                                              c3:false,
                                              c4:false,
                                              c5:false
                                            })
                                            setCat({
                                              c1:null,
                                              c2:null,
                                              c3:null,
                                              c4:null,
                                              c5:null
                                            })
                                          }
                                      }}
                                      placeholder="همه دسته ها"
                                      sx={{ width: '100%' }}
                                      slotProps={{
                                        listbox: {
                                          placement: 'bottom-start',
                                        },
                                      }}
                                      value={cat.c1}
                                    >
                                      <Option value="">
                                        همه دسته ها
                                      </Option>
                                        {
                                          catData.c1&&catData.c1.map((v:any,i:any) => {
                                            return(
                                              <Option key={i} value={v.uniqueId}>
                                                {v.title}
                                              </Option>

                                            )
                                          })

                                        }
                                     
                                    </Select>
                                </FormLabel>
                            </Grid>

                            {
                              selectCat.c2&&
                              <Grid md={6} sm={12}>
                              <FormLabel>
                                  <span>دسته بندی دوم</span> 
                                  <Select
                                    onChange={async (e, v) => {
                                        if (v) {
                                          await getCat(v,'c2')
                                          setSelectCat({...selectCat,c3:true})
                                          setCat({...cat,c2:v})
                                        }else{
                                          setSelectCat({
                                            ...selectCat,
                                            c3:false,
                                            c4:false,
                                            c5:false
                                          })
                                          setCat({
                                            ...cat,
                                            c2:null,
                                            c3:null,
                                            c4:null,
                                            c5:null
                                          })
                                        }
                                    }}
                                    placeholder="همه دسته ها"
                                    sx={{ width: '100%' }}
                                    slotProps={{
                                      listbox: {
                                        placement: 'bottom-start',
                                      },
                                    }}
                                    value={cat.c2}
                                  >
                                    <Option value="">
                                      همه دسته ها
                                    </Option>
                                    {
                                          catData.c1&&catData.c2.map((v:any,i:any) => {
                                            return(
                                              <Option key={i} value={v.uniqueId}>
                                                {v.title}
                                              </Option>

                                            )
                                          })

                                        }
                                   
                                  </Select>
                              </FormLabel>
                          </Grid>
                            }

{
                              selectCat.c3&&
                              <Grid md={6} sm={12}>
                              <FormLabel>
                                  <span>دسته بندی سوم</span> 
                                  <Select
                                    onChange={async (e, v) => {
                                        if (v) {
                                          await getCat(v,'c3')
                                          setSelectCat({...selectCat,c4:true})
                                          setCat({...cat,c3:v})

                                        }else{
                                          setSelectCat(
                                            {
                                              ...selectCat,
                                              c4:false,
                                              c5:false
                                            }
                                          )
                                          setCat({
                                            ...cat,
                                            c3:null,
                                            c4:null,
                                            c5:null
                                          })
                                        }
                                    }}
                                    placeholder="همه دسته ها"
                                    sx={{ width: '100%' }}
                                    slotProps={{
                                      listbox: {
                                        placement: 'bottom-start',
                                      },
                                    }}
                                  >
                                    <Option value="">
                                      همه دسته ها
                                    </Option>
                                    {
                                          catData.c1&&catData.c3.map((v:any,i:any) => {
                                            return(
                                              <Option key={i} value={v.uniqueId}>
                                                {v.title}
                                              </Option>

                                            )
                                          })

                                        }
                                   
                                  </Select>
                              </FormLabel>
                          </Grid>
                            }

{
                              selectCat.c4&&
                              <Grid md={6} sm={12}>
                              <FormLabel>
                                  <span>دسته بندی چهارم</span> 
                                  <Select
                                    onChange={async (e, v) => {
                                        if (v) {
                                          await getCat(v,'c4')
                                          setSelectCat({...selectCat,c5:true})
                                          setCat({...cat,c4:v})
                                        }else{
                                          setSelectCat({...selectCat,c5:false})
                                          setCat({
                                            ...cat,
                                            c4:null,
                                            c5:null
                                          })
                                        }
                                    }}
                                    placeholder="همه دسته ها"
                                    sx={{ width: '100%' }}
                                    slotProps={{
                                      listbox: {
                                        placement: 'bottom-start',
                                      },
                                    }}
                                  >
                                    <Option value="">
                                      همه دسته ها
                                    </Option>
                                    {
                                          catData.c1&&catData.c4.map((v:any,i:any) => {
                                            return(
                                              <Option key={i} value={v.uniqueId}>
                                                {v.title}
                                              </Option>

                                            )
                                          })

                                        }
                                   
                                  </Select>
                              </FormLabel>

                          </Grid>
                            }

                            {
                              selectCat.c5&&
                              <Grid md={6} sm={12}>
                              <FormLabel>
                                  <span>دسته بندی پنجم</span> 
                                  <Select
                                    onChange={(e, v) => {
                                        if (v) {
                                          //await getCat(v,'c5')
                                          //setSelectCat({...selectCat,c3:true})
                                          setCat({...cat,c5:v})
                                        }else{
                                          //setSelectCat({...selectCat,c3:false})
                                          setCat({
                                            ...cat,
                                            c5:null
                                          })
                                        }
                                    }}
                                    placeholder="همه دسته ها"
                                    sx={{ width: '100%' }}
                                    slotProps={{
                                      listbox: {
                                        placement: 'bottom-start',
                                      },
                                    }}
                                  >
                                    <Option value="">
                                      همه دسته ها
                                    </Option>
                                    {
                                          catData.c1&&catData.c5.map((v:any,i:any) => {
                                            return(
                                              <Option key={i} value={v.uniqueId}>
                                                {v.title}
                                              </Option>

                                            )
                                          })

                                        }
                                   
                                  </Select>
                              </FormLabel>
                          </Grid>
                            }
                          <Grid md={12} sm={12}>
                                <FormLabel>
                                    <span>لینک</span> 
                                <Input
                                    size={'lg'}
                                    startDecorator={<AiOutlineLink />}
                                    fullWidth
                                    required
                                    value={formData?.link}
                                    onChange={(e) => setFormData({...formData,link:e.target.value})}
                                    id="fname"
                                    className="ltr"
                                />
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