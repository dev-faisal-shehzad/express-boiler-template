const allowedOrigins = ['http://localhost:3000']
const allowedMethods = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS']
const allowedHeaders = ['Content-Type', 'Authorization']

const corsConfig = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = '\n\tThe CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  methods: allowedMethods,
  credentials: true,
  optionSuccessStatus: 200,
  allowedHeaders: allowedHeaders,
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}

export default corsConfig
