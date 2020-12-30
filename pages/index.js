import ListadoBares from "components/bares/ListadoBares";
import Head from "next/head";
import auth0 from "./api/utils/auth0";

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
  return {
    props: {
      user: session?.user ?? null,
    },
  };
}
