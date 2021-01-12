import dynamic from "next/dynamic";
import Head from "next/head";
import auth0 from "../libs/initAuth0";
import Router from "next/router";
import { useEffect } from "react";

const Usuario = dynamic(import("components/usuario/Usuario"));

export default function Account({ user }) {
  useEffect(() => {
    if (!user) {
      Router.replace("/");
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Drinx - Mi Cuenta</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Usuario user={user} />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await auth0.getSession(context.req);
  const user = session?.user ?? null;

  return {
    props: {
      user,
    },
  };
}
