import dynamic from "next/dynamic";
import Head from "next/head";
import auth0 from "../libs/initAuth0";

const QRScanner = dynamic(import("components/scanner/QRScanner"));

export default function Scan({ user }) {
  return (
    <>
      <Head>
        <title>Drinx - QR</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QRScanner user={user} />
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
