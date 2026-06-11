const logsController = require("../controllers/logs.controller");

module.exports = (req, res, next) => {
  // Skip logging the admin logs retrieval endpoint to avoid clutter
  if (req.method === 'GET' && req.originalUrl === '/api/admin/logs') {
    return next();
  }

  // Capture response payload (both send and json)
  let responseBody;
  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);

  res.send = (body) => {
    responseBody = body;
    return originalSend(body);
  };
  res.json = (obj) => {
    responseBody = obj;
    return originalJson(obj);
  };

  // Log after response finishes – includes status, body, and error level when needed
  res.on('finish', async () => {
    const level = res.statusCode >= 400 ? 'error' : 'info';
    try {
      await logsController.saveLog({
        level,
        message: `${req.method} ${req.originalUrl}`,
        meta: {
          method: req.method,
          endpoint: req.originalUrl,
          requestBody: req.body,
          query: req.query,
          params: req.params,
          user: req.user || null,
          statusCode: res.statusCode,
          responseBody,
        },
      });
    } catch (e) {
      console.error('Failed to save request log:', e);
    }
  });

  next();
};