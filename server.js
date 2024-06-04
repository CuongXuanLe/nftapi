const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });
// console.log(process.env);
//mongodb+srv://cuongle200222:Cuonglee322002@cluster0.bhc3jdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
