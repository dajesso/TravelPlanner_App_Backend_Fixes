import { model } from 'mongoose'


const Category = model('Category', {
    name: { type: String, required: true }
})

export default Category