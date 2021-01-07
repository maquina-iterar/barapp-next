import auth0 from "../../../libs/initAuth0";

const db = require("monk")(process.env.MONGO_DB);

const getOneBySlug = async (req, res) => {
  try {
    const session = await auth0.getSession(req);
    const user = session?.user ?? null;

    const { slug } = req.query;

    const bar = await getBarBySlug(slug, user?.sub);

    res.status(200).json(bar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "get_bar_by_slug_failed" });
  } finally {
    db.close();
  }
};

export default getOneBySlug;

export const getBarBySlug = async (slug, userId) => {
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

  return { ...result, _id: result._id.toString(), miValoracion };
};
