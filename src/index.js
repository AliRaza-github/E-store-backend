const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const productRoute = require("./router/productRoute")
const userRoute = require("./router/authRoute");
const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT;

const app = express()
app.use(express.json());
app.use("/api/users", userRoute);

app.use("/api/product", productRoute)

mongoose.connect(mongoUri).then(() => {
    app.listen(port, () => {
        console.log(`App is running at port ${port}`);
        console.log("DB is connected");
    })
}).catch((error) => {
    console.log("DB connection error", error)
})


