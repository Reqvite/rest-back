const indexService = require('../services/IndexService')

const IndexController = {
    index: (req, res) => {
        const data = indexService.get(req.query.id);
        res.send(data);
    }
}

module.exports = IndexController;