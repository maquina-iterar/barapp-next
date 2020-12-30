const db = require("monk")(process.env.MONGO_DB);

const getOneBySlug = async (req, res) => {
  try {
    const { slug, userId } = req.query;

    const bares = await db.get("bares");

    const result = await bares.findOne({ slug });

    let miValoracion = null;

    if (result && userId) {
      const barId = result._id.toString();

      const valoraciones = await db.get("valoraciones");
      const valoracion = await valoraciones.findOne({
        barId,
        userId,
      });

      miValoracion = valoracion ? valoracion.valor : null;
    }

    res.status(200).json({ ...result, miValoracion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "get_bar_by_slug_failed" });
  } finally {
    db.close();
  }
};

export default getOneBySlug;
