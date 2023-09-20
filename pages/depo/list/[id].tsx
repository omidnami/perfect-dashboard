import Container from "@/Layouts/Continer"
import { Avatar, Box, Button, Card, Divider, List, ListItem, ListItemDecorator, Modal, ModalDialog, Sheet, Typography } from "@mui/joy"
import { Pagination, Tooltip } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { RiDeleteBin6Line, RiFileWarningFill, RiPencilLine } from "react-icons/ri"
import Header from "@/Components/header";
import useFetch from "@/Hooks/useFetch"
import Menu from "@/Components/menu"

export default function ListDepo() {
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [open, setOpen] = useState<boolean>(false)
    const [page, setPage] = useState<number>(0)
    const [id, setId] = useState(0)

    const {postData, response} = useFetch()

    useEffect(() => {
        setId(Number(router.query.id))
        postData('depo/select',{id:id},null)
    }, [])

    useEffect(() => {
        console.log(response);
        
        if (response?.total){
            setData(response)
        }
    }, [response])

    //action
    const handleChange = (e:any,v:any) => {}
    const handleDeleteDepo = () => {}
    const deletehandle = (id:any) => {}
    const edithandle = (id:any) => {}
    return(
            <main>
            <Menu />
            <Container>
                <Header />
                <h1 style={{marginTop:'25px',marginBottom:'25px',maxWidth:'65%',float:'right'}}> لیست انبارها</h1>
                <div style={{marginTop:'25px',marginBottom:'25px',maxWidth:'40%',float:'left'}}>
                    <Button onClick={() => router.push('/bussiness/manufacturer/trash')} className="danger">ذباله دان</Button>
                </div>
                <div style={{clear:'both'}}></div>
        {
                    !data?
                    <p style={{textAlign:'center'}}>داده ای وجود ندارد</p>
                    :
                    data?.data.map((item:any) => {
                return (
            <>
                <Sheet key={item.id} sx={{background:'none'}}>
                  <List
                    aria-labelledby="ios-example-demo"
                    className="card"
                  >
                    <ListItem nested>
                      <List
                        aria-label="Personal info"
                        sx={{ '--ListItemDecorator-size': '72px' }}
                      >
                        <ListItem>
                          <div>
                            <Typography fontSize="xl">{item.title}</Typography>
                            
                            <Tooltip title='حذف' >

                            <Button
                              variant="plain"
                              color="danger"
                              endDecorator={'D'}
                              onClick={() => deletehandle(item.id)}
                              style={{position:'absolute',top:'0',left:'0'}}
                              className="delete-btn"
                            />
                            </Tooltip>
                            

                            <Tooltip title="ویرایش">

                            <Button
                              variant="plain"
                              color="danger"
                              endDecorator={<RiPencilLine />}
                              onClick={() => edithandle(item.id)}
                              style={{position:'absolute',top:'0',left:'40px'}}
                              className="edit-btn"
                            />
                            </Tooltip>
                            
                          </div>
                        </ListItem>
                        
                      </List>
                    </ListItem>
                  </List>
                </Sheet>
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
            ({`ID: `})  حذف تولید کننده
        </Typography>
        
        <Typography component='h3' id="alert-dialog-modal-description" textColor="text.tertiary">
            جهت ادامه روند حذف روی دکمه تایید کلیک نمایید
        </Typography>
        <Typography className="text-danger" id="alert-dialog-modal-description" textColor="text.tertiary">
            با حذف تولید کننده امکان غیر فعال شدن تمامی محتوا وابسته به این مورد وجود دارد.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
            انصراف
            </Button>
            <Button variant="solid" color="danger" onClick={() => handleDeleteDepo()}>
            تایید 
            </Button>
        </Box>
        </ModalDialog>
    </Modal>

    </main>    
    )
}