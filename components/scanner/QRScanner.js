import React from "react";
import Layout from "../Layout";
import { makeStyles } from "@material-ui/core/styles";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";

const QrReader = dynamic(() => import("react-qr-reader"), {
  loading: () => <span>loading...</span>,
  ssr: false,
});

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 800,
    color: "#232326",
    marginBottom: 20,
  },
}));

const QRScanner = ({ user }) => {
  const classes = useStyles();

  return (
    <Layout backUrl="/" user={user}>
      <Typography variant={"h5"} className={classes.title}>
        Escaneá el QR
      </Typography>
      <QrReader
        style={{ width: "100%" }}
        delay={300}
        onError={(error) => console.error("qrreader: ", error)}
        onScan={(data) => console.log("qrreader data: ", data)}
      />
    </Layout>
  );
};

export default QRScanner;
