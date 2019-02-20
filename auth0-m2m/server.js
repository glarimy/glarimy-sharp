const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const request = require("request");
require('dotenv').config();

const corsOptions =  {
  origin: 'http://localhost:8080'
};

app.use(cors(corsOptions));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  aud: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const checkScopes = jwtAuthz(['read:messages']);

app.get('/api/fetch/:id', checkJwt, function(req, res) {
  var options = { method: 'POST',
    url: 'https://glarimy-sharp.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"VEzrU20oyt8YidTR5qoNB9HtEKGp1z2p","client_secret":"XrMXidfBBS0X_UF6QPI11EX7IMYVs_1Lx00lmCto6ZCeSH1pVEcSmXuBjLRPpxl5","audience":"https://glarimy-sharp.auth0.com/api/v2/","grant_type":"client_credentials"}' };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var token = JSON.parse(body);
    request({
      "method": "GET",
      "url": "https://glarimy-sharp.auth0.com/api/v2/users/"+req.params.id,
      "headers": {"Authorization": "Bearer "+token.access_token}
    }, function(error, response, body){
      res.json(body);
    });
  });
});
app.listen(8081);