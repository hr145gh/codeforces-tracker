const express= require("express");
const mongoose= require("mongoose");
const cors= require("cors");
require("dotenv").config();

const problemRoutes= require("./routes/problemRoutes");
const codeforcesRoutes= require("./routes/codeforcesRoutes");

const app= express();
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());

const PORT= process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Codeforces tracker API running🍾");
});

app.use("/api/problems", problemRoutes);
app.use("/api/codeforces", codeforcesRoutes);

console.log("codeforces route loaded");
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log('Server running on http://localhost:5000');
        });
    })
    .catch((error) => {
        console.log("MongoDb connection failed");
        console.log(error);
    });