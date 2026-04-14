export function errorHandler(err, req, res, next) { // eslint-disable-line
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  if (status >= 500) {
    console.error('[SERVER_ERROR]', err);
  }
  res.status(status).json({ message });
}
