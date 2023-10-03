import { Box, Card, Checkbox, Divider, FormControl, FormLabel, Grid, Input, Option, Select, Typography } from "@mui/joy";
import { FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react"
import { json } from "stream/consumers";

export default function Attribute(props:any) {
    const [attr, setAttr] = useState<any>()
    const [attrValue, setAttrValue] = useState<any[]>([])


    useEffect(() => {
        if (props.attrData && props.update) {
            //console.log(JSON.parse(props.attrData.data));

            setAttrValue(JSON.parse(props.attrData.data))
        }
        server()

    }, [])

    useEffect(() => {
        props.getAttr(attrValue)
    }, [attrValue])

    const server = async () => {
        //console.log(props.cat);
        
        
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/attribute/select/gp/cat`,{
            method: 'POST',
            headers: {
                'lang': props.lang,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({cid:props.cat})
        }).then(async (res) => {
            let d = await res.json()
            //console.log(attrValue);
            setAttr(d)
            //console.log('Result: ',d);
        })
        .catch((e:any) => console.log('Error: ',e))
    }
    return(
        <Box component='section'>
            <Card className='card'>
            <Typography component='h3'>خصوصیات کالا
            <FormControlLabel
                    sx={{float:'left'}}
                    control={<Switch defaultChecked 
                        checked={true}
                    sx={{paddingLeft:2,marginBottom:1.5}} />} label="گروه ها را در سایت نشان نده" /> 
            </Typography>
            <Divider />
            <Grid container spacing={1}>
            {
                attr && attr.map((v:any,i:any) => {
                    return(
                        <>
                                <Grid key={v.id} xs={12}>
                                    <Typography component='h3'>{v.title}</Typography>
                                </Grid>
                                {
                                    v.child.map((item:any, index:any) => {
                                        const k = item.id
                                        const value:any = attrValue.filter(b => b.id === k)
                                        //console.log('vvvvvvv: ',value);
                                        
                                        if (item.type === 'input') {
                                            return(<Grid key={item.index} xs={12} sm={6} md={4} lg={4}>
                                            <FormControl>
                                                {item.title}
                                                <FormLabel sx={{width:'98%'}}>
                                                    <Input
                                                    value={value.length?value[0].value:''}
                                                    placeholder=''
                                                    size="lg"
                                                    fullWidth
                                                    onChange={(e:any) => {
                                                        const chang = attrValue.filter(e=> e.id !== k)
                                                            //console.log(chang);
                                                            setAttrValue([...chang,{id:k,value:e.target.value}])
                                                    }}
                                                    />
                                                </FormLabel>
                                            </FormControl>
                                            </Grid>)
                                        }else if (item.type === 'select') {
                                            return(<Grid key={item.id} xs={12} sm={6} md={4} lg={4}>
                                                <FormControl>
                                                    <FormLabel sx={{width:'98%'}}>
                                                        {item.title}
                                                        <Select
                                                        value={value.length?value[0].value:''}
                                                        size="lg"
                                                        sx={{width:'100%'}}
                                                        onChange={(e, val) => {
                                                            const chang = attrValue.filter(e=> e.id !== k)
                                                            //console.log(chang);
                                                            setAttrValue([...chang,{id:k,value:val}])
                                                        }}
                                                        >
                                                            <Option value=''>یک گزینه انتخاب کنید</Option>
                                                            {
                                                                JSON.parse(item.data).map((itm:any,ind:any)=>{
                                                                    return(
                                                                        <Option key={ind} value={itm}>{itm}</Option>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </FormLabel>
                                                </FormControl>
                                            </Grid>)
                                        }else {
                                            return(<Grid key={item.id} xs={12} sm={6} md={4} lg={4}>
                                                <FormControl>
                                                {item.title}
                                                    <Box sx={{ display: 'inline-block', gap: 6, wordWrap:'break-word' }}>
                                                    {JSON.parse(item.data).map((itm:any,ind:any)=>{
                                                        return(
                                                        <Checkbox key={ind} label={itm} sx={{marginRight:'16px'}}/>
                                                        )
                                                    })}
                                                    </Box>
                                                </FormControl>
                                                </Grid> )
                                        }
                                    })
                                }


    </>
                    )
                   
                })

            }
            </Grid>

            {/* 
            
                    this is attribute maked by category
            */}
            </Card>
        </Box>
    )
}

{/* 

*/}