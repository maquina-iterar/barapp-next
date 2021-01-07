import auth0 from "../../libs/initAuth0";

const callback = async (req, res) => {
  try {
    await auth0.handleCallback(req, res, { redirectTo: "/" });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
};

export default callback;
