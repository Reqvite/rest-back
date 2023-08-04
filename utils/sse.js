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
