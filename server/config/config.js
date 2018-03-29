var env = process.env.NODE_ENV || 'dev';
console.log(`************ ${env}`);
if (env === 'test') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
    process.env.PORT = 3000;
} else if (env === 'dev') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
    process.env.PORT = 3000;
}