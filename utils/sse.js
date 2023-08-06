const clients = [];

function sendEventToClients(restId, eventMessage) {
  clients
    .filter((client) => client.restId === restId)
    .forEach((client) => {
      client.response.write(`data: ${eventMessage}\n\n`);
    });
}

function addClient(restId, res) {
  clients.push({ restId, response: res });
}

function removeClient(restId, res) {
  const index = clients.findIndex((client) => client.restId === restId);
  if (index !== -1) {
    clients.splice(index, 1);
  }
}

module.exports = {
  sendEventToClients,
  addClient,
  removeClient,
};
