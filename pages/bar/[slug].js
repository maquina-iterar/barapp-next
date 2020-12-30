import DetalleBar from "components/bares/DetalleBar";
import Head from "next/head";
import { useRouter } from "next/router";
import auth0 from "pages/api/utils/auth0";

export default function Bar({ user }) {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Head>
        <title>Drinx</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DetalleBar user={user} slug={slug} />
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
