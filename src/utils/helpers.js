const { badRequest, notFound, serverError, forbidden } = require('./responses');

// General error handler with status-based routing
function handleError(res, err, defaultMessage) {
  if (err.status === 404) return notFound(res, err.message);
  if (err.status === 403) return forbidden(res, err.message);
  if (err.status === 400) return badRequest(res, err.message);
  return serverError(res, err.message || defaultMessage);
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
