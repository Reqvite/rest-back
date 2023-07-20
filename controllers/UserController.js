
//test controller file that should be deleted or changed later.

const UserController = {
    index: (req, res) => {
        const users = [
            { name: 'John', email: 'john@gmail.com' },
            { name: 'Mark', email: 'mark@eliftech.com' },
            { name: 'Sara', email: 'sara@sabaka.com' }
        ];

        res.status(200).json(users);
    }
}

module.exports = UserController;