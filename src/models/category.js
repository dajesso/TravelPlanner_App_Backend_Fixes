import { model } from 'mongoose'


const Category = model('Category', {
    name: { type: String, required: true, unique: true }
})

export default Category