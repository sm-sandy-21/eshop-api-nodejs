const expressJwt = require('express-jwt')

function authJwt() {
      const secret = process.env.secret
      return expressJwt({
            secret: secret,
            //form http://jwt.io find algo
            algorithms:['HS256'],
            isRevoked: isRevoked
      }).unless({
            path: [
                  {url:/\/api\/v1\/products(.*)/ ,method:['GET','OPTION']},
                  {url:/\/api\/v1\/categories(.*)/ ,method:['GET','OPTION']},
                  {url:/\/api\/v1\/orders(.*)/ ,method:['POST']},
                  '/api/v1/users/login',
                  '/api/v1/users/resister'
            ]
      })
      
}
async function isRevoked(req,payload,done) {
      if (!payload.isAdmin) {
            done(null,true)
      }
      done()
}
module.exports = authJwt;