const express = require("express");
const secretRouter = express.Router(); // Corrected to Router()

const {
  fetchSecrets,
  addSecret,
  deleteSecret,
  updateSecret,
} = require("../controller/secretcontroller");

secretRouter.get("/", fetchSecrets);
secretRouter.post("/add", addSecret);
secretRouter.put("/update/:id", updateSecret);
secretRouter.delete("/delete/:id", deleteSecret);

module.exports = secretRouter;
