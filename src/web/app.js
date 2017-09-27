const express = require('express')
const app = express()

// Load API routes
var normalizedPath = require("path").join(__dirname, "api");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./api/" + file)(app);
});


app.listen(3000, function() {
  console.log('Bill listening on port 3000!')
})

app.get('/', function(req, res) {
  res.send('Hello World!')
})

module.exports = app
