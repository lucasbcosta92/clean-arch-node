export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-arch',
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || 'okTsa_-9y'
}