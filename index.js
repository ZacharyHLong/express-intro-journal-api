import express from "express"
import mongoose from "mongoose"

const categories = ['Food', 'Coding', 'Work', 'Other']

// const entries = [
//     { category: 'Food', content: 'hello'},
//     { category: 'Coding', content: 'Express is cool'},
//     { category: 'Work', content: 'looking for a jerb'},
// ]

// Connect to a MongoDB via Mongoose
mongoose.connect('mongodb+srv://user1:user1password@cluster0.a6zpywt.mongodb.net/journal')
    .then((m) => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed to connect'))
    .catch((err) => console.error(err))

// create a Mongoose schema to define the structure of a model
const entrySchema = new mongoose.Schema({
    category: { type: String, required: true },
    content: { type: String, required: true }
})

// Create a Mongoose model based on the schema
const EntryModel = mongoose.model('Entry', entrySchema)


const app = express()
const port = 4001

app.use(express.json())


// whatever middleware we want has to go in between the creation of the app 
// and the running of the server.
// calling app.get is essentially inserting a piece of middleware into the server (route middleware)
app.get('/', (req, res) => res.send({info: 'Journal API'}))

app.get('/categories', (req, res) => res.send(categories))

app.get('/entries', async (req, res) => res.send(await EntryModel.find()))

app.get('/entries/:id', (req, res) => {
    try {    
        const entry = EntryModel.findByID(req.params.id)
        if (entry) {
            res.send(entry)
        } else {
            res.status(404).send({ error: 'Entry not found!' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

app.post('/entries', async (req, res) => {
    try {
        // 1. create a new entry object with values passed in from the request
        const { category, content } = req.body
        const newEntry = { category, content }
        // 2. push the new entry to the entries array
        // entries.push(newEntry)
        const insertedEntry = await EntryModel.create(newEntry)
        // 3. send the new entry with 201 status
        res.status(201).send(insertedEntry)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// by deafult will listen to localhost
// used to bind and listen to connections on the specified host and port
app.listen(port, () => console.log(`App running at http://localhost:${port}/`))
