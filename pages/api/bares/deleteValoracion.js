import auth0 from "../../../libs/initAuth0";
import differenceInDays from "date-fns/differenceInDays";

const db = require("monk")(process.env.MONGO_DB);

const MIN_DAYS_COUNT = 1;

const deleteValoracion = auth0.requireAuthentication(async (req, res) => {
  try {
    const { user } = await auth0.getSession(req);

    const { barId } = req.body;

    const valoraciones = await db.get("valoraciones");

    const valoracion = await valoraciones.findOne({
      barId: barId,
      userId: user.sub,
      deletedAt: null,
    });

    const daysFromCreated = differenceInDays(
      new Date(),
      new Date(valoracion.createdAt)
    );

    console.log("daysFromCreated", daysFromCreated);

    if (daysFromCreated < MIN_DAYS_COUNT) {
      res
        .status(409)
        .json({ error: "delete_valoracion_minimun_date_required" });
      return;
    }

    await valoraciones.findOneAndUpdate(
      { barId: barId, userId: user.sub, deletedAt: null },
      { $set: { deletedAt: new Date().toISOString() } }
    );

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "delete_valoracion_failed" });
  } finally {
    db.close();
  }
});

export default deleteValoracion;
