import express from "express";
import exphbs from "express-handlebars";
import path from "node:path";
import cookieParser from "cookie-parser";
import "dotenv/config";
import siteRoutes from "./routes/site-routes.js";
import navbar from "./middlewars/navbar-middlewars.js";
import userRoutes from "./routes/user-routes.js";
import { checkUser } from "./middlewars/user-middleware.js";
const PORT = process.env.PORT || 3000;
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
});

const app = express();
app.use(cookieParser());
app.use(navbar)
app.use(checkUser)
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join("src", "views"));
app.use(express.urlencoded({ extended: true }));
app.use(siteRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () =>
    console.log(`Server is running http://localhost:${PORT}`)
);