const cities = require("all-the-cities");
const Fuse = require("fuse.js");

const getManyBy = async (req, res) => {
  try {
    const { search } = req.query;

    const options = {
      keys: ["name", "country"],
      shouldSort: false,
    };

    const fuse = new Fuse(cities, options);
    const result = fuse.search(search);

    res.status(200).json(result.slice(0, 100).map((x) => x.item));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "get_cities_by_failed" });
  }
};

export default getManyBy;
