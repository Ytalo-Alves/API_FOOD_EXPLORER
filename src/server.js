require("express-async-errors");

const express = require('express')
const AppError = require('./utils/AppError')
const database = require('./database/sqlite')
const routes = require('./routes')
const uploadConfig = require("./configs/uploads");

const app = express()
app.use(express.json())

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)
database()

// Tratamentos de erros
app.use((error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.error("Erro não tratado", error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  })
})

const PORT = 3333;

app.listen(PORT, () => console.log('Server is running on port 3333'))