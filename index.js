const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const addressRoutes = require("./routes/addressRoutes");

dotenv.config();
const app = express();

app.listen(5000, () => console.log("Server running on port 5000"));
app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api/addresses", addressRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
