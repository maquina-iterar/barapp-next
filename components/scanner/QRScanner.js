import React, { useState } from "react";
import Layout from "../Layout";
import { makeStyles } from "@material-ui/core/styles";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";

import useMyLocation, {
  useLocationPermission,
} from "components/hooks/useMyLocation";
import {
  useCameraPermission,
  requestCameraPermission,
} from "components/hooks/useMyCamera";
import permissionOptions from "components/hooks/permissionOptions";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import GrantedIcon from "@material-ui/icons/Done";
import PromptIcon from "@material-ui/icons/HelpOutline";
import DeniedIcon from "@material-ui/icons/Block";
import { green, red, blue } from "@material-ui/core/colors";
import isValidHttpUrl from "libs/isValidHttpUrl";

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

const steps = {
  permissions: "permissions",
  scanner: "scanner",
  menu: "menu",
};

const QRScanner = ({ user }) => {
  const classes = useStyles();

  const [location, updateLocation] = useMyLocation();
  const [cameraId, setCameraId] = useState("initial");
  const [currentStep, setCurrentStep] = useState(steps.permissions);
  const [menuUrl, setMenuUrl] = useState(null);

  const locationPermission = useLocationPermission(location);
  const cameraPermission = useCameraPermission(cameraId);

  return (
    <Layout backUrl="/" user={user}>
      {currentStep === steps.permissions && (
        <PermissionsStep
          locationPermission={locationPermission}
          cameraPermission={cameraPermission}
          updateLocation={updateLocation}
          setCameraId={setCameraId}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === steps.scanner && (
        <ScanQRStep setCurrentStep={setCurrentStep} setMenuUrl={setMenuUrl} />
      )}
      {currentStep === steps.menu && <MenuStep menuUrl={menuUrl} />}
    </Layout>
  );
};

export default QRScanner;

const MenuStep = ({ menuUrl }) => {
  return <div>{menuUrl}</div>;
};

const PermissionsStep = ({
  locationPermission,
  cameraPermission,
  updateLocation,
  setCameraId,
  setCurrentStep,
}) => {
  const classes = useStyles();

  const canGoNext =
    locationPermission === permissionOptions.granted &&
    cameraPermission === permissionOptions.granted;

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
            <ListItem
              disabled={cameraPermission === permissionOptions.denied}
              button
              onClick={async () => {
                const resultId = await requestCameraPermission();
                setCameraId(resultId);
              }}
            >
              <ListItemIcon>
                {cameraPermission === permissionOptions.granted && (
                  <GrantedIcon style={{ color: green[500] }} />
                )}
                {cameraPermission === permissionOptions.prompt && (
                  <PromptIcon style={{ color: blue[500] }} />
                )}
                {cameraPermission === permissionOptions.denied && (
                  <DeniedIcon style={{ color: red[500] }} />
                )}
              </ListItemIcon>
              <ListItemText primary="Usar mi cámara" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      <div
        style={{
          position: "absolute",
          width: "100%",
          left: 0,
          bottom: 0,
          padding: 20,
          paddingBottom: 60,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          disabled={!canGoNext}
          style={{ position: "relative", maxWidth: 560 }}
          variant={"contained"}
          size={"large"}
          color={"primary"}
          fullWidth
          onClick={() => {
            updateLocation();
            setCurrentStep(steps.scanner);
          }}
        >
          Siguiente
        </Button>
      </div>
    </>
  );
};

const ScanQRStep = ({ setCurrentStep, setMenuUrl }) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant={"h5"} className={classes.title}>
        Escaneá el QR
      </Typography>
      <QrReader
        style={{ width: "100%" }}
        delay={300}
        facingMode={"user"}
        onError={(error) => console.error("qrreader: ", error)}
        onScan={(data) => {
          console.log("qrreader data: ", data);

          const dataStr = data ?? "";

          if (isValidHttpUrl(dataStr)) {
            setMenuUrl(dataStr);
            setCurrentStep(steps.menu);
          }
        }}
      />
    </>
  );
};
