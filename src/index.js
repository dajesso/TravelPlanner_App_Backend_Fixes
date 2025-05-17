import express from 'express';

const app = express()
const port = 3000
import auth_routes from './routes/auth_routes.js'
import { connect } from './db.js'

app.use(express.json());

app.use(auth_routes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  connect()
})