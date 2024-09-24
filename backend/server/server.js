const express = require("express");
const app = express();
const cors = require('cors')
const loginRoute = require('./routes/user/userLogin')
const registerRoute = require('./routes/user/userSignUp')
const dbConnection = require('./config/db.config')

const getUserByIdRoute = require('./routes/user/userGetUserById')
const editUser = require('./routes/user/userEditUser')
const deleteUser = require('./routes/user/userDeleteAll')
const getAllUsersRoute = require('./routes/user/userGetAllUsers')

const locationUpdateRoute = require('./routes/location/locationUpdate')
const locationGetNearbyRoute = require('./routes/location/locationGetNearby'); 
const locationGetByUserIdRoute = require('./routes/location/locationGetByUserId'); 
const locationDeleteRoute = require('./routes/location/locationDelete'); 
const locationGetAllRoute = require('./routes/location/locationGetAll'); //Might delete this route as not the most useful thing


require('dotenv').config();
const SERVER_PORT = 8081

dbConnection()
app.use(cors({origin: '*'}))
app.use(express.json())

//Users routes
app.use('/user', loginRoute)
app.use('/user', registerRoute)
app.use('/user', getAllUsersRoute)
app.use('/user', getUserByIdRoute)
app.use('/user', editUser)
app.use('/user', deleteUser)

// Location routes
app.use('/user', locationUpdateRoute);
app.use('/user', locationGetNearbyRoute);
app.use('/user', locationGetByUserIdRoute);
app.use('/user', locationDeleteRoute);
app.use('/user',locationGetAllRoute);


app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})
