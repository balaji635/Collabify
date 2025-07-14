const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB=require('./utiles/dbUtiles')
const userRoutes=require('./routes/authRoutes');
const problemRouter = require('./routes/problemRoutes');
const app = express();
const port = process.env.PORT || 4000;

connectDB()
app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => { // Fixed: added response
    console.log("link is '/' ");
    res.json({ message: "Server is running" });
});

app.use("/user",userRoutes)
app.use("/problem",problemRouter)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});