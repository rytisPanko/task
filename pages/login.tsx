import React from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { Provider } from 'next-auth/providers';
import { getProviders, getSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import logoGoogle from '../public/assets/logo-google.svg'



//Nurodo, kokios savybės bus perduodamos Login komponentui
type LoginProps = {
  csrfToken: any,
  providers: Provider[],
}


//dvi pusės ekranas - vienoje pusėje yra pasisveikinimo tekstas, 
//kitoje pusėje yra prisijungimo mygtukai
const Login: NextPage<LoginProps> = ({ providers }) => {
  return (
    <>
      <Head>
    <title>TASK | Prisijungimo puslapis</title>
    <meta charSet="utf-8" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
</Head>
<div className='flex flex-row w-screen h-screen'>
    <div className='w-2/4 bg-orange h-full flex justify-center items-center text-center'>
        <div className='p-2 w-[320px] border-y-2 border-white'>
            <h1 className='text-white text-hXL font-bold'> Sveiki atvykę į Task app!</h1>
        </div>
    </div>
    <div className='w-2/4 bg-black h-full flex justify-center items-center'>
        <div className='h-[96px] flex flex-col justify-between items-center  '>
            <h1 className='text-white text-hXL tracking-S'>PRISIJUNGTI</h1>
            <div className='flex flex-row justify-between w-[420px]'>
              {
                //mygtukų ciklas , kuris generuoja prisijungimo mygtukus pagal 
                //turimus prisijungimo tiekėjus 
                Object.values(providers).map((provider) => {
                  return (
                    <div key={provider.name}>
                      <button  className='ml-28 flex justify-center items-center w-[200px] h-[48px] bg-white p-2 rounded-[24px] text-hM text-orange-500' onClick={() => signIn(provider.id)}>
                        Sign in with {provider.name}
                        {provider.name === 'Google' && <Image src={logoGoogle} alt='logo google' className='w-7 ml-2' />}
                      </button>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


//patikrina, ar vartotojas jau yra prisijungęs (getSession). 
//Jei vartotojas yra prisijungęs,nukreipiamas į pagrindinį puslapį 
//Jei vartotojas nėra prisijungęs, funkcija grąžina prisijungimo tiekėjus 
//(getProviders()), kuriuos naudoja Login komponentas mygtukų generavimui.
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }
  else return {
    props: {
      providers: await getProviders(),
    },
  }
}

export default Login;