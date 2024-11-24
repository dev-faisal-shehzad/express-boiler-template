import mongoose from 'mongoose'

const mongoConfig = async () => {
  try {
    const mongoUrl = `${process.env.MONGO_DB_URL}/${process.env.MONGO_DB_NAME}`
    await mongoose.connect(mongoUrl)
    console.log(`\n\t✅ DB connected successfully at ${mongoUrl}\n`)
  } catch (error) {
    console.error('\n\t❌ DB connection FAILED:', error.message)
    process.exit(1)
  }
}

export default mongoConfig
