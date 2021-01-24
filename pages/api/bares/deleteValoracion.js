import auth0 from "../../../libs/initAuth0";

const db = require("monk")(process.env.MONGO_DB);

const deleteValoracion = auth0.requireAuthentication(async (req, res) => {
  try {
    const { user } = await auth0.getSession(req);

    const { barId } = req.body;

    const valoraciones = await db.get("valoraciones");

    const result = await valoraciones.findOneAndUpdate(
      { barId: barId, userId: user.sub, deletedAt: null },
      { $set: { deletedAt: new Date().toISOString() } }
    );

    console.log("result", result, barId, user.sub);

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "post_valoracion_failed" });
  } finally {
    db.close();
  }
});

export default deleteValoracion;
