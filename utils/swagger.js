const swaggerJSDoc = require('swagger-jsdoc');

//options for the swagger docs
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            description: 'This is a simple Express server',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js', './schemas/*.js'], // files containing swagger annotations
};

const specs = swaggerJSDoc(options);

module.exports = specs;
