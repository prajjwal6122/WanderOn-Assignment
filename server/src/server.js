import app from "./app.js";
import connectToDb from "./config/db.js";

connectToDb();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` WanderOn Auth Server is running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
});
