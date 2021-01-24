import React from "react";
import Layout from "../Layout";
import { makeStyles } from "@material-ui/core/styles";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";
import useMyLocation, {
  useLocationPermission,
  permissionOptions,
} from "components/hooks/useMyLocation";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import GrantedIcon from "@material-ui/icons/Done";
import PromptIcon from "@material-ui/icons/HelpOutline";
import DeniedIcon from "@material-ui/icons/Block";
import { green, red, blue } from "@material-ui/core/colors";

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

  const [location, updateLocation] = useMyLocation();

  const locationPermission = useLocationPermission(location);

  return (
    <Layout backUrl="/" user={user}>
      <PermissionsStep
        locationPermission={locationPermission}
        updateLocation={updateLocation}
      />
      {/* {<ScanQRStep />} */}
    </Layout>
  );
};

export default QRScanner;

const PermissionsStep = ({ locationPermission, updateLocation }) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant={"h5"} className={classes.title}>
        Permisos requeridos
      </Typography>
      <Card>
        <CardContent>
          <List aria-label="permissions required" disablePadding>
            <ListItem
              disabled={locationPermission === permissionOptions.denied}
              button
              onClick={() => updateLocation()}
            >
              <ListItemIcon>
                {locationPermission === permissionOptions.granted && (
                  <GrantedIcon style={{ color: green[500] }} />
                )}
                {locationPermission === permissionOptions.prompt && (
                  <PromptIcon style={{ color: blue[500] }} />
                )}
                {locationPermission === permissionOptions.denied && (
                  <DeniedIcon style={{ color: red[500] }} />
                )}
              </ListItemIcon>
              <ListItemText primary="Usar mi ubicación actual" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <GrantedIcon />
              </ListItemIcon>
              <ListItemText primary="Usar mi cámara" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </>
  );
};

const ScanQRStep = () => {
  const classes = useStyles();

  return (
    <>
      <Typography variant={"h5"} className={classes.title}>
        Escaneá el QR
      </Typography>
      <QrReader
        style={{ width: "100%" }}
        delay={300}
        onError={(error) => console.error("qrreader: ", error)}
        onScan={(data) => console.log("qrreader data: ", data)}
      />
    </>
  );
};
