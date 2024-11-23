import Redis from 'ioredis'

const redisConfiq = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null
})

let isRedisConnected = false

redisConfiq.on('error', (err) => {
  isRedisConnected = false
  console.error('\n\tRedis connection error : ', err)
})
redisConfiq.on('connect', () => {
  isRedisConnected = true
  console.log('\n\tConnected to Redis')
})

redisConfiq.connect = async () => {
  if (isRedisConnected) {
    console.log('\n\tRedis is already connected.')
    return
  }

  try {
    await redisConfiq.connect()
  } catch (error) {
    console.error('\n\tError connecting to Redis:', error.message)
    process.exit(1)
  }
}

export default redisConfiq
