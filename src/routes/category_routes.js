
import { Router } from 'express' 
import Category from '../models/category.js'

const router = Router()

//get all category
router.get('/categories', async(req, res)=> {
    res.send(await Category.find());
})

export default router