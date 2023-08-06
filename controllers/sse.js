const { addClient, removeClient } = require('../utils/sse');

const connection = async (req, res) => {
  const { restId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  addClient(restId, res);

  req.on('close', () => {
    removeClient(restId, res);
    res.end();
  });
};

module.exports = { connection };
