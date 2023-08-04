const clients = [];

function sendEventToClients(eventMessage) {
  clients.forEach((client) => {
    client.write(`data: ${eventMessage}\n\n`);
  });
}
function addClient(client) {
  clients.push(client);
}

function removeClient(client) {
  const index = clients.indexOf(client);
  if (index !== -1) {
    clients.splice(index, 1);
  }
}

module.exports = {
  sendEventToClients,
  addClient,
  removeClient,
};

//for controller
//  const eventMessage = JSON.stringify({ dishId, status });
//  sendEventToClients(eventMessage);

//route
// app.get('/sse', (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.setHeader('X-Accel-Buffering', 'no');
//   res.flushHeaders();

//   addClient(res);

//   req.on('close', () => {
//     removeClient(res);
//     res.end();
//   });
// });
