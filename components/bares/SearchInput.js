import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    borderRadius: 32,
    width: "100%",
  },
  input: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const SearchInput = ({ onCancel, onSearchChange }) => {
  const classes = useStyles();
  const refSetTimeout = useRef(null);

  return (
    <div style={{ width: "100%" }}>
      <Paper className={classes.root}>
        <InputBase
          id="component-simple"
          autoFocus
          className={classes.input}
          placeholder="Buscar"
          inputProps={{ "aria-label": "search" }}
          onChange={(event) => {
            const text = event.target.value;

            if (refSetTimeout.current) clearTimeout(refSetTimeout.current);

            refSetTimeout.current = setTimeout(() => onSearchChange(text), 500);
          }}
        />
        <IconButton
          className={classes.iconButton}
          aria-label="cancel search"
          onClick={onCancel}
          color="secondary"
        >
          <CancelIcon />
        </IconButton>
      </Paper>
    </div>
  );
};

export default SearchInput;
