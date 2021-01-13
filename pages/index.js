import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import auth0 from "../libs/initAuth0";

const ListadoBares = dynamic(import("components/bares/ListadoBares"));

export default function Home({ user }) {
  const router = useRouter();
  const { near, by } = router.query;

  return (
    <>
      <Head>
        <title>Drinx</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ListadoBares user={user} near={near} by={by} />
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
