import express from 'express'
import { create, show, list } from './pets'

const router = express.Router()

router.param('pet', (req, res, next, pet) => {
  req.petname = pet
  next()
})

router.route('/')
  .get(async (req, res, next) => {
    try {
      const pets = await list()
      res.json(pets)
    } catch (error) {
      next(error)
    }
  })
  .post(async (req, res, next) => {
    if (!req.body.type) {
      next(new Error('pet needs a type attribute'))
      return
    }
    if (!req.body.name) {
      next(new Error('pet needs a name attribute'))
      return
    }
    // TODO validate the rest, reject extra attributes
    try {
      const newPet = await create(req.body)
      res.json(newPet)
    } catch (error) {
      next(error)
    }
  })

router.route('/:pet')
  .get(async (req, res, next) => {
    try {
      const pet = await show(req.petname)
      res.json(pet)
    } catch (error) {
      next(error)
    }
  })


export default router
