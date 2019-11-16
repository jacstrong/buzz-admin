const express = require('express')
const path = require('path')
const cors = require('cors')
const logger = require('morgan')
const history = require('connect-history-api-fallback')

const app = express();
app.use(logger('tiny'))
app.use(cors());
app.use(history())
app.use(express.static(path.join(__dirname, 'dist')));
const port = process.env.PORT || 3031;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
