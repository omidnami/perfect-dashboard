import Header from "@/Components/header";
import Menu from "@/Components/menu";
import useFetch from "@/Hooks/useFetch";
import Container from "@/Layouts/Continer";
import { Avatar, Box, Button, Card, Chip, ChipDelete, Divider, List, ListDivider, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Modal, ModalDialog, Sheet, Skeleton, Switch, Table, Tooltip, Typography } from "@mui/joy";
import { CircularProgress, Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line, RiPencilLine, RiArrowLeftSLine, RiFileWarningFill } from "react-icons/ri";

export default function Users() {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const {postData, response, status} = useFetch()
  const [data, setData] = useState({data:[],total:0,per_page:10,current_page:1})
  const [page, setPage] = useState(1)
  const [deletId, setDeleteId] = useState(0);

  useEffect(() => {
    if (router.query.page) {
      setPage(Number(router.query.page))
    }
    postData(`user/select?page=${page}`,null)
    
  }, [router])

  useEffect(() => {
    if (response?.total) {
      setData(response)
    }
    if (response?.status) {
      router.push(`/users/?page=${page}`)
      setOpen(false)
    }
    document.body.classList.remove('loading')
    
  }, [response])

  const handleChange = (e:any, v:any) => {
    router.push('?page='+v)
    
  }
  const handleEdit = (id:any) => {
    router.push(`/users/${id}`)
  }

  const handleDelete = async (id:any) => {
     setDeleteId(id)
      setOpen(true)
  }

  const handleDeleteUser = () => {
    if (deletId) {
      postData('user/delete',{id:deletId})
    }
  }

    return (
        <main className='main'>
        <Menu />
        <Container>
            <Header />
        <h1 style={{marginTop:'25px',marginBottom:'25px'}}> لیست کاربران</h1>

        {
          !data?
                <CircularProgress sx={{textAlign:'center',margin:'48%',marginTop:'40px'}} disableShrink />
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
                          <ListItemDecorator>
                            <Avatar size="lg" sx={{ '--Avatar-size': '60px' }}>
                              {item.fname[0]}
                            </Avatar>
                          </ListItemDecorator>
                          <div>
                            <Typography fontSize="xl">{item.fname+' '+item.lname}</Typography>
                            <Typography fontSize="xs">
                              omidnami , مدیر
                            </Typography>
                            <Tooltip title="حذف" variant="soft">

                            <Button
                              variant="plain"
                              color="danger"
                              endDecorator={<RiDeleteBin6Line />}
                              onClick={() => handleDelete(item.id)}
                              style={{position:'absolute',top:'0',left:'0'}}
                              className="delete-btn"
                            />
                            </Tooltip>
                            <Tooltip title="ویرایش" variant="soft">

                            <Button
                              variant="plain"
                              color="danger"
                              endDecorator={<RiPencilLine />}
                              onClick={() => handleEdit(item.id)}
                              style={{position:'absolute',top:'0',left:'40px'}}
                              className="edit-btn"
                            />
                            </Tooltip>
                          </div>
                        </ListItem>
                        <ListDivider inset="startContent" />
                        <ListItem>
                          <ListItemButton>
                            <ListItemContent>
                              <Link href={'tel:'+item.phone}>{item.phone}</Link>
                              <span style={{paddingRight:'30px'}}>{item.email}</span>
                            </ListItemContent>
                            <RiArrowLeftSLine fontSize="xl3" />
                          </ListItemButton>
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
   

    <Card className='card'>
      <Pagination 
      count={data?Math.ceil(data.total/data.per_page):0} 
      size="large"
      page={page} 
      onChange={(e,v) => handleChange(e,v)}
      />
    </Card>
    

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
             ({`ID: ${deletId}`}) حذف کاربر
          </Typography>
          
          <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
            جهت ادامه روند حذف روی دکمه تایید کلیک نمایید
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button variant="solid" color="danger" onClick={() => handleDeleteUser()}>
              تایید 
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
        </Container>
        </main>
    )
}