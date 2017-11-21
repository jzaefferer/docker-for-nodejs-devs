import nano from 'nano'
import logger from 'winston'
import Bluebird from 'bluebird'

const dbURL = process.env.COUCHDB_URL
const nanoInstance = nano(dbURL)
const petsDB = nanoInstance.use('pets')
Bluebird.promisifyAll(petsDB)

export async function list() {
  const response = await petsDB.listAsync({ include_docs: true })
  return response.rows.map(_ => _.doc)
}

export async function show(petId) {
  try {
    return petsDB.getAsync(petId)
  } catch (err) {
    if (err.statusCode === 404) {
      const error = new Error(`Pet with id ${petId} doesn't exist`)
      error.status = 404
      throw error
    }
    throw err
  }
}

export async function create(data) {
  const response = await petsDB.insertAsync(data)
  return Object.assign({}, data, { id: response.id })
}

if (process.env.NODE_ENV !== 'test') {
  nanoInstance.db.create('pets', (error) => {
    if (error && error.error !== 'file_exists') {
      logger.error('failed to create db', {
        component: 'pets#create-db',
        error,
      })
    }
  })
}
