const app = require("express")();
const morgan = require("morgan");
const mongose = require("mongoose");
const bodyParse = require('body-parser')
require("dotenv/config");
const api = process.env.API_URL;
const authJwt = require('./Auth/jwtAuth')
const errorHandeler = require('./Auth/error-handler')


//Middleware
//For see req exm(GET /api/v1/product 304 - - 4.302 ms)
app.use(morgan("tiny"));

//Cannot read the body(req.body.name) property...thats use body-parse
app.use(bodyParse.json())
app.use(authJwt())
app.use(errorHandeler)


//Router
app.use(`${api}/products`,require('./routers/productRoute'))
app.use(`${api}/categories`,require('./routers/categoryRoute'))
app.use(`${api}/users`,require('./routers/userRoute'))
app.use(`${api}/order`,require('./routers/orderRoute'))




mongose
  .connect(process.env.mongoose_url)
  .then((res) => {
  //  console.log("db-name",res.connection.name)
    console.log("database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen("3000", () => {
  console.log("server run at port 3000");
});
