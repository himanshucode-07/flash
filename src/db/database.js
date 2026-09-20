import mongoose from "mongoose";

mongoose.connect("mongodb+srv://himanshusinghthakur23_db_user:<VETXr6RmqHgfY4Rp>@cluster0.xhbnlce.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB se connect ho gaya!"))
  .catch((err) => console.log("Connection fail hua:", err));