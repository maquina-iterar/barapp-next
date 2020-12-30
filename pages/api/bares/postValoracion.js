const db = require("monk")(process.env.MONGO_DB);

const postValoracion = async (req, res) => {
  try {
    const { barId, valoracion } = req.body;

    const valoracionesPermitidas = ["megusta", "nomegusta"];

    if (!valoracionesPermitidas.includes(valoracion.toLowerCase())) {
      res.status(409).json({
        error: "post_valoracion_invalid",
        params: { barId, valoracion },
      });
    }

    const isLike = valoracion.toLowerCase() === "megusta";

    const bares = await db.get("bares");
    const valoraciones = await db.get("valoraciones");

    const incrementar = isLike ? { meGusta: 1 } : { noMeGusta: 1 };

    valoraciones.createIndex({ barId: 1, userId: 1 }, { unique: true });

    await valoraciones.insert({
      barId: barId,
      valor: valoracion.toLowerCase(),
      userId: request.user.sub,
      userInfo: request.user["https://info.barapp.com/"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    });

    await bares.update({ _id: barId }, { $inc: incrementar });

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "post_valoracion_failed" });
  } finally {
    db.close();
  }
};

export default postValoracion;
