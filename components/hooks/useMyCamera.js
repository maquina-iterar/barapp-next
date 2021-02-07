import { useState, useEffect } from "react";
import permissionOptions from "./permissionOptions";

export const requestCameraPermission = async () => {
  try {
    if (navigator.mediaDevices) {
      const result = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user" },
      });

      const cameraId = result.id;

      result.getTracks().forEach((track) => {
        track.stop();
      });

      return cameraId;
    }
  } catch (error) {
    console.error("requestCameraPermission", error);
  }

  return "fail";
};

export const useCameraPermission = (camera) => {
  const [state, setState] = useState(permissionOptions.loading);

  useEffect(() => {
    const refreshPermission = async () => {
      if (state !== permissionOptions.granted) {
        setState(permissionOptions.loading);

        if (navigator.permissions) {
          const { state: newState } = await navigator.permissions.query({
            name: "camera",
          });

          setState(newState);
        }
      }
    };

    refreshPermission();
  }, [setState, camera]);

  return state;
};
