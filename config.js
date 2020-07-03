module.exports = {
    DB_URL: 'mongodb://localhost/tripo',
    PORT_API: 6568,
    DOMAIN_API: 'https://localhost',
    PORT_SERVER: 80,
    DOMAIN_API: 'localhost',
    DOMAIN_SERVER: 'localhost',
    session: {
        secret: 'travelyug secret word',
        key: 'travelyug key',
        cookie: {
            path: '/',
            httpOnly: true,
//            maxAge: /* 7 * 24 * 60 * 60 * 1000
        }
    }
}