const { join } = require("path");

function appRoutes(app) {
  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "../../public", "index.html"));
  });
}

module.exports = appRoutes;
