import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import auth0 from "libs/initAuth0";
import { getBarBySlug } from "pages/api/bares/getOneBySlug";

const DetalleBar = dynamic(import("components/bares/DetalleBar"));

export default function Bar({ user, bar }) {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Head>
        <title>Drinx - {bar.nombre}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DetalleBar user={user} slug={slug} value={bar} />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await auth0.getSession(context.req);
  const user = session?.user ?? null;

  const { slug } = context.query;

  const bar = await getBarBySlug(slug, user?.sub);

  return {
    props: {
      user,
      bar,
    },
  };
}
