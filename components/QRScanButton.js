import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import QRCodeScanner from "assets/icons/QRCodeScanner";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  container: {
    marginRight: 5,
  },
}));

const QRScanButton = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Link href={"/scan"} passHref>
        <IconButton color="inherit" component={"a"}>
          <QRCodeScanner />
        </IconButton>
      </Link>
    </div>
  );
};

export default QRScanButton;
