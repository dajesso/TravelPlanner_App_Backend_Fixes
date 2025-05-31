// This file handles the errors automatically:

// error handling for routes

// 403 Forbidden, 401 Unauthorized, 404 Not Found, 400 Bad Request, 500 Internal Server Error

function notFound(res, message = 'Resource not found') {
  return res.status(404).send({ error: message });
};

function badRequest(res, message = 'Bad request') {
  return res.status(400).send({ error: message });
};


function unauthorized(res, message = 'Unauthorized') {
  return res.status(401).send({ error: message });
};


function forbidden(res, message = 'Forbidden') {
  return res.status(403).send({ error: message });
};


function serverError(res, message = 'Something went wrong on the server') {

  return res.status(500).send({ error: message });
};

// 201 success response

function goodRequest(res, email, userAccount, message = 'Good request') {
  return res.status(201).send({email, userAccount, message: message });
}

// format Mongoose validation errors
// the original error was too long
/*Raw Mongoose error:
json
{
  "category": {
    "name": "ValidatorError",
    "message": "category field is required",
    "properties": {
      "message": "category field is required",
      "type": "required",
      "path": "category"
    },
    ...
  }
}`
*/

function formatValidationErrors(errors) {
// Create an empty object to store the simplified error messages
  const simplifiedErrors = {};
  // Loop through each key (field name) in the original Mongoose errors object
  for (const field in errors) {
    // we only want 'message' property
    simplifiedErrors[field] = { message: errors[field].message };
  }
  return simplifiedErrors;
};


module.exports = {
  notFound,
  badRequest,
  serverError,
  unauthorized,
  forbidden,
  goodRequest,
  formatValidationErrors
};

