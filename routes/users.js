const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const users = [
        { name: 'John', email: 'john@gmail.com' },
        { name: 'Mark', email: 'mark@eliftech.com' },
        { name: 'Sara', email: 'sara@sabaka.com' }
    ];

    res.status(200).json(users);
});

module.exports = router;
