import useFetch from "@/Hooks/useFetch";
import { Avatar, Button, Chip, List, ListItem, ListItemDecorator, Sheet, Skeleton, Tooltip, Typography } from "@mui/joy";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";
export default function ArticleCat(props:any) {
  const router = useRouter()
    const {postData, response, status} = useFetch()

    useEffect(() => {
        postData(`product_cat/get_ext`,{id:props.id})
    }, [])

    useEffect(() => {
        console.log(response);
        
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
                            <Avatar size="lg" sx={{ '--Avatar-size': '60px' }} src={response?.img&&`${process.env.NEXT_PUBLIC_API_URL}${response.img.url}`}>
                              {props.title[0]}
                            </Avatar>
                          </ListItemDecorator>
                          <div>
                            <Typography fontSize="xl">{props.title}</Typography>
                            <Typography fontSize="xs" component='span'>
                               زبانها : 
                               {
                                  !response?<Skeleton sx={{margin:'5px'}} height={10} width={30} /> :
                                  response.lang&&response.lang.map((v:any,i:any)=> <Chip onClick={() => props.langDelete(v.lang)} sx={{marginRight:'5px'}} key={i}>{v.lang}</Chip>) 
                                }
                            </Typography>
                            <Tooltip title={`${response?.cid} عدد`} variant="soft">
                              <Button
                                    size="sm"
                                    variant="outlined"
                                    color="primary"
                                    style={{position:'absolute',top:'20',left:'0'}}
                                    onClick={() => router.push(`/bussiness/categories/${props.uniqueId}`)}
                                    >
                                    زیر دسته ها
                                </Button> 
                              </Tooltip>
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