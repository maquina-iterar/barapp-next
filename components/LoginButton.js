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
    paddingTop: 5,
  },
}));

const LoginButton = ({ user }) => {
  const classes = useStyles({ hasPhoto: user?.picture ? true : false });

  return (
    <>
      {!user && (
        <Link href={"/api/login"} passHref>
          <IconButton color="inherit" component={"a"}>
            <User />
          </IconButton>
        </Link>
      )}
      {user && (
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
      )}
    </>
  );
};

export default LoginButton;
