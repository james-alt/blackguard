import * as express from "express";
import cors from "cors";
import path from "path";

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "../../static")));
app.listen(3000);
