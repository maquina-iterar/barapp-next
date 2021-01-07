import ListadoBares from "components/bares/ListadoBares";
import Head from "next/head";
import auth0 from "../libs/initAuth0";

export default function Home({ user }) {
  return (
    <>
      <Head>
        <title>Drinx</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ListadoBares user={user} />
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
