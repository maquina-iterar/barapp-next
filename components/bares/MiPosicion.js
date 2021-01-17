import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import LocationIcon from "@material-ui/icons/GpsFixed";
import { makeStyles } from "@material-ui/core/styles";
import {
  useLocationPermission,
  permissionOptions,
} from "components/bares/useMyLocation";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import LocationIlu from "assets/ilustraciones/Location";

const useStyles = makeStyles({
  position: {
    alignSelf: "flex-start",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    flexDirection: "column",
  },
  title: {
    fontWeight: 800,
    color: "#232326",
  },
});

const MiPosicion = ({ value, onFindMe }) => {
  const classes = useStyles();

  const locationPermission = useLocationPermission(value);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);

  const findMeButtonEnabled = [
    permissionOptions.prompt,
    permissionOptions.granted,
  ].includes(locationPermission);

  return (
    <div className={classes.position}>
      <Typography variant={"h5"} className={classes.title}>
        Bares cerca tuyo
      </Typography>
      <div style={{ display: "flex" }}>
        <Button
          disabled={!findMeButtonEnabled}
          onClick={() => {
            if (locationPermission === permissionOptions.prompt) {
              setOpen(true);
            }
            if (locationPermission === permissionOptions.granted) {
              if (onFindMe) onFindMe();
            }
          }}
        >
          <LocationIcon />
          &nbsp; Usar mi ubicación actual
        </Button>
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="permission-popup-dialog"
      >
        <DialogContent
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div style={{ textAlign: "center", padding: 20, paddingBottom: 0 }}>
            <LocationIlu style={{ height: 180, width: 200 }} />
          </div>
          <DialogTitle
            id="permission-popup-dialog"
            style={{ textAlign: "center" }}
          >
            Encontrá bares cerca tuyo
          </DialogTitle>
          <DialogContentText>
            Para ver los bares que están cerca tuyo <br />
            te vamos a pedir permiso para ver tu ubicación.
          </DialogContentText>
        </DialogContent>

        <DialogActions
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color="secondary"
            variant={"outlined"}
            style={{ width: 220, height: fullScreen ? 60 : "auto" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              if (onFindMe) {
                onFindMe();
              }
            }}
            variant={"contained"}
            color="primary"
            autoFocus
            style={{ width: 220, height: fullScreen ? 60 : "auto" }}
          >
            Habilitar mi ubicación
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MiPosicion;
