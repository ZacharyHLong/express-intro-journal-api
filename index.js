import express from "express"

const categories = ['Food', 'Coding', 'Work', 'Other']

const app = express()
const port = 4001

// whatever middleware we want has to go in between the creation of the app 
// and the running of the server.
// calling app.get is essentially inserting a piece of middleware into the server (route middleware)
app.get('/', (req, res) => res.send({info: 'Journal API'}))

app.get('/categories', (req, res) => res.status(204).send(categories))

// by deafult will listen to localhost
// used to bind and listen to connections on the specified host and port
app.listen(port, () => console.log(`App running at http://localhost:${port}/`))
