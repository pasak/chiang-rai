const express = require("express")

const upload = require('../librarys/upload')            

const FrontRouter = express.Router() 

const WebController = require('../controllers/WebController') 

FrontRouter.get('/', WebController.index)
FrontRouter.get('/:Language', WebController.index)

module.exports = FrontRouter
