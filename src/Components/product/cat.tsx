import { Box, Button, Card, Divider, Grid, Typography } from "@mui/joy";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItemButton from '@mui/joy/ListItemButton';
import Sheet from '@mui/joy/Sheet';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Cat(props:any) {
    const router = useRouter()
    const [cat1, setCat1] = useState<any>();
    const [cat2, setCat2] = useState<any>();
    const [cat3, setCat3] = useState<any>();
    const [cat4, setCat4] = useState<any>();
    const [cat, setCat] = useState({
        cat1:{title:'',uniqueId:''},
        cat2:{title:'',uniqueId:''},
        cat3:{title:'',uniqueId:''},
        cat4:{title:'',uniqueId:''},
    });
    useEffect(() => {
        server(0,'c1')

        
    },[props.cats])

    useEffect(() => {
        console.log(props.cats);

        async function getCat() {
            
            if (props.update && props.detail) {
                if (props.cats.cat1) {
                    const c = cat1.filter((e: { uniqueId: any; })=> e.uniqueId === props.cats.cat1)
                    //console.log('cat: ',c);
                    await server(props.cats.cat1,'c2',c[0])

                    if (props.cats.cat2) {
                        const c = cat2.filter((e: { uniqueId: any; })=> e.uniqueId === props.cats.cat2)
                        //console.log('cat: ',c);
                        await server(props.cats.cat2,'c3',c[0])
                    }
                    if (props.cats.cat3) {
                        const c = cat3.filter((e: { uniqueId: any; })=> e.uniqueId === props.cats.cat3)
                        //console.log('cat: ',c);
                        await server(props.cats.cat3,'c4',c[0])
                    }
                    if (props.cats.cat4) {
                        const c = cat4.filter((e: { uniqueId: any; })=> e.uniqueId === props.cats.cat4)
                        //console.log('cat: ',c);
                        await server(props.cats.cat4,'c5',c[0])
                    }

                }else{
                    setCat({
                        cat1:{title:'',uniqueId:''},
                        cat2:{title:'',uniqueId:''},
                        cat3:{title:'',uniqueId:''},
                        cat4:{title:'',uniqueId:''},
                    })
                    setCat2(undefined)
                    setCat3(undefined)
                    setCat4(undefined)
                }
                
            }
        }
        getCat();

    }, [cat1])

    // useEffect(() => {

    //     async function getCat() {
    //         if (props.update) {
    //             if (props.cats.cat2) {
    //                 const c = cat2.filter((e: { uniqueId: any; })=> e.uniqueId === props.cats.cat2)
    //                 //console.log('cat: ',c);
    //                 await server(props.cats.cat2,'c3',c[0])
    //             }else{
    //                 setCat({...cat,
    //                     cat2:{title:'',uniqueId:''},
    //                 })
    //                 setCat3(undefined)
    //             }
                
    //         }
    //     }
    //     getCat();

    // }, [cat2])

    // useEffect(() => {

    //     async function getCat() {
    //         if (props.update) {
    //             if (props.cats.cat3) {
    //                 const c = cat3.filter((e: { uniqueId: any; })=> e.uniqueId === props.cats.cat3)
    //                 //console.log('cat: ',c);
    //                 await server(props.cats.cat3,'c4',c[0])
    //             }else{
    //                 setCat({...cat,
    //                     cat3:{title:'',uniqueId:''},
    //                 })
    //                 setCat4(undefined)
    //             }
                
    //         }
    //     }
    //     getCat();

    // }, [cat3])

    // useEffect(() => {

    //     async function getCat() {
    //         if (props.update) {
    //             if (props.cats.cat4) {
    //                 const c = cat4.filter((e: { uniqueId: any; })=> e.uniqueId === props.cats.cat4)
    //                 //console.log('cat: ',c);
    //                 await server(props.cats.cat4,'c5',c[0])
    //             }else{
    //                 setCat({...cat,
    //                     cat4:{title:'',uniqueId:''},
    //                 })
    //             }
                
    //         }
    //     }
    //     getCat();

    // }, [cat4])
    

    const server = async (unique:any,c:string,item:any={}) => {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/product_cat/select_detail/${unique}`, {
                    method: 'POST',
                    headers: {
                        'lang': props.lang
                    },
                }).then(async (res:any) => {
                    let d = await res.json()
                    switch(c) {
                        case 'c1':
                           setCat1(d)
                        break
                        case 'c2':
                            setCat({...cat,
                                cat1:item,
                                cat2:{title:'',uniqueId:''},
                                cat3:{title:'',uniqueId:''},
                                cat4:{title:'',uniqueId:''},
                            })
                            setCat2(d)
                        break
                        case 'c3':
                            setCat({...cat,
                                cat2:item,
                                cat3:{title:'',uniqueId:''},
                                cat4:{title:'',uniqueId:''},
                            })
                           setCat3(d)
                        break
                        case 'c4':
                            setCat({...cat,
                                cat3:item,
                                cat4:{title:'',uniqueId:''},
                            })
                            setCat4(d)
                        break
                        default:
                            setCat({...cat,
                                cat4:item,
                            })
                            break
                    }
                })
                if (router.query.unique) {
                    document.body.classList.remove('loading')
                  } 
            }catch(e) {

            }

      
    }
    return (
        <Box component='section'>
            <Grid container>
            <Grid xs={12}>
                <Typography component='h2'>
                    انتخاب دسته بندی
                </Typography>
                <br />
                <Divider />
                <p><br /></p>
            </Grid>

                <Grid xs={6} sm={6} md={3} lg={3}>
                    <Sheet
                    variant="outlined"
                    sx={{
                        maxHeight: 300,
                        overflow: 'auto',
                        borderRadius: 'sm',
                        margin:0.3
                    }}
                    className='card'
                    >
                    <List>
                        <ListItem nested>
                            <ListSubheader sticky
                            className='card card-title'
                            >Category 1</ListSubheader>
                            <Divider />
                            <List>
                            {cat1&&cat1.map((item:any, index:any) => (
                                <ListItem key={index}>
                                <ListItemButton
                                onClick={() => {
                                    props.changed()
                                    server(item.uniqueId,'c2',item)
                                }}
                                >{item.title}</ListItemButton>
                                </ListItem>
                            ))}
                            </List>
                        </ListItem>
                    </List>
                    </Sheet>
                </Grid>

                <Grid xs={6} sm={6} md={3} lg={3}>
                <Sheet
                    variant="outlined"
                    sx={{
                        maxHeight: 300,
                        overflow: 'auto',
                        borderRadius: 'sm',
                        margin:0.3
                    }}
                    className='card'
                    >
                    <List>
                    <ListItem nested>
                            <ListSubheader sticky
                            className='card card-title'
                            >Category 1</ListSubheader>
                            <Divider />
                            <List>
                            {cat2&&cat2.map((item:any, index:any) => (
                                <ListItem key={index}>
                                <ListItemButton
                                onClick={() => {
                                    props.changed()
                                    server(item.uniqueId,'c3',item)
                                }}
                                >{item.title}</ListItemButton>
                                </ListItem>
                            ))}
                            </List>
                        </ListItem>
                    </List>
                    </Sheet>
                </Grid>

                <Grid xs={6} sm={6} md={3} lg={3}>
                <Sheet
                    variant="outlined"
                    sx={{
                        maxHeight: 300,
                        overflow: 'auto',
                        borderRadius: 'sm',
                        margin:0.3
                    }}
                    className='card'
                    >
                    <List>
                    <ListItem nested>
                            <ListSubheader sticky
                            className='card card-title'
                            >Category 1</ListSubheader>
                            <Divider />
                            <List>
                            {cat3&&cat3.map((item:any, index:any) => (
                                <ListItem key={index}>
                                <ListItemButton
                                onClick={() => {
                                    server(item.uniqueId,'c4',item)
                                }}
                                >{item.title}</ListItemButton>
                                </ListItem>
                            ))}
                            </List>
                        </ListItem>
                    </List>
                    </Sheet>
                </Grid>

                <Grid xs={6} sm={6} md={3} lg={3}>
                <Sheet
                    variant="outlined"
                    sx={{
                        Height: 300,
                        overflow: 'auto',
                        borderRadius: 'sm',
                        margin:0.3
                    }}
                    className='card'
                    >
                    <List>
                    <ListItem nested>
                            <ListSubheader sticky
                            className='card card-title'
                            >Category 1</ListSubheader>
                            <Divider />
                            <List>
                            {cat4&&cat4.map((item:any, index:any) => (
                                <ListItem key={index}>
                                <ListItemButton
                                onClick={() => {
                                    setCat({...cat,cat4:item})

                                }}
                                >{item.title}</ListItemButton>
                                </ListItem>
                            ))}
                            </List>
                        </ListItem>
                    </List>
                    </Sheet>
                </Grid>
            </Grid>
            <Card
                sx={{padding:20, marginTop:3,position:'relative'}}
                className='card'
            >
                <List orientation="horizontal" style={{float:'right'}}>
                <ListItem>
                    <ListItemButton>دسته اتخابی:</ListItemButton>
                </ListItem>
                                <ListItem>
                                <ListItemButton>{cat.cat1.title}</ListItemButton>
                                </ListItem>
                                <ListItem>
                                <ListItemButton>{cat.cat2.title}</ListItemButton>
                                </ListItem>
                                <ListItem>
                                <ListItemButton>{cat.cat3.title}</ListItemButton>
                                </ListItem>
                                <ListItem>
                                <ListItemButton>{cat.cat4.title}</ListItemButton>
                                </ListItem>

                </List>
                <Button size="md" style={{float:'left',maxWidth:50,position:'absolute',left:10}}
                onClick={() => {
                    if (cat.cat1.uniqueId) {
                        document.body.classList.add('loading')
                        props.getCat(cat)
                    }else{
                        alert('dont select cat')
                    }
                }}
                >تایید</Button>
            </Card>
        </Box>

    )
}