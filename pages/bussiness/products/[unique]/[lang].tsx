import Header from "@/Components/header";
import Lang from "@/Components/lang";
import Menu from "@/Components/menu";
import Cat from "@/Components/product/cat";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Box, Button, Card, Divider, Grid, Modal, ModalDialog, Typography } from "@mui/joy";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Detail from "@/Components/product/detail";
import Attribute from "@/Components/product/attr";
import Gallery from "@/Components/product/gallery";
import { json } from "node:stream/consumers";
import { RiFileWarningFill } from "react-icons/ri";
interface BrandInter {
    title:string,
    text:string,
    country:string,
    meta_key:string,
    desc:string,
    canonical:string
}

const serverData = {
  orginal:true,
  cat:'',
  brand:'',
  model:'',
  title:'',
  type:'F',
  wtype:'گرم',
  atype:'سانتیمتر',
  box:{l:'0',v:'0',h:'0',w:'0'},
  text:'',
  zaf:'',
  ghovat:''
}
export default function Store() {

    const router = useRouter()
    const [lang, setLang] = useState<any>()
    const [unique, setUnique] = useState<string>()
    const [formData, setFormData] = useState(serverData)
    const [selectLang, setSelectLang] = useState<boolean>(true)
    const {postData, response, status} = useFetch() 
    const [mainCat, setMainCat] = useState<string>('')
    const [attr, setAttr] = useState<any[]>([])
    const [id, setId] = useState(0)
    const [open, setOpen] = useState<boolean>(false)
    const [update, setUpdate] = useState<boolean>(true)

    const [detail, setDetail] = useState<boolean>(false)
    const [cats, setCats] = useState<any>({
        cat1:null,
        cat2:null,
        cat3:null,
        cat4:null,
        cat5:null,
    })
    const [upDetail, setUpDetail] = useState<any>()
    const [sk, setSk] = useState<number>(0)
    const [warnningAttr,setWarnningAttr] = useState<boolean>(false)

    // useEffect(() => {
    //   setUnique('pro'+Math.random().toString(16).slice(-10))
    // }, [])
      useEffect(() => {    
        console.log('rout');
        ('route')
        setLang((router.query.lang)?.toString().toUpperCase())
        if (router.query.unique) {
          server(router.query.lang, router.query.unique)
        }

      }, [router])

      useEffect(() => {
        console.log(response);

        if (response?.status && response?.msg === 'stored') {
          console.log(response.data.uniqueId);
          setId(response.data.id)
          setUnique(response.data.uniqueId)
          setDetail(true)
          document.body.classList.remove('loading')
        }

        if (response?.status && response?.msg === 'inserted') {
          console.log(response);
          setOpen(true);
          
        }

        if (response?.slug) {
          setUpDetail(response)
          setMainCat(response.mainCat)
          setUnique(response.uniqueId)
          setId(response.id)
          console.log(response);
          setCats({
            cat1:JSON.parse(response.cat).cat1??null,
            cat2:JSON.parse(response.cat).cat2??null,
            cat3:JSON.parse(response.cat).cat3??null,
            cat4:JSON.parse(response.cat).cat4??null,
          })
          setSelectLang(false)
          setDetail(true)
        }
        
        if (!response?.status && response?.msg === 'New_Lang') {
          console.log(response.lang);
          setUpDetail(serverData)
          setMainCat('')
          setSk(Number(response.sk))
          console.log(response);
          setCats({
            cat1:null,
            cat2:null,
            cat3:null,
            cat4:null,
            cat5:null,
        })
          setSelectLang(false)
          setDetail(false)
        }

      }, [response])


      //actions

      const server = async (l:any,u:any) => {
        const header = {
          'lang': l
        }
        await postData(`product/select`,{unique:u},header)
      }

      const store = async (cat:any) => {
        cat = JSON.stringify(cat)
        const header = {
          'lang': lang
        }
            await postData(`product/store`,{cat:cat, mainCat:mainCat},header)

      }

    const acceptCat = (c:any) => {
        
        if (c.cat4.title) {
          setMainCat(c.cat4.title)

        }else if (c.cat3.title) {
          setMainCat(c.cat3.title)

        }else if (c.cat2.title) {
          setMainCat(c.cat2.title)

        }else if (c.cat1.title) {
          setMainCat(c.cat1.title)

        }

      let category = {
        cat1: c.cat1.uniqueId,
        cat2: c.cat2.uniqueId ?? null,
        cat3: c.cat3.uniqueId ?? null,
        cat4: c.cat4.uniqueId ?? null,
      }
      if (!upDetail.slug) {
        setUpdate(false)
        store(category)
        document.body.classList.add('loading')
        console.log(unique);
      }else {
        setUpdate(true)
        setDetail(true)
        document.body.classList.remove('loading')
        console.log(cats);
        
      }
      setCats(category) 
      console.log(category);

    }

    const dialogAttrWarning = (c:any) => {
      setWarnningAttr(c)
    }

    const onChangeLangHadle = async (e:any) => {
      setDetail(false)
      await router.push(`/bussiness/products/${router.query.unique}/${e}`)
    }

    const changeCat = () => {
      if (attr.length) {
        setWarnningAttr(true)
        return false
      }

      
      document.body.classList.add('loading')
      console.log('changeCat');
      setCats({
        cat1:null,
        cat2:null,
        cat3:null,
        cat4:null,
        cat5:null,
    })

      if (detail) {
        setDetail(false)
      }
      
    }

    const onClickHandleFormData = async () => {
     // document.body.classList.add('loading')
      console.log(router.query.unique);
      console.log(cats);

      const header = {
        'lang' : lang
      }
      const data = {...formData,cat:JSON.stringify(cats),attr:attr,unique:router.query.unique,id:id,update:update,sk:sk}
      postData('product/insert',data,header)
      console.log(data);
      //send data to server
    }

    const resetComponent = () => {
      location.href = '/bussiness/products/insert/'+lang
    }

    return(
        <main>
        <Menu />
        <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'60%',float:'right'}}>{!selectLang?'ویرایش تولید کننده':'ایجاد تولید کننده'}</h1>
            <div style={{marginTop:'25px',marginBottom:'25px',width:'40%',float:'left'}}>
                    <Lang style={{
                            width:'100%',
                        }}
                        disable={selectLang}
                        onChange={(e:any) => onChangeLangHadle(e)}
                        dv={lang}
                    />
            </div>
            <div style={{clear:'both'}}></div>
            <Divider />
            {
            lang &&
            <Cat 
              lang={lang}
              getCat={(c:any) => acceptCat(c)}
              changed={() => changeCat()}
              cats={cats}
              update={!selectLang}
              detail={detail}
            />
            }


    {/* <Tabs aria-label="tabs" defaultValue={0} sx={{ bgcolor: 'transparent', marginTop:3 }}>
      <TabList
        disableUnderline
        sx={{
          p: 0.5,
          gap: 0.5,
          borderRadius: 'md',
          bgcolor: 'background.level1',
          [`& .${tabClasses.root}[aria-selected="true"]`]: {
            boxShadow: 'sm',
            bgcolor: 'background.surface',
          },
          position:"fixed",
          bottom:5,
          width:{md:'97.6%', sm:'97.6%', xs:'95.3%', lg:'78%'},
          left:12
        }}
      >
        <Tab disableIndicator>اطلاعات کالا</Tab>
        <Tab disableIndicator>تنظیمات پیشرفته</Tab>
        <Tab disableIndicator>تنظیمات سئو</Tab>
      </TabList>
    </Tabs> */}

    <Box component='div' sx={{marginTop:3}}>
      {
        detail && <Detail 
        lang={lang}
        cat={cats.cat4}
        mainCat={mainCat}
        setdata ={(data:any) => {
          setFormData(data)
        }}
        formData={upDetail}
        update={!selectLang}
        />
      }

    </Box>
    <Box component='div' sx={{marginTop:3}}>

    {
       (cats.cat1 && detail) &&
          <Attribute 
          lang={lang}
          cat={JSON.stringify(cats)}
          getAttr={(data:any) => {
            setAttr(data)
            
          }}
          attrData={upDetail.attr?upDetail.attr:null}
          update={!selectLang}
          />
    }
    </Box>

    <Box component='div' sx={{marginTop:3}}>

    {
      (cats.cat1 && detail) &&
          <Gallery 
          lang={lang}
          unique={unique}
          imgData={upDetail.img}
          update={!selectLang}
          />
    }

{
      (cats.cat1 && detail) &&
            <Card className="card" sx={{marginTop:'10px'}}>
                {response?.message&&<span className="err">{response?.message}</span>}
                {response?.status&&<span className="success">{response?.msg}</span>}
                    <Button onClick={()=> onClickHandleFormData()
                    } className="primary">ثبت اطلاعات</Button>                    
              </Card>
}
      </Box>
    </Container>


    <Modal open={open}
     onClose={() => {
      return 1;
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
             کالا با موفقیت ثبت شد
          </Typography>
          
          <Typography component='h3' id="alert-dialog-modal-description" textColor="text.tertiary">
            لطفا یکی از موارد زیر را جهت ادامه روند انتخاب کنید.
          </Typography>
          <Typography className="text-info" id="alert-dialog-modal-description" textColor="text.tertiary">
            جهت ویرایش این کالا با استفاده از منو اصلی وارد لیست کالا ها شوید
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => alert(1)}>
              قیمت گذاری
            </Button>
            <Button variant="solid" color="primary" onClick={() => router.push('/bussiness/products')}>
              لیست کالا ها 
            </Button>
            <Button variant="solid" color="primary" onClick={() => {
              resetComponent()
            }}>
              درج کالا جدید 
            </Button>
            <Button variant="solid" color="primary" onClick={() => alert(1)}>
              تنظیمات سئو 
            </Button>
          </Box>
        </ModalDialog>
   </Modal>


   <Modal open={warnningAttr}
     onClose={() => {
      return 1;
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
             تغییر دسته بندی
          </Typography>
          
          <Typography component='h3' id="alert-dialog-modal-description" textColor="danger">
            با تغییر دسته بندی کالا تمامی اطلاعاتی که در خصوصیات درج کرده اید حذف میگردد.
          </Typography>
        
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="solid" color="danger" onClick={async() => {
              await setAttr([])
              await setUpDetail({...upDetail,attr:{data:JSON.stringify([])}})
              if (!attr.length) {
                changeCat();
                setWarnningAttr(false)
              }
            }}>
              تایید تغییرات
            </Button>
            <Button variant="solid" color="primary" onClick={() => setWarnningAttr(false)}>
              انصراف
            </Button>
          </Box>
        </ModalDialog>
   </Modal>
        </main>
    )
}