import userRoutes from './userRoutes.json';
import apiRoutes from './apiRoutes.json';
import appRoutes from './appRoutes.json';
import serviceRoutes from './serviceRoutes.json';

const swagger = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for the application'
    },
    servers: [
        {
            url: 'http://localhost:5000/api/',
            description: 'Local Development'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
            apiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'x-api-key'
            }
        }
    },
    security: [{
        bearerAuth: []
    }],
    paths: {
        ...userRoutes,
        ...apiRoutes,
        ...appRoutes,
        ...serviceRoutes
    }
}
export default swagger;