import Header from "@/Components/header";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import __separate from "@/Libs/separate";
import { Avatar, Box, Button, Card, Divider, FormLabel, Grid, Input, List, ListDivider, ListItem, ListItemDecorator, Modal, ModalDialog, Textarea, Typography } from "@mui/joy";
import { access } from "fs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillFileText } from "react-icons/ai";

const data = {
    title : '',
    maxQuty : 1000000000,
    address : '',
    depoMan : 0,
    depo : '',
    row : '',
    shelf : '',
}
export default function Depo() {
    const router = useRouter()
    const [formData, setFormData] = useState<any>(data);
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [depoMan, setDepoMan] = useState<string>('')
    const [users, setUsers] = useState<any[]>([])
    const [id, setId] = useState<any>(0)
    
    const {postData, response} = useFetch()
    
    useEffect(() => {
        //server for depo service by id get users and depos
        setId(router.query.id)
        server()

    }, [])

    useEffect(() => {
        console.log(response);
        
        if (response?.status && response?.msg === 'depo_services') {
            const rd = JSON.parse(response.data)
            if (rd.depo) {
                //update handle
                console.log('update');
                
            }
            setUsers(rd.users)
            console.log(rd.users);
            
        }
        else if (response?.status && response?.msg === 'success') {
            setSuccess(true)
        }
        
    }, [response])



    //action
    const server = () => {
        postData('depo/depo_servisce',{id:router.query.id},null)
    }
    const addDepoMan = (id:any) => {
        const dm = users.filter(e=> e.id === id);
        setFormData({...formData,depoMan:dm[0].id})
        setDepoMan(dm[0].fname+ ' ' +dm[0].lname)
        setOpen(false)
    }

    const onClickHandleFormData = () => {
        postData('depo/insert/depomain',formData,null)
    }
    if (loading) {
        document.body.classList.remove('loading')
    }
    return(
        <main className="main">
            <Menu />
            <Container>
            <Header />
            <h1 style={{marginTop:'25px',marginBottom:'25px'}}>ایجاد انبار</h1>
                <Box component='section'>
                    <Card className="card">
                        <Grid container spacing={1.5} sx={{paddingBottom:'30px',paddingTop:'30ox'}}>
                            <Grid xs={12} sm={12} md={6} lg={6}>
                            <FormLabel>
                                    <span>عنوان</span>
                                <Input
                                    size={'lg'}
                                    startDecorator={'T'}
                                    fullWidth
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData,title:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={12} md={6} lg={6}>
                            <FormLabel>
                                    <span>ضرفیت انبار</span>
                                <Input
                                    size={'lg'}
                                    startDecorator={''}
                                    fullWidth
                                    value={formData.maxQuty}
                                    type="number"
                                    sx={{textAlign:'left', direction:'ltr'}}
                                    onChange={(e) => setFormData({...formData,maxQuty:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12}>
                            <FormLabel>
                                    <span>ادرس</span>
                                <Textarea
                                    size={'lg'}
                                    value={formData.address}
                                    sx={{width:'100%'}}
                                    minRows={3}
                                    onChange={(e) => setFormData({...formData,address:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={12} md={4} lg={4}>
                            <FormLabel>
                                    <span> شماره سوله/انبار</span>
                                <Input
                                    size={'lg'}
                                    startDecorator={''}
                                    fullWidth
                                    value={formData.depo}
                                    sx={{textAlign:'left', direction:'ltr'}}
                                    onChange={(e) => setFormData({...formData,depo:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={12} md={4} lg={4}>
                            <FormLabel>
                                    <span> ردیف</span>
                                <Input
                                    size={'lg'}
                                    startDecorator={''}
                                    fullWidth
                                    value={formData.row}
                                    sx={{textAlign:'left', direction:'ltr'}}
                                    onChange={(e) => setFormData({...formData,row:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12} sm={12} md={4} lg={4}>
                            <FormLabel>
                                    <span>قفسه</span>
                                <Input
                                    size={'lg'}
                                    startDecorator={''}
                                    fullWidth
                                    value={formData.shelf}
                                    sx={{textAlign:'left', direction:'ltr'}}
                                    onChange={(e) => setFormData({...formData,shelf:e.target.value})}

                                />
                                </FormLabel>
                            </Grid>
                            <Grid xs={12}>
                            <FormLabel>
                                    <span>دسترسی مسئول انبار</span>
                                    <Box component='div' 
                                        sx={{width:'100%'}}
                                    >
                                    <Button color="primary"
                                    sx={{float:'left'}}
                                    onClick={() => {
                                        setOpen(true)
                                    }}
                                    >انتخاب کاربر</Button>
                                    <Typography component='h4'
                                        sx={{float:'right'}}
                                    >
                                    {!Boolean(formData.depoMan)?'انبار مسئول ندارد':depoMan}
                                    </Typography> 
                                    </Box>
                                    

                                </FormLabel>
                            </Grid>
                        </Grid>
                    </Card>
                    <Card className="card" sx={{marginTop:'10px'}}>
                {response?.message&&<span className="err">{response?.message}</span>}
                {response?.status&&<span className="success">{response?.msg}</span>}
                    <Button onClick={()=> onClickHandleFormData()
                    } className="primary">ثبت اطلاعات</Button>                    
                </Card>
                </Box>
            </Container>
            <Modal
            open={open}
            onClose={() => setOpen(false)}
            >
            <ModalDialog>
            <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 4,
                overflow:'auto',
                maxHeight:'250px'
            }}
            >
          <div>
            <Typography level="body-xs" mb={2}>
            </Typography>
            <List
              variant="outlined"
              sx={{
                minWidth: 240,
                borderRadius: 'sm',
              }}
            >
                {
                    users.map(v => {
                        return (
                            <>
                            <ListItem key={v.id}
                            onClick= {() => addDepoMan(v.id)}
                            >
                              <ListItemDecorator>
                                <Avatar size="sm" src="/static/images/avatar/1.jpg" />
                              </ListItemDecorator>
                              {v.fname} {v.lname}
                            </ListItem>
                            <ListDivider  />
                            </>
                        )
                    })
                }

            </List>
          </div>
    </Box>
            </ModalDialog>
            </Modal>

            <Modal
            open={success}
            onClose={() => {return false}}
            >
            <ModalDialog>
                <Typography>انبار با موفقیت ایجاد شد</Typography>
                <br/>
                <Divider />
                <br/>
                <Button color="primary"
                onClick={() => {
                    router.push('/depo/list/0')
                }}
                >لیست انبار ها</Button>
                <br/>
                <Button color="primary"
                                onClick={() => {
                                    router.push('/depo/list/id')
                                }}
                >مدیریت سوله ها</Button>
                <br/>
                <Button color="primary"
                                    onClick={() => {
                                        location.href = ''
                                    }}
                >ایجاد انبار جدید</Button>
            </ModalDialog>
            </Modal>
        </main>
    )
}