import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
