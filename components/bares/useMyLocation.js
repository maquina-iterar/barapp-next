import { useState, useEffect } from "react";
import store from "store2";
import axios from "axios";

const useMyLocation = () => {
  const [location, setLocation] = useState(store("latestLocation") ?? []);

  const updateLocation = async () => {
    const current = await getCurrentLocation();

    setLocation(current);
    store("latestLocation", current);
  };

  useEffect(() => {
    const action = async () => {
      try {
        if (location && location.length !== 2) {
          const { data } = await axios.get("https://freegeoip.app/json/");

          setLocation([data.latitude, data.longitude]);
          store("latestLocation", [data.latitude, data.longitude]);
        }
      } catch (error) {
        console.error("useMyLocation freegeoip", error);
      }
    };

    action();
  }, [location, setLocation]);

  return [location, updateLocation];
};

export default useMyLocation;

export const permissionOptions = {
  loading: "loading",
  granted: "granted",
  prompt: "prompt",
  denied: "denied",
};

export const useLocationPermission = () => {
  const [state, setState] = useState(permissionOptions.loading);

  const refreshPermission = async () => {
    setState(permissionOptions.loading);

    if (navigator.permissions) {
      const { state } = await navigator.permissions.query({
        name: "geolocation",
      });

      setState(state);
    }
  };

  useEffect(() => {
    refreshPermission();
  }, [setState]);

  return [state, refreshPermission];
};

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      const success = ({ coords }) => {
        resolve([coords.latitude, coords.longitude]);
      };

      const error = (err) => {
        reject(err);
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      reject(new Error("geolocation no available"));
    }
  });
};
