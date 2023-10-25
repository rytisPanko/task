import React from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { Provider } from 'next-auth/providers';
import { getProviders, getSession, signIn } from 'next-auth/react';
import Head from 'next/head';


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
<div>
    <div>
        <div>
            <h1>Sveiki atvykę !</h1>
        </div>
    </div>
    <div>
        <div>
            <h1>PRISIJUNGTI</h1>
            <div>
              {
                //mygtukų ciklas , kuris generuoja prisijungimo mygtukus pagal 
                //turimus prisijungimo tiekėjus 
                Object.values(providers).map((provider) => {
                  return (
                    <div key={provider.name}>
                      <button  onClick={() => signIn(provider.id)}>
                        Sign in with {provider.name}
                        {provider.name === 'Google' }
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