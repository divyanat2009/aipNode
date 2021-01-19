module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV:process.env.NODE_ENV || 'development',
    DATABASE_URL: 'postgres://ywzfulztpkakhk:b1bf24603849950e5ead934083fee44b3af34ed6eb9ed058b50ae17bab9bcc79@ec2-50-19-26-235.compute-1.amazonaws.com:5432/dcprlf6nbc330i?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory',
   // DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:passw0rd@localhost:5432/aiptestdb',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/aip-test'
}