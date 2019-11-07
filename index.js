const express = require('express')
const apiRoutes = require("./api-routes")

const PORT = process.env.PORT || 5000;

const app = express();

app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
});