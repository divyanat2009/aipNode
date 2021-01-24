require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('./logger')
const { NODE_ENV } = require('./config')
const usersRouter = require('./users/users-router.js')
const postsRouter = require('./posts/posts-router.js')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "AIP API",
        description: "AIP API Information",
        contact: {
          name: "AIP Developer"
        },
        servers: ["http://localhost:8000"]
      }
    },
    // ['.routes/*.js']
    apis: ["./routes/users-router.js", "./routes/posts-router.js"], 
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  // Routes
/**
 * @swagger
 * /users:
 *  get:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get("/users", (req, res) => {
    res.status(200).send("User results");
  });
app.use('/api/users',usersRouter)
app.use('/api/posts',postsRouter)


app.get('/',(req,res)=>{
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next){
    let response
    if(NODE_ENV === 'production'){
        response = {error :{message:'server error'}}
    }
    else{
        console.error(error)
        response = { message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app