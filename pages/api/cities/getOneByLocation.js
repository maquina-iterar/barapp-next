const nearbyCities = require("nearby-cities");

const MAX_RESULTS = 1;

const getOneByLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      console.error(error);
      res.status(409).json({ error: "get_city_by_location_missing_location" });
      return;
    }

    const [myCity] = nearbyCities(
      {
        latitude: +latitude,
        longitude: +longitude,
      },
      MAX_RESULTS
    );

    res.status(200).json(myCity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "get_city_by_location_failed" });
  }
};

export default getOneByLocation;
