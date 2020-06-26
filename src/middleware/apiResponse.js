const { ResourceNotFoundError, InvalidParameterError,
  InternalError } = require('../errors');

module.exports.apiErrorResponse = (error) => {
  if (error instanceof ResourceNotFoundError) {
    return errorResponse(404, error.message);
  } else if (error instanceof InvalidParameterError) {
    return errorResponse(422, error.message);
  } else if (error instanceof InternalError) {
    return errorResponse(500, error.message);
  }
  return errorResponse(500, error.message);
};

module.exports.apiResponse = apiResponse;

function errorResponse(errorCode, error_message) {
  const body = { code: errorCode, message: error_message };
  return apiResponse(errorCode, body);
}

function apiResponse(httpCode, object = {}) {
  return { statusCode: httpCode, body: JSON.stringify(object) };
}
