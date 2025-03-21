const express = require("express")
const upload = require('../librarys/upload')            

const BackRouter = express.Router() 

BackRouter.get('/',(req,res)=>{ res.send('back home') })

const HomeController1 = require('../modules/home/HomeController1') 

BackRouter.get('/home',HomeController1.home) 

BackRouter.get('/backup',HomeController1.backup) 

BackRouter.get('/zip',HomeController1.zip) 


const UserController = require('../modules/user/UserController') 

BackRouter.post('/user/signIn', function(req, res){ UserController.signIn(req,res) })

BackRouter.get('/user/signOut', UserController.signOut) 

BackRouter.get('/user/hash/:Password', UserController.hash) 

BackRouter.get('/user/list', UserController.list) 

BackRouter.get('/user/edit/:UserID', UserController.edit)                             

BackRouter.post('/user/save', upload.single('file'), function(req, res){ UserController.save(req,res) })

BackRouter.get('/user/delete/:UserID', UserController.delete)                             

BackRouter.get('/user/api/getByUserName/:UserName', UserController.getByUserName) 


const TeamController1 = require('../modules/Team/TeamController1') 

BackRouter.post('/teamReply', function(req, res){ TeamController1.teamReply(req,res) })

BackRouter.post('/team/loginLine', function(req, res){ TeamController1.loginLine(req,res) })

BackRouter.get('/team/people', TeamController1.people) 

BackRouter.get('/team/people/add', TeamController1.addPeople) 

BackRouter.get('/team/api/keyPostalCode/:PostalCode', TeamController1.keyPostalCode) 

BackRouter.get('/team/api/changeProvince/:province_ID/:PostalCode', TeamController1.changeProvince) 

BackRouter.get('/team/api/changeDistrict/:district_ID/:PostalCode', TeamController1.changeDistrict) 


const TeamController2 = require('../modules/Team/TeamController2') 

BackRouter.post('/team/people/save', upload.single('file'), function(req, res){ TeamController2.savePeople(req,res) })

BackRouter.get('/team/people/list', TeamController2.listPeople) 

BackRouter.get('/team/people/view/:PeopleID', TeamController2.viewPeople) 

BackRouter.get('/team/people/edit/:PeopleID', TeamController2.editPeople) 

BackRouter.post('/team/people/search', function(req, res){ TeamController2.searchPeople(req,res) })


const TeamController3 = require('../modules/Team/TeamController3') 

BackRouter.get('/team/operation', TeamController3.operation) 

BackRouter.get('/team/operation/add', TeamController3.addOperation) 

BackRouter.post('/team/operation/save', upload.single('file'), function(req, res){ TeamController3.saveOperation(req,res) })

BackRouter.get('/team/operation/list', TeamController3.listOperation) 

BackRouter.get('/team/operation/view/:OperationID', TeamController3.viewOperation) 

BackRouter.get('/team/operation/edit/:OperationID', TeamController3.editOperation) 

BackRouter.post('/team/operation/search', function(req, res){ TeamController3.searchOperation(req,res) })


const TeamController4 = require('../modules/Team/TeamController4') 

BackRouter.get('/team/manual', TeamController4.manual) 

BackRouter.get('/team/edit', TeamController4.edit) 

BackRouter.post('/team/save', upload.single('file'), function(req, res){ TeamController4.save(req,res) })


const TeamController5 = require('../modules/Team/TeamController5') 

BackRouter.get('/team/PollingStation/add', TeamController5.addPollingStation) 

BackRouter.post('/team/PollingStation/save', function(req, res){ TeamController5.savePollingStation(req,res) })

BackRouter.get('/team/PollingStation/list', TeamController5.listPollingStation) 

BackRouter.get('/team/PollingStation/view/:PollingStationID', TeamController5.viewPollingStation) 

BackRouter.get('/team/PollingStation/edit/:PollingStationID', TeamController5.editPollingStation) 

BackRouter.post('/team/PollingStation/search', function(req, res){ TeamController5.searchPollingStation(req,res) })

BackRouter.get('/team/api/clickElectionDistrictNumber/:ElectionDistrictNumber/:CommunityID', TeamController5.clickElectionDistrictNumber) 


const MasterFieldController = require('../modules/MasterField/MasterFieldController') 

BackRouter.get('/MasterField/list', MasterFieldController.list) 

BackRouter.get('/MasterField/list/:FieldName', MasterFieldController.list) 

BackRouter.get('/MasterField/list/:FieldName/:MasterFieldID', MasterFieldController.list) 

BackRouter.post('/MasterField/save', function(req, res){ MasterFieldController.save(req,res) })

BackRouter.get('/MasterField/delete/:FieldName/:MasterFieldID', MasterFieldController.delete) 


const PeopleController = require('../modules/people/PeopleController') 

BackRouter.get('/people/list', PeopleController.list) 

BackRouter.get('/people/edit/:PeopleID', PeopleController.edit)                             

BackRouter.post('/people/save', upload.single('file'), function(req, res){ PeopleController.save(req,res) })


const PeopleController2 = require('../modules/people/PeopleController2') 

BackRouter.post('/people/search', function(req, res){ PeopleController2.search(req,res) })

BackRouter.get('/people/api/SelectFieldProvince/:Language', PeopleController2.SelectFieldProvince) 

BackRouter.get('/people/api/changeProvince/:Language/:province_ID', PeopleController2.changeProvince) 

BackRouter.get('/people/api/changeDistrict/:Language/:district_ID', PeopleController2.changeDistrict) 

BackRouter.get('/people/exportGoogleSheet', PeopleController2.exportGoogleSheet) 


const OperationController = require('../modules/operation/OperationController') 

BackRouter.get('/operation/list', OperationController.list) 

BackRouter.get('/operation/edit/:OperationID', OperationController.edit)                             

BackRouter.post('/operation/save', upload.single('file'), function(req, res){ OperationController.save(req,res) })


const OperationController2 = require('../modules/operation/OperationController2') 

BackRouter.get('/operation/api/SelectMasterField/:FieldName', OperationController2.SelectMasterField) 

BackRouter.post('/operation/search', function(req, res){ OperationController2.search(req,res) })


const PollingStationController = require('../modules/PollingStation/PollingStationController')

BackRouter.get('/PollingStation/exportGoogleSheet', PollingStationController.exportGoogleSheet) 

module.exports = BackRouter
