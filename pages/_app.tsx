import type { AppProps } from 'next/app'
import RootLayout from '@/Layouts/layout'
import 'bootstrap/dist/css/bootstrap.css';
import '@/globals.css'
import React from 'react';
import Lang from '@/Components/lang';
import { useRouter } from 'next/router';



export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

        React.useEffect(() =>{
          console.log('_app component');
          
          document.body.classList.add('loading')
          
          if (!localStorage.getItem('_lang_')) {
              localStorage.setItem('_lang_','EN')
          }

        },[router])
        return (

              <RootLayout>
                  <Component />                    
              </RootLayout>
                

        )
      }
