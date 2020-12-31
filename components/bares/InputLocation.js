import React, { useState, useEffect, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const InputLocation = ({ onChange }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!open || loading) {
      return undefined;
    }

    const action = async () => {
      setLoading(true);

      const response = await fetch(
        `${window.location.origin}/api/cities/getManyBy?search=${search}`
      );
      const cities = await response.json();

      /*
      {
          "cityId":3039154,
          "name":"El Tarter",
          "altName":"",
          "country":"AD",
          "featureCode":"PPL",
          "adminCode":"02",
          "population":1052,
          "loc":
              {
                  "type":"Point",
                  "coordinates":[1.65362,42.57952]
              }
          }
      */
      setOptions(
        cities.map(({ name, country, loc }) => ({
          name: `${name}, ${country}`,
          location: loc,
        }))
      );
      setLoading(false);
    };

    action();
  }, [open, search, setLoading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
    }
  }, [open, inputRef]);

  return (
    <Autocomplete
      fullWidth={true}
      freeSolo
      openOnFocus
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      loadingText="¿Por dónde salimos hoy?"
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, value) => {
        if (onChange) onChange(value);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          placeholder={"Seleccioná una ubicación"}
          onChange={(event) => setSearch(event.target.value)}
          variant="standard"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default InputLocation;
