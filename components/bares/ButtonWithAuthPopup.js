import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Link from "next/link";
import { useRouter } from "next/router";

const ButtonWithAuthPopup = ({ user, color, disabled, onClick, children }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();

  const handleClickOpen = () => {
    if (!user) {
      setOpen(true);
    }
    if (user && onClick) {
      onClick();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        color={color}
        disableRipple={disabled}
        disableFocusRipple={disabled}
        disableTouchRipple={disabled}
        onClick={disabled ? null : handleClickOpen}
      >
        {children}
      </IconButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
        onClose={handleClose}
        aria-labelledby="auth-popup-dialog"
      >
        <DialogTitle id="auth-popup-dialog">Info para votar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Iniciá sesión para votar, esto es necesario porque solo podés votar
            una vez.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cerrar
          </Button>
          <Link href={`/api/login?redirectTo=${router.asPath}`} passHref>
            <Button
              component={"a"}
              color="secondary"
              autoFocus
              onClick={() => setOpen(false)}
            >
              Ingresar
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ButtonWithAuthPopup;
