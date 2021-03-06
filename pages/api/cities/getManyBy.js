const cities = require("all-the-cities");
const Fuse = require("fuse.js");

const getManyBy = async (req, res) => {
  try {
    const { search } = req.query;

    // const options = {
    //   keys: ["name", "country"],
    //   shouldsort: false,
    // };

    //const fuse = new Fuse(cities, options);
    //const result = fuse.search(search);

    // {
    //   cityId: 1129077,
    //   name: 'Sangalak-i-Kaisar',
    //   altName: '',
    //   country: 'AF',
    //   featureCode: 'PPLA2',
    //   adminCode: '07',
    //   population: 0,
    //   loc: { type: 'Point', coordinates: [Array] } //[long,lat]
    // }

    const regex = new RegExp(search, "i");

    const result = cities.filter((city) =>
      regex.test(`${city.name}, ${city.country}`)
    );

    res.status(200).json(result.slice(0, 100));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "get_cities_by_failed" });
  }
};

export default getManyBy;
