import Header from "@/Components/header";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { AspectRatio, Button, Card, Divider, FormLabel, Grid, Input, Skeleton } from "@mui/joy";
import { useRouter } from "next/router";
import { Component, useEffect, useRef, useState } from "react";
import { HiCalendarDays, HiCreditCard, HiDevicePhoneMobile, HiEnvelope, HiFlag, HiKey, HiMap, HiOutlineIdentification, HiPhone, HiUser } from "react-icons/hi2";

interface USER {
    fname: string,
    lname: string,
    phone: string,
    rol: Number,
    email: string,
    userName: string,
    password: string,
    password_confirmation: string,
  }

  interface USER_DATA {
    address: string,
    posport: string,
    breat: string,
    father: string,
    tel: string,
    zip: string,
    meli: string
  }

const initialsUser:USER = {
    fname: '',
    lname: '',
    phone: '',
    rol: 0,
    email: '',
    userName: '',
    password: '',
    password_confirmation:'',
}

const initialsUserData:USER_DATA = {
    address: '',
    posport: '',
    breat: '',
    father: '',
    tel: '',
    zip: '',
    meli: ''
}
export default function Insert() {
    const router = useRouter()
    const [formData, setFormData] = useState(initialsUserData)
    const [formUser, setFormUser] = useState(initialsUser)
    const { response, postData, status } = useFetch()
    const [file, setFile] = useState<File>()

    useEffect(() => {
        const uid = router.query.uid 
            postData(`user/select/${uid}`,null)
        
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [router])
    
      useEffect(() => {
        if (response && !Number(router.query.uid)) {
        }
        if (response?.email && Number(router.query.uid)) {
            setFormUser(response)
            if (response.person_data) {
                setData()
            }
            

            console.log('* effect setData *',formData);
            
        }
        console.log(formData,formUser);
        document.querySelector('input')?.classList.remove('err')

        if (response?.status && !Number(router.query?.uid)) {
            setFormData(initialsUserData)
            setFormUser(initialsUser)
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [response])

      const setData = async () => {
            if (response instanceof Object) {
                
                const person = await JSON.parse(response.person_data)
                await setFormData(person)
            }
      }

      const onClickHandleFormData = async () => {
        const data = {...formData,...formUser,file:file}
        if (Number(router.query.uid)) {
            await postData(`user/update/${router.query.uid}`,data)
        }else {
            await postData('user/insert',data)

        }
        
      }

      if (Number(router.query.uid) && !formUser?.email) {
            return (
                <main className='main'>
                <Menu />
                <Container>
                    <Header />
                <h1 style={{marginTop:'25px',marginBottom:'25px'}}>ایجاد کاربر</h1>
                
                </Container>
                </main>
            )
      }

    return (
        <main className='main'>
        <Menu />
        <Container>
            <Header />
        <h1 style={{marginTop:'25px',marginBottom:'25px'}}>ایجاد کاربر</h1>
        <Grid container spacing={1.5}>
            <Grid sm={12} md={8}>
                <Card className="card">
                    <h3>اطلاعات شناسایی</h3>
                    <Divider />

                        <Grid container spacing={1.5}>
                            <Grid lg={6} md={12}>
                                <FormLabel>
                                    <span>نام<small className="text-danger pr-1">*</small></span> 
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiUser />}
                                    fullWidth
                                    required
                                    value={formUser.fname}
                                    id="fname"
                                    onChange={(e) => setFormUser({...formUser,fname:e.target.value})}
                                />
                                {response?.errors?.fname&&<span className="err">{response?.errors?.fname}</span>}
                                </FormLabel>
                            </Grid>
                            <Grid lg={6} md={12}>
                                <FormLabel>
                                    <span>نام خانوادگی <small className="text-danger pr-1">*</small></span>
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiUser />}
                                    fullWidth
                                    required
                                    value={formUser.lname}
                                    id="lname"
                                    onChange={(e) => setFormUser({...formUser,lname:e.target.value})}
                                />
                               {response?.errors?.lname&&<span className="err">{response?.errors?.lname}</span>}

                                </FormLabel>
                            </Grid>

                            <Grid lg={6} md={12}>
                                <FormLabel>
                                  <span>نام پدر</span>  
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiUser />}
                                    fullWidth
                                    value={formData.father}
                                    onChange={(e) => setFormData({...formData,father:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>

                            <Grid lg={6} md={12}>
                                <FormLabel>
                                   <span>کد ملی </span> 
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiCreditCard />}
                                    fullWidth
                                    value={formData.meli}
                                    onChange={(e) => setFormData({...formData,meli:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>


                            <Grid lg={6} md={12}>
                                <FormLabel>
                                     <span>تاریخ تولد</span>
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiCalendarDays />}
                                    fullWidth
                                    value={formData.breat}
                                    onChange={(e) => setFormData({...formData,breat:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>

                            <Grid lg={6} md={12}>
                                <FormLabel>
                                    <span>شماره پاسپورت\ کارت اقامت\ شناسنامه </span>
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiCreditCard />}
                                    fullWidth
                                    value={formData.posport}
                                    onChange={(e) => setFormData({...formData,posport:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>
                        </Grid>
                        <p></p>
                </Card>

                <Card className="card" sx={{marginTop:'10px'}}>
                    <h3>اطلاعات تماس</h3>
                    <Divider />

                        <Grid container spacing={1.5}>
                            <Grid lg={6} md={12}>
                                <FormLabel>
                                     <span>شماره موبایل<small className="text-danger pr-1">*</small></span>
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiDevicePhoneMobile />}
                                    fullWidth
                                    required
                                    value={formUser.phone}
                                    id="phone"
                                    onChange={(e) => setFormUser({...formUser,phone:e.target.value})}

                                />
                                {response?.errors?.phone&&<span className="err">{response?.errors?.phone}</span>}

                                </FormLabel>
                            </Grid>
                            <Grid lg={6} md={12}>
                                <FormLabel>
                                <span>ادرس ایمیل<small className="text-danger pr-1">*</small></span>
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiEnvelope />}
                                    fullWidth
                                    required
                                    value={formUser.email}
                                    id="email"
                                    onChange={(e) => setFormUser({...formUser,email:e.target.value})}
                                />
                                {response?.errors?.email&&<span className="err">{response?.errors?.email}</span>}

                                </FormLabel>
                            </Grid>

                            <Grid lg={6} md={12}>
                                <FormLabel>
                                    <span>تلفن ثابت </span>
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiPhone />}
                                    fullWidth
                                    value={formData.tel}
                                    onChange={(e) => setFormData({...formData,tel:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>

                            <Grid lg={6} md={12}>
                                <FormLabel>
                                    <span>کد پستی </span>
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiFlag />}
                                    fullWidth
                                    value={formData.zip}
                                    onChange={(e) => setFormData({...formData,zip:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>


                            <Grid xs={12}>
                                <FormLabel>
                                      <span>آدرس پستی</span>
                                <Input
                                    size={'lg'}
                                    startDecorator={<HiMap />}
                                    fullWidth
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData,address:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>

                        </Grid>
                </Card>
<p></p>
                <Card className="card" sx={{marginTop:'10px'}}>
                {response?.message&&<span className="err">{response?.message}</span>}
                {response?.status&&<span className="success">{response?.msg}</span>}
                    <Button onClick={()=> onClickHandleFormData()
                    } className="primary">ثبت اطلاعات</Button>                    
                </Card>
            </Grid>

            <Grid sm={12} md={4}>
            <Card className="card" variant="outlined">
                <h3>اطلاعات حساب</h3>
                <Divider />
                <AspectRatio minHeight="120px">
                        <img
                        src={file?URL?.createObjectURL(file):'/no-image.png'}
                        srcSet={file?URL?.createObjectURL(file):'/no-image.png'}
                        loading="lazy"
                        alt=""
                        />
                </AspectRatio>
                <label className="primary btn btn-primary"> آپلود تصویر
                <Input
                type="file"
                hidden
                onChange={(e) => {
                    if (e.target.files) {
                        setFile(e.target.files[0]);
                      }
                }}
                />
                </label> 
                {response?.errors?.file&&<span className="err">{response?.errors?.file}</span>}
                    <FormLabel>
                    <span>نام کاربری<small className="text-danger pr-1">*</small></span> 

                    <Input
                                    size={'lg'}
                                    startDecorator={<HiUser />}
                                    fullWidth
                                    required
                                    className="userName"
                                    value={formUser.userName}
                                    id="userName"
                                    readOnly={Number(router.query.uid)?true:false}
                                    onChange={(e) => setFormUser({...formUser,userName:e.target.value})
                                }
                    />
                    {response?.errors?.userName&&<span className="err">{response?.errors?.userName}</span>}

                    </FormLabel>
                    <FormLabel> 
                    <span> تکرار کلمه عبور</span> 
                    <Input
                                    size={'lg'}
                                    startDecorator={<HiKey />}
                                    fullWidth
                                    type="password"
                                    value={formUser.password}
                                    onChange={(e) => setFormUser({...formUser,password:e.target.value})}
                    />
                    </FormLabel>
                    <FormLabel>
                    <span> تکرار کلمه عبور</span> 

                    <Input
                                    size={'lg'}
                                    startDecorator={<HiKey />}
                                    fullWidth
                                    required
                                    type="password"
                                    onChange={(e) => setFormUser({...formUser,password_confirmation:e.target.value})}
                    />
                    {response?.errors?.password&&<span className="err">{response?.errors?.password}</span>}

                    </FormLabel>
                    <div style={{marginTop:'25px'}}>
                        {/* <Button className="primary" type="submit">ثبت اطلاعات کاربری</Button> */}
                    </div>
            </Card>
            </Grid>
        </Grid>

        </Container>
  
  
      </main>
    )
}