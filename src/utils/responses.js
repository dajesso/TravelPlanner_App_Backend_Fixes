// error handling for routes
export function notFound(res, message = 'Resource not found') {
  return res.status(404).send({ error: message });
};

export function badRequest(res, message = 'Bad request') {
  return res.status(400).send({ error: message });
};

export function serverError(res, message = 'Something went wrong on the server') {
  return res.status(500).send({ error: message });
};