import Redis from 'ioredis'

const redisConfiq = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null
})

redisConfiq.on('error', (err) => {
  console.error('\n\tRedis connection error : ', err)
})

redisConfiq.on('reconnecting', () => {
  console.log('\n\tReconnecting to Redis...')
})

redisConfiq.on('connect', () => {
  console.log('\n\tConnected to Redis')
})

export default redisConfiq
