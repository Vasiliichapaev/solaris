const express = require("express");
const bodyParser = require("body-parser");
const proxy = require('express-http-proxy')

exports = module.exports = bot => {
    const server = express();

    server.use(bodyParser.json());

    server.get("/", (req, res) => {
        res.send("Solaris");
    });


    server.post(/^\/hook/, (req, res) => {
        if (req.body.challenge){
            res.send(req.body.challenge);
            return
        }
        if (req.body.event) {
            res.send("OK");
            bot.discord_bot.stream_start(req.body.event);
        }
    });

    
   server.use(
      '/proxy',
      proxy('http://example.com', {
        proxyReqPathResolver: (req) => {
          console.log(req.url)
          return req.url
        },
      })
    ); 

    server.listen(process.env.PORT || 5000);
    console.log(process.env.PORT);
};

