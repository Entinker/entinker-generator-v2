let jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET

let checkToken = (type, optional) => {

    return (req, res, next) => {
      try {
        
      let token = req.headers['x-access-token'] || req.headers['authorization'] || (req.signedCookies && req.signedCookies.token); // Express headers are auto converted to lowercase
      if (!token) {
        if (optional) {
          return next()
        }


       throw new customErrorResponse({
          status: 401,
          message: 'Auth token is not supplied'
        });
      }
  
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
  

      if (token) {
  
        jwt.verify(token, jwt_secret, (err, decoded) => {
          if (err) {
            throw new customErrorResponse({
              status: 401,
              message: 'Token is not valid'
            });
          } else if (!checkType(decoded.type, type)) { //Token type is invalid
  
            if (optional == true) {
              return next()
            }
            throw new customErrorResponse({
              error: 401,
              message: 'Unauthorized user type'
            })
          } else {
            req.user = decoded;
            next();
          }
        });
      } else {
        throw new customErrorResponse({
          error: 401,
          message: 'Auth token is not supplied'
        });
      }
    } catch(error) {

      next(error)
    }

    }
  };

  let signToken = (data, exp) => {
    exp = exp || '180 days'
    return jwt.sign(data, jwt_secret, {
      expiresIn: exp
    })
  }

  let checkType = (decoded_type, type) => {

    if (Array.isArray(type)) {
      return type.indexOf(decoded_type) != -1
    }
    return decoded_type == type
  }

  module.exports = {
    checkToken,
    signToken,
  }