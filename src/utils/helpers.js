const { badRequest, notFound, serverError, forbidden } = require('./responses');

// General error handler with status-based routing
function handleError(res, err, defaultMessage= 'Something went wrong') {
    const { status = 500, message = defaultMessage } = err;
    const responses = {
        400: badRequest,
        403: forbidden,
        404: notFound,
        500: serverError
    };
    return (responses[status] || responses[500])(res, message);
    }

// Standardized not found check with custom entity name
function handleNotFoundDocument(res, doc, id, entity = 'Item') {
  if (!doc) {
    return notFound(res, `${entity} with id ${id} not found`);
  }
  return res.send(doc);
}

// Handles Mongoose validation errors
function handleValidationError(res, err) {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    res.status(400).json({ error: errors });
    return true;
  }
  return false;
}

module.exports = {
  handleError,
  handleNotFoundDocument,
  handleValidationError,
};
