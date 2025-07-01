export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-arch-node',
  port: process.env.PORT || 8080
}