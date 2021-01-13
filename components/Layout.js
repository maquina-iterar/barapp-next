import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import LoginButton from "./LoginButton";
import Back from "../assets/icons/Back";
import Logo from "assets/Logo";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    flexGrow: 1,
    "&::after": {
      content: '""',
      top: 0,
      left: 0,
      position: "absolute",
      height: "30vh",
      width: "100%",
      background: theme.palette.primary.main,
      zIndex: -200,
    },
  },
  topbar: {
    background: theme.palette.primary.main,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    paddingTop: 10,
    flexGrow: 1,
    color: "#232326",
    fontWeight: "bold",
    fontSize: theme.typography.pxToRem(28),
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
}));

const Layout = ({ children, backUrl, title, addLogo, user }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="relative" elevation={0} className={classes.topbar}>
        <Toolbar style={{ paddingRight: 5 }}>
          {backUrl && (
            <Link href={backUrl} passHref>
              <IconButton edge="start" color="inherit" component={"a"}>
                <Back />
              </IconButton>
            </Link>
          )}
          <div className={classes.title}>
            {addLogo && (
              <Link href={"/"} passHref>
                <a>
                  <Logo />
                </a>
              </Link>
            )}
            {title && <Typography variant="h6">{title}</Typography>}
          </div>
          <LoginButton user={user} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" className={classes.container}>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
