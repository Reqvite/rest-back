const { addClient, removeClient } = require('../utils/sse');

const connection = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  addClient(res);

  req.on('close', () => {
    removeClient(res);
    res.end();
  });
};

module.exports = { connection };
