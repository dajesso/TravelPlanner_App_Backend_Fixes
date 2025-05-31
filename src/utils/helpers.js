const { badRequest, notFound, serverError, forbidden } = require('./responses');

// General error handler with status-based routing
function handleError(res, err, defaultMessage= 'Something went wrong') {
  // Extract status code and message from error object; defaults to 500 and defaultMessage
  const { status = 500, message = defaultMessage } = err;

  // Map status codes to corresponding response functions
  const responses = {
    400: badRequest,
    403: forbidden,
    404: notFound,
    500: serverError,
  };

    // Call the appropriate response function or fallback to serverError
    /*It chooses an appropriate error response function (like badRequest, notFound, etc.) based on the HTTP status code stored in status.
    If no function is found for that status, it falls back to responses[500].
    Then, it calls the chosen function with the res (response object) and message. */
    return (responses[status] || responses[500])(res, message);
}


// Standardized not found check with custom entity name
/** Parameters:
 * doc: The document retrieved from the database
 * entity: The type of thing you're looking for — like "Trip" or "Category". Defaults to "Item" if not specified.
*/
function handleNotFoundDocument(res, doc, id, entity = 'Item') {
  // Sends a 404 Not Found response if the document is null/undefined
  if (!doc) {
    // If no document is found (doc is falsy), it sends a 404 error like: "Trip with id 1234 not found".
    return notFound(res, `${entity} with id ${id} not found`);
  }
  return res.send(doc);
}

// Handles Mongoose validation errors
function handleValidationError(res, err) {
  if (err.name === 'ValidationError') {
    // Extracts and collects all validation error messages
    /*Original validation error:
    {
      name: "ValidationError",
      errors: {
        amount: { message: "Amount is required" },
        category: { message: "Category must be valid" }
      }
    }
    
    */
  /** turns the object into an array of its values 
   (just the values, not the keys).
   This goes through each error object in the array and pulls out just the message from each one
  */
  const errors = Object.values(err.errors).map(e => e.message);

  // Sends a 400 Bad Request response with all validation errors
  res.status(400).json({ error: errors });

  // indicates validation error was handled
  return true;
  }
  // indicates it was not a validation error
  return false;
}

module.exports = {
  handleError,
  handleNotFoundDocument,
  handleValidationError,
};
