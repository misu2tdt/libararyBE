require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes"); // thêm routes user
//const authorRoutes = require("./routes/authorRoutes"); // thêm routes author

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/authors", authorRoutes);  // nếu bạn đã tạo

app.get("/", (req, res) => {
  res.send("Library API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
