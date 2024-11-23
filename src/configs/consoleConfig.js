import logger from './loggerConfig.js'

if (process.env.SHOW_LOGGER === 'true') {
  const formatArgs = (...args) => args.map(arg => 
    (typeof arg === 'object' 
      ? JSON.stringify(arg, (key, value) => key === 'timestamp' ? undefined : value)
      : arg.replace(/\[%s\] %s %s/g, '').replace(/\[.*?\]/g, '')
    )
  ).join(' ');

  console.error = (...args) => logger.error(formatArgs(...args))
  console.log = (...args) => logger.info(formatArgs(...args))
  console.warn = (...args) => logger.warn(formatArgs(...args))
  console.debug = (...args) => logger.debug(formatArgs(...args))
}
