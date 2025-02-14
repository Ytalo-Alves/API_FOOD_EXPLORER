const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require('../configs/auth')

function EnsureAuthenticated(request, response, next){
  const authHeaders = request.headers.authorization;

  if(!authHeaders) {
    throw new AppError('Token not provided', 401)
  }

  const [, token ] = authHeaders.split(' ');

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    request.user = {
      id: Number(user_id),
    }

    return next()
  } catch {
    throw new AppError('Token invalid', 401)
  }
}

module.exports = EnsureAuthenticated;