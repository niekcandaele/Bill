const request = require('request');


// PING COMMAND
client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
    console.log(prefix);
  }
});

// 7 DAYS COMMAND
client.on('message', message => {
  if (message.content === '7days') {
    request('http://193.70.81.12:28248/api/getstats', function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log(body);
    });
  }
});
