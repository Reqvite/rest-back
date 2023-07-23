const TransactionsController = {
    getAll: (req, res) => {
        res.send('Transactions');
    },
    create: (req, res) => {
        res.send('Create transaction');
    },
    update: (req, res) => {
        res.send('Update transaction');
    },
    delete: (req, res) => {
        res.send('Delete transaction');
    },
    getOne: (req, res) => {
        res.send('Get one transaction by id');
    },
    getByType: (req, res) => {
        res.send('Get transactions by type');
    },
    getByOrder: (req, res) => {
        res.send('Get transactions by order id');
    }
}

module.exports = TransactionsController;