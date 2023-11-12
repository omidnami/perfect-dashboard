import type { AppProps } from 'next/app'
import RootLayout from '@/Layouts/layout'
import 'bootstrap/dist/css/bootstrap.css';
import '@/globals.css'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ConfContext from '@/Context/ConfConext';
import ThemplateContext from '@/Context/ThemplateContext';
import axios from 'axios';
import '@/ckeditor.css'
import '@/placeholder.css'
interface CONF {
  title: string;
  domain: string;
  logoDark: string;
  logoLight: string;
  defaultLang: string;

}
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [dataConf, setDataConf] = useState<CONF>({
    title:'',
    domain:'',
    logoDark:'',
    logoLight:'',
    defaultLang:''
  })
  const [template, setTemplate] = useState<any>({
    type: "",
    name:"",
    plugins: [],
    position: [],
    product_plugins: [],
    slider_plugin: [],
    menu_position: [],
    config: [],
    lang: []
  })


        React.useEffect(() =>{
          console.log('_app component');
          
          document.body.classList.add('loading')
          if (!localStorage.getItem('_lang_')) {
              localStorage.setItem('_lang_','EN')
          }
          console.log('log: ',dataConf);
          
        },[router])

        useEffect(() => {
          fetch(process.env.NEXT_PUBLIC_API_URL+'/api/v1/getConf/'+localStorage.getItem('_lang_'))
          .then(async (react) => { 
            const config = await react.json()
            setDataConf(config)
            //get them
            
            
            const them = await fetcher(config.domain+'conf.json')
            
            setTemplate(them)
            console.log(them);
            
          })
          .catch(e => {
            console.log('get_Conf_from_APP: ',e);
          })

        },[])
        return (
          <ConfContext.Provider value={dataConf}>
            <ThemplateContext.Provider value={template}>
              <RootLayout>
                  <Component />                    
              </RootLayout>
            </ThemplateContext.Provider>
          </ConfContext.Provider>
                

        )
      }
      const fetcher = async (url:any) => {
        try {
          const response = await axios.get(url);          
          return response.data;
        } catch (error) {
          console.log(error);
          
          throw new Error('مشکلی در دریافت داده رخ داده است.');
        }
      };