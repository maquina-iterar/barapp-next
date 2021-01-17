import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  position: {
    alignSelf: "flex-start",
    display: "flex",
    justifyContent: "center",
    maxWidth: "100%",
    flexDirection: "column",
  },
  title: {
    fontWeight: 800,
    color: "#232326",
  },
  subtitle: {
    fontWeight: 800,
    color: "#232326",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 20,
  },
});

const NearByPosicion = ({ value }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <div className={classes.position}>
      <Typography variant={"button"} className={classes.title}>
        {`Bares cerca de:`}
      </Typography>
      <Chip
        label={value}
        onDelete={() => {
          router.push("/");
        }}
        color="secondary"
        variant="outlined"
        className={classes.subtitle}
      />
    </div>
  );
};

export default NearByPosicion;
