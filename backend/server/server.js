const express = require("express");
const app = express();
const cors = require('cors')
const loginRoute = require('./routes/userLogin')
const getAllUsersRoute = require('./routes/userGetAllUsers')
const registerRoute = require('./routes/userSignUp')
const getUserByIdRoute = require('./routes/userGetUserById')
const dbConnection = require('./config/db.config')
const editUser = require('./routes/userEditUser')
const deleteUser = require('./routes/userDeleteAll')
const getAllRatingsRoute = require('./routes/ratingGetAllRatings')
const createRatingsRoutes = require('./routes/ratingCreateRating')
const createDeveloper = require('./routes/developerCreateDeveloper')
const getAllDevelopers = require('./routes/developerGetAllDevelopers')
const deleteRatings = require('./routes/ratingDeleteAllRatings')
const editRatingsRoute =  require('./routes/ratingEditRatings')


require('dotenv').config();
const SERVER_PORT = 8081

dbConnection()
app.use(cors({origin: '*'}))
app.use(express.json())
app.use('/user', loginRoute)
app.use('/user', registerRoute)
app.use('/user', getAllUsersRoute)
app.use('/user', getUserByIdRoute)
app.use('/user', editUser)
app.use('/user', deleteUser)
app.use('/ratings', getAllRatingsRoute)
app.use('/ratings', createRatingsRoutes)
app.use('/ratings', deleteRatings)
app.use('/developers', createDeveloper)
app.use('/developers', getAllDevelopers)
app.use('/ratings', editRatingsRoute)


app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})
