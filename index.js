const express = require("express");
const router = require("./src/routes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/api/v1/", router);

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
