import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Link from "next/link";
import User from "../assets/icons/User";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatar: ({ hasPhoto }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    border: hasPhoto ? "none" : "3px solid #232326",
    fontWeight: 800,
    textTransform: "uppercase",
    width: 32,
    height: 32,
  }),
  user: {
    paddingTop: 10,
  },
}));

const LoginButton = ({ user }) => {
  const classes = useStyles({ hasPhoto: user?.picture ? true : false });

  return (
    <>
      {!user && (
        <div className={classes.user}>
          <IconButton
            disabled={!user}
            color="inherit"
            onClick={() => loginWithRedirect()}
            className={classes.user}
          >
            <User />
          </IconButton>
        </div>
      )}
      {user && (
        <div className={classes.user}>
          <Link href={"/account"} passHref>
            <IconButton color="inherit" component={"a"}>
              <Avatar
                className={classes.avatar}
                src={user.picture}
                alt={user.nickname}
              >
                {user.name[0].toUpperCase()}
              </Avatar>
            </IconButton>
          </Link>
        </div>
      )}
    </>
  );
};

export default LoginButton;
