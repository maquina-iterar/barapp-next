const isValidHttpUrl = (value) => {
  let url;

  try {
    url = new URL(value);
  } catch (error) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export default isValidHttpUrl;
