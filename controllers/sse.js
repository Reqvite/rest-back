const { addClient, removeClient } = require('../utils/sse');

const connection = async (req, res) => {
  const { rest_id } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  addClient(rest_id, res);

  req.on('close', () => {
    removeClient(rest_id, res);
    res.end();
  });
};

module.exports = { connection };
