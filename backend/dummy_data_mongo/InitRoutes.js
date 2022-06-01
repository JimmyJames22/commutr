const { routeFinder } = require("./RouteFinder");
const { userMap } = require("./UserMap");

exports.initRoutes = async (req, res) => {
  const { dest_id, dest_place_id } = req.body;
  await userMap(dest_id, dest_place_id);
  await routeFinder(dest_id);
  res.end("made routes");
};
