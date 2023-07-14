const IndexService = {
    get: (test_id) => {
        //get a some data from db
        if( test_id === undefined ) test_id = 'World';

        return `Hello ${test_id}`;
    }
}

module.exports = IndexService;