const clients = [];

function sendEventToClients(rest_id, eventMessage, eventType) {
  clients
    .filter((client) => client.rest_id === rest_id)
    .forEach((client) => {
      client.response.write(
        `event: ${eventType}\ndata: ${JSON.stringify({ message: eventMessage })}\n\n`
      );
    });
}

function addClient(rest_id, res) {
  clients.push({ rest_id, response: res });
}

function removeClient(rest_id) {
  const index = clients.findIndex((client) => client.rest_id === rest_id);
  if (index !== -1) {
    clients.splice(index, 1);
  }
}

module.exports = {
  sendEventToClients,
  addClient,
  removeClient,
};
