import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles({
  root: {
    width: "100%",
    borderRadius: 8,
    boxShadow: "0px 5px 20px -5px rgba(0, 0, 0, 0.25)",
  },
  media: {
    height: 140,
    position: "relative",
  },
});

const BarLoading = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <Skeleton animation="wave" variant="rect" className={classes.media} />
        <CardContent style={{ paddingBottom: 24 }}>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            style={{
              fontWeight: "bold",
              color: "#434347",
              display: "block",
              flex: 1,
            }}
          >
            <Skeleton animation="wave" height={32} width="80%" />
          </Typography>
          <Typography
            variant="body2"
            component="p"
            style={{
              color: "#83848C",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Skeleton animation="wave" height={20} width="80%" />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BarLoading;
