const db = require("monk")(process.env.MONGO_DB);

const getManyByLocation = async (req, res) => {
  try {
    const { latitude, longitude, search, skip } = req.query;

    if (!latitude || !longitude) {
      res.status(200).json([]);
      return;
    }

    const skipNum = skip ? +skip : 0;

    const bares = await db.get("bares");

    const filters =
      search && search.length > 0
        ? {
            nombre: new RegExp(search, "gi"),
          }
        : {};

    const result = await bares.find(
      {
        ...filters,
        ubicacion: {
          $near: {
            $geometry: { type: "Point", coordinates: [+latitude, +longitude] },
            //$maxDistance: 60000,
          },
        },
      },
      { limit: 10, skip: skipNum }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "get_bares_failed" });
  } finally {
    db.close();
  }
};

export default getManyByLocation;
