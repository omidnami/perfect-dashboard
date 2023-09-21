import { ClassNames } from "@emotion/react"
import { Button, List, ListItem, ListItemButton, ListItemContent, ListItemDecorator } from "@mui/joy"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { HiChevronDoubleLeft, HiComputerDesktop } from "react-icons/hi2"
const menus = [
    {
        id:1,
        title:'داشبورد',
        icone:<HiComputerDesktop />,
        link:'/',
        path:'',
        child:null,
    },
    {
        id:2,
        title:'مدیریت کاربران',
        icone:<HiComputerDesktop />,
        link:null,
        path:'users',
        child:[
            {title:' ایجاد کاربر جدید',icone:<HiComputerDesktop />, link:'/users/insert',},
            {title:'مدیریت کاربران',icone:<HiComputerDesktop />, link:'/users',},
            {title:' ذباله دان کاربری',icone:<HiComputerDesktop />, link:'/users/trash',}
        ],
    },
    {
        id:3,
        title:'مدیریت محتوا',
        icone:<HiComputerDesktop />,
        link:null,
        path:'content',
        child:[
            {title:' ایجاد مقاله',icone:<HiComputerDesktop />, link:null,},
            {title:' مدیریت مقالات',icone:<HiComputerDesktop />, link:null,},
            {title:' دسته بندی محتوا',icone:<HiComputerDesktop />, link:null,},
            {title:' پیشنویس',icone:<HiComputerDesktop />, link:null,},
            {title:'ایجاد صفحه',icone:<HiComputerDesktop />, link:null,},
            {title:'مدیریت صفحات',icone:<HiComputerDesktop />, link:null,}
        ],
    },
    {
        id:4,
        title:'مدیریت کسب و کار',
        icone:<HiComputerDesktop />,
        link:null,
        path:'bussiness',
        child:[
            {title:' دسته بندی کالا و خدمات',icone:<HiComputerDesktop />, link:'/bussiness/categories/0',},
            {title:' تولید کنندگان',icone:<HiComputerDesktop />, link:'/bussiness/manufacturer',},
            {title:' خصوصیات',icone:<HiComputerDesktop />, link:'/bussiness/attribute',},
            {title:' کالا ها',icone:<HiComputerDesktop />, link:'/bussiness/products',},
            {title:' خدمات',icone:<HiComputerDesktop />, link:'/bussiness/services',},
            {title:'پروژه ها',icone:<HiComputerDesktop />, link:'/bussiness/projects',},
        ],
    },
    {
        id:5,
        title:'انبار داری',
        icone:<HiComputerDesktop />,
        link:null,
        path:'depo',
        child:[
            {title:'تعریف انبار',icone:<HiComputerDesktop />, link:'/depo/insert/0',},
            {title:'مدیریت انبار ها',icone:<HiComputerDesktop />, link:'/depo/list/0',},
            {title:'موجودی انبار ها',icone:<HiComputerDesktop />, link:'/depo/products/',},
        ],
    },
    {
        id:5,
        title:'گزارشات',
        icone:<HiComputerDesktop />,
        link:null,
        path:'reports',
        child:[
            {title:' فروش و مالی',icone:<HiComputerDesktop />, link:null,},
            {title:' انبار',icone:<HiComputerDesktop />, link:null,},
            {title:'  دیدگاه ها',icone:<HiComputerDesktop />, link:null,},
            {title:' درخواست ها',icone:<HiComputerDesktop />, link:null,},
            {title:' وضعیت سایت',icone:<HiComputerDesktop />, link:null,}
        ],
    },
    {
        id:6,
        title:'تنظیمات',
        icone:<HiComputerDesktop />,
        link:null,
        path:'settings',
        child:[
            {title:' تنظیمات اصلی',icone:<HiComputerDesktop />, link:'/settings/base',},
            {title:' تنظیمان کسب وکار',icone:<HiComputerDesktop />, link:'settings/job',},
            {title:' تنظیمات پرداخت و حمل',icone:<HiComputerDesktop />, link:'settings/pay',},
            {title:' تنظیمات ظاهری',icone:<HiComputerDesktop />, link:'settings/style',},
            {title:' تنظیمات اطلاع رسانی',icone:<HiComputerDesktop />, link:'/settings/connects',}
        ],
    },
    {
        id:7,
        title:'پشتیبانی',
        icone:<HiComputerDesktop />,
        link:null,
        path:'support',
        child:[
            //{title:' مدیریت تیکت ها',icone:<HiComputerDesktop />, link:null,},
            {title:' مدیریت اطلاع رسانی',icone:<HiComputerDesktop />, link:null,},
            {title:'صفحه تماس',icone:<HiComputerDesktop />, link:null,},
            {title:'صفحه حریم خصوصی',icone:<HiComputerDesktop />, link:null,},
            {title:'صفحه قوانین و مقررات',icone:<HiComputerDesktop />, link:null,},
        ],
    },
    // {
    //     id:8,
    //     title:'تجارت الکترونیک',
    //     icone:<HiComputerDesktop />,
    //     link:'/',
    //     path:'content',
    //     child:[
    //         {title:' آنالیز سایت',icone:<HiComputerDesktop />, link:null,},
    //         {title:' مدیریت نقشه سایت',icone:<HiComputerDesktop />, link:null,},
    //         {title:'برسی محتوا',icone:<HiComputerDesktop />, link:null,},
    //         {title:' کمپین های تبلیغاتی',icone:<HiComputerDesktop />, link:null,},
    //         {title:'باشگاه مشتریان',icone:<HiComputerDesktop />, link:null,},
    //         {title:'بازاریابی (Afiliet Marketing)',icone:<HiComputerDesktop />, link:null,},
    //     ],
    // },
]
export default function Menu() {
    const router = useRouter()
    const [subMenu, setSubMenu] = useState(false)
    const [menu, setMenu] = useState<any>(null)
    const [path, setPath] = useState('')
    useEffect(() => {
        const continer = document.getElementById('uix-continer');
        continer?.addEventListener('click',() => {
                if (subMenu) {
                    setSubMenu(false)
                }
        })
        
    })
    useEffect(() => {
        let r = router.pathname
        let rr = r.split('/')
        setPath(rr[1])        
    }, [router])

    const onMenuOpenHandle = (id:Number) => {
        setMenu(null)
        setSubMenu(false)
        let m = menus.filter(e => e.id === id)
        if (m[0].child) {
            setMenu(m[0].child)
            setSubMenu(true)
        }else if (m[0].link) {
            router.push(m[0].link)
        }
        
    }

    const onMenuCloseHandle = () => {
        setSubMenu(false)
    }

    useEffect(() => {
        setSubMenu(false)
    }, [])
    return (
        <>
        <div className="menu">
            <div className="logo"></div>
            <nav>
                <List>
                    {
                        menus.map((item:any) => {
                            return (
                            <ListItem key={item.id}>
                                <ListItemButton selected={item.path === path} onClick={() => onMenuOpenHandle(item.id)}>
                                    <ListItemDecorator>{item.icone}</ListItemDecorator>
                                    <ListItemContent>{item.title}</ListItemContent>
                                    {item.child&&<HiChevronDoubleLeft />}
                                </ListItemButton>
                            </ListItem>
                            )
                        })
                    }
                </List>
            </nav>
            <Button className="primary" style={{width:'100%',marginTop:'22px'}}>نمایش سایت</Button>
        </div>
        {
            subMenu&&<div className="sub-menu menu">
                <div className="logo">
                    <Button onClick={() => onMenuCloseHandle()} style={{float:'left'}} variant="plain">X</Button>
                </div>
            <nav>
                <List>
                    {
                        menu && menu.map((item:any,index:any) => {
                            return (
                                <ListItem key={index}>
                                <ListItemButton onClick={() => {
                                    document.body.classList.add('loading')
                                    item.link&&router.push(item.link)
                                }
                                }>
                                    <ListItemDecorator><HiComputerDesktop /></ListItemDecorator>
                                    <ListItemContent>{item.title}</ListItemContent>
                                    {/* <HiChevronDoubleLeft /> */}
                                </ListItemButton>
                                </ListItem> 
                            )
                        })
                    }

                </List>
            </nav>
            </div>
        }
        
        </>
    )
}