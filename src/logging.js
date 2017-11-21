import dateFormat from 'date-format'
import winston from 'winston'

// Fix winston js to not skip error object in meta
function retainError(level, msg, meta) {
  for (const key in meta) { // eslint-disable-line no-restricted-syntax
    if (meta[key] instanceof Error) {
      meta[key] = meta[key].stack // eslint-disable-line no-param-reassign
    }
  }
  return meta
}

winston.configure({
  rewriters: [retainError],
  transports: [new winston.transports.Console()],
})

winston.default.transports.console.formatter = ({ meta, level, message }) => {
  const { component } = meta
  const otherMeta = Object.assign({}, meta)
  delete otherMeta.component

  return [
    dateFormat.asString('yyyy-MM-dd hh:mm:ss,SSS', new Date()),
    component || 'NO-COMPONENT',
    level.toUpperCase(),
    message,
    JSON.stringify(otherMeta),
  ].join(' ')
}

winston.default.transports.console.stderrLevels.debug = false

winston.level = process.env.npm_package_config_loglevel || 'debug'
