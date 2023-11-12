import useFetch from "@/Hooks/useFetch";
import __separate from "@/Libs/separate";
import { Avatar, Box, Button, Chip, IconButton, List, ListDivider, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Sheet, Skeleton, Tooltip, Typography } from "@mui/joy";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillMoneyCollect, AiFillSetting, AiOutlineMoneyCollect } from "react-icons/ai";
import { RiArrowLeftSLine, RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";
import { TfiMoney, TfiSearch, TfiSettings } from "react-icons/tfi";

export default function ServiceList(props:any) {
    const router = useRouter()
    const {postData, response, status} = useFetch()
    const [lang, setLang] = useState<any>()

    useEffect(() => {
        postData(`service/get_ext`,{id:props.id})

    }, [])

    useEffect(() => {
        console.log(response);
        if (response) {
            setLang(response.defaultLang)
        }
    }, [response])

    return (
        <>
            <Sheet key={props.id} sx={{background:'none'}}>
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
                            {response?
                            <Avatar size="lg" sx={{ '--Avatar-size': '60px' }} 
                            src={response?.img&&`${process.env.NEXT_PUBLIC_API_URL}${response.img.url}`}>
                              {props.title[0]}
                            </Avatar>
                            :
                            <Skeleton animation="wave" variant="circular" width={60} height={60} />
                            }
                          </ListItemDecorator>
                          <div>
                            <Typography fontSize="xl">{props.title}</Typography>
                            <Typography fontSize="xs">
                               زبانها : 
                               {
                                  !response?<Skeleton sx={{margin:'5px'}} height={10} width={30} /> :
                                  response.lang&&response.lang.map((v:any,i:any)=> 
                                  <Chip onClick={() => {
                                    if (props.recover) {
                                      return false
                                    }
                                    props.langDelete(v.lang)
                                  }} 
                                  sx={{marginRight:'5px'}} key={i}>{v.lang}</Chip>
                                  ) 
                                }
                                <Typography fontSize="sm"
                                    sx={{paddingRight:25}}
                                >
                                    {response?.cat?response.cat.title:<Skeleton animation="wave" variant="text" sx={{ width: 120,marginLeft:2 }} />}
                                    </Typography>
                            </Typography>
                            
                            <Tooltip title={props.delTool} variant="soft">

                            <Button
                              variant="plain"
                              color="danger"
                              endDecorator={props.delIcon}
                              onClick={() => props.deletehandle(props.uniqueId)}
                              style={{position:'absolute',top:'0',left:'0'}}
                              className="delete-btn"
                            />
                            </Tooltip>
                            {
                              props.edithandle
                              &&

                            <Tooltip title="ویرایش" variant="soft">

                            <Button
                              variant="plain"
                              color="danger"
                              endDecorator={<RiPencilLine />}
                              onClick={() => props.edithandle(props.uniqueId)}
                              style={{position:'absolute',top:'0',left:'40px'}}
                              className="edit-btn"
                            />
                            </Tooltip>
                            }
                          </div>
                        </ListItem>


                      </List>
                    </ListItem>
                  </List>
                </Sheet>
        </>
    )
}