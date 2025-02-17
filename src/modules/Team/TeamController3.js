const { getLabel } = require('../../librarys/Library')
const { getYMDfromDMY, getDateTime, getDateString, getTime } = require('../../librarys/DayTimeLibrary')

const TeamModel  = require('./TeamModel')
const TeamModel2  = require('./TeamModel2')

module.exports = new class TeamController3 {

async operation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        const FormControl = { 
            System:     'Team',
            Title:      'My Prachin Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
        }

        res.render('Team/Operation',{ FormControl, Label })
    }
} // operation

async addOperation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var DT = new Date() 

        if (process.env.TZ_HOUR == 7) { DT.setHours(DT.getHours() + 7) }

        let Today = getDateString(DT,'th')

        const Operation = { 
            ID: 'add', province_ID: 'TH25', 
            Latitude:   (req.session.Latitude == null) ? '14.0965588' : req.session.Latitude, 
            Longitude:  (req.session.Longitude == null) ? '101.6157773' : req.session.Longitude,     
            Date: Today, BeginDate: Today, BeginTime: '00:00', EndDate: Today, EndTime: '00:00', 
            ExpectedAmount: 0, ActualAmount: 0, Status: '', Type: '', ElectionDistrictNumber: 0, IsActive: 'Y' 
        }


        var SelectProvince = "<select name=province_ID id=province_ID class='form-control' onchange='changeProvince()'>" 

        var List = await TeamModel2.getList('province','Y')

        List.map((Province) => {
            let s = (Province.ID == Operation.province_ID) ? 'selected' : '' 

            SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
        })

        SelectProvince += "</select>"


        var SelectType = "<select name=Type id=Type class='form-control'>" 

        List = await TeamModel.getMasterField('OperationType')

        // console.log('Type '+JSON.stringify(List))

        List.map((MasterField) => {
            let s = (MasterField.Value == Operation.Type) ? 'selected' : '' 

            SelectType += "<option value='" + MasterField.Value +"' "+ s +">"+ MasterField.Value + "</option>"
        })

        SelectType += "</select>"


        var SelectStatus = "<select name=Status id=Status class='form-control'>" 

        List = await TeamModel.getMasterField('OperationStatus')

        List.map((MasterField) => {
            let s = (MasterField.Value == Operation.Status) ? 'selected' : '' 

            SelectStatus += "<option value='" + MasterField.Value +"' "+ s +">"+ MasterField.Value + "</option>"
        })

        SelectStatus += "</select>"


        const FormControl = { 
            System:             'Team',
            Page:               'Operation',
            Title:              'My Prachin Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            GOOGLE_MAPS_API_KEY:    process.env.GOOGLE_MAPS_API_KEY,
            BACKEND_URL:        process.env.BACKEND_URL,
            LabelClass:         'col-sm-3 col-6',
            InputClass:         'col-sm-9 col-6',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
            DateLanguage:       'th-th', 
            SelectProvince:     SelectProvince, 
            SelectType:         SelectType, 
            SelectStatus:       SelectStatus, 
        }

        res.render('Team/AddOperation',{ FormControl, Label, Operation })
    }
} // addOperation

async saveOperation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        // console.log('saveOperation '+JSON.stringify(req.body))
        let BeginDateTime = getYMDfromDMY( req.body.BeginDate, 'th' ) +' '+ req.body.BeginTime
        let EndDateTime   = getYMDfromDMY( req.body.EndDate, 'th' ) +' '+ req.body.EndTime

        var data = {
            Name:                   req.body.Name,
            Status:                 req.body.Status,
            Date:                   getYMDfromDMY( req.body.Date, 'th' ),
            BeginDateTime:          BeginDateTime,
            EndDateTime:            EndDateTime,
            Type:                   req.body.Type,
            Description:            req.body.Description,
            ExpectedAmount:         req.body.ExpectedAmount,
            ActualAmount:           req.body.ActualAmount,
            Latitude:               req.body.Latitude,
            Longitude:              req.body.Longitude,
            province_ID:            req.body.province_ID,
            ElectionDistrictNumber: req.body.ElectionDistrictNumber,
            Remark:                 req.body.Remark,
            ResponsibleName:        req.body.ResponsibleName,
            SupervisorName:         req.body.SupervisorName
        }

        if (req.file != null) {
            data.Picture = req.file.filename
        }

        if (req.body.location_place_id != '') {
            data.google_place_ID = req.body.location_place_id 

            let GooglePlace = await TeamModel.get('google_place',req.body.location_place_id) 

            if (GooglePlace == null) {
                GooglePlace = {
                    ID:         req.body.location_place_id, 
                    Name:       req.body.location_name, 
                    Latitude:   req.body.Latitude, 
                    Longitude:  req.body.Longitude                 
                }
    
                await TeamModel.insert('google_place',GooglePlace)
            }
        }

        if (req.body.OperationID == 'add') {
            var DT = new Date() 

            if (process.env.TZ_HOUR == 7) { DT.setHours(DT.getHours() + 7) }
        
            data.CreatedDateTime    = getDateTime(DT)
            data.CreatedBy_user_ID  = User.ID 

            let Operation = await TeamModel2.create(data)

            res.redirect('/back/team/operation/view/'+Operation.ID)
        } else { 
            await TeamModel2.update('operation',req.body.OperationID,data) 

            res.redirect('/back/team/operation/view/'+req.body.OperationID)
        }
    }
} // saveOperation

async listOperation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var List = ['Name','Status','Type','ResponsibleName','SupervisorName'] 

        var SelectField = "<select id=Field name=Field class='form-control' onchange='KeySearchTerm()'>" + 
                            "<option value=''>" + Label.SelectField + "</option>" 

        List.map((Field) => {
            SelectField += "<option value=" + Field + ">" + Label[Field] + "</option>"
        })
        
        SelectField += "</select>"

        var OperationList = await TeamModel2.getOperationList( User.ID )

        OperationList = OperationList.map((Operation) => {
            Operation.View = Label.View 
            Operation.Edit = Label.Edit 

            return Operation 
        })

        const FormControl = { 
            System:             'Team',
            Page:               'Operation',
            Title:              'My Prachin Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            BACKEND_URL:        process.env.BACKEND_URL,
            SelectField:        SelectField
        }

        res.render('Team/ListOperation',{ FormControl, Label, OperationList })
    }
} // listOperation

async viewOperation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var Operation = await TeamModel2.getOperation( req.params.OperationID )

        Operation.Date = getDateString(new Date(Operation.Date),'th')

        let DT = new Date(Operation.BeginDateTime)

        Operation.BeginDate = getDateString(DT,'th')

        Operation.BeginTime = getTime(DT)

        DT = new Date(Operation.EndDateTime)

        Operation.EndDate = getDateString(DT,'th')

        Operation.EndTime = getTime(DT)
        
        const FormControl = { 
            System:             'Team',
            Page:               'ViewOperation',
            Title:              'My Prachin Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            Mode:               'View',
            GOOGLE_MAPS_API_KEY:    process.env.GOOGLE_MAPS_API_KEY,
            BACKEND_URL:        process.env.BACKEND_URL,
            LabelClass:         'col-sm-3 col-6',
            InputClass:         'col-sm-9 col-6',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
            Image:              (Operation.Picture == null) ? null : process.env.UPLOADS_URL + Operation.Picture 
        }

        res.render('Team/ViewOperation',{ FormControl, Label, Operation })
    }
} // viewOperation

async editOperation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var Operation = await TeamModel2.getOperation( req.params.OperationID )

        Operation.Date = getDateString(new Date(Operation.Date),'th')

        let DT = new Date(Operation.BeginDateTime)

        Operation.BeginDate = getDateString(DT,'th')

        Operation.BeginTime = getTime(DT)

        DT = new Date(Operation.EndDateTime)

        Operation.EndDate = getDateString(DT,'th')

        Operation.EndTime = getTime(DT)
        

        var SelectProvince = "<select name=province_ID id=province_ID class='form-control' onchange='changeProvince()'>" 

        var List = await TeamModel.getList('province','Y')

        List.map((Province) => {
            let s = (Province.ID == Operation.province_ID) ? 'selected' : '' 

            SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
        })

        SelectProvince += "</select>"


        var SelectType = "<select name=Type id=Type class='form-control'>" 

        List = await TeamModel.getMasterField('OperationType')

        // console.log('Type '+JSON.stringify(List))

        List.map((MasterField) => {
            let s = (MasterField.Value == Operation.Type) ? 'selected' : '' 

            SelectType += "<option value='" + MasterField.Value +"' "+ s +">"+ MasterField.Value + "</option>"
        })

        SelectType += "</select>"


        var SelectStatus = "<select name=Status id=Status class='form-control'>" 

        List = await TeamModel.getMasterField('OperationStatus')

        List.map((MasterField) => {
            let s = (MasterField.Value == Operation.Status) ? 'selected' : '' 

            SelectStatus += "<option value='" + MasterField.Value +"' "+ s +">"+ MasterField.Value + "</option>"
        })

        SelectStatus += "</select>"


        const FormControl = { 
            System:             'Team',
            Page:               'Operation',
            Title:              'My Prachin Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            GOOGLE_MAPS_API_KEY:    process.env.GOOGLE_MAPS_API_KEY,
            BACKEND_URL:        process.env.BACKEND_URL,
            LabelClass:         'col-sm-3 col-6',
            InputClass:         'col-sm-9 col-6',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
            DateLanguage:       'th-th', 
            SelectProvince:     SelectProvince, 
            SelectType:         SelectType, 
            SelectStatus:       SelectStatus, 
            Image:              (Operation.Picture == null) ? null : process.env.UPLOADS_URL + Operation.Picture 
        }

        res.render('Team/EditOperation',{ FormControl, Label, Operation })
    }
} // editOperation

async searchOperation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var List = ['Name','Status','Type','ResponsibleName','SupervisorName'] 

        var SelectField = "<select id=Field name=Field class='form-control' onchange='SelectField()'>" 

        List.map((Field) => {
            let s = (Field == req.body.Field) ? 'selected' : '' 

            SelectField += "<option value=" + Field +" "+ s + ">" + Label[Field] + "</option>"
        })
        
        SelectField += "</select>"

        var OperationList = await TeamModel2.searchOperation( req.body.Field, req.body.SearchTerm )

        OperationList = OperationList.map((Operation) => {
            Operation.View = Label.View 
            Operation.Edit = Label.Edit 

            return Operation 
        })

        const FormControl = { 
            System:             'Team',
            Page:               'Operation',
            Title:              'My Prachin Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            BACKEND_URL:        process.env.BACKEND_URL,
            LabelClass:         'col-4',
            InputClass:         'col-8',
            SelectField:        SelectField,
            SearchTerm:         req.body.SearchTerm 
        }

        res.render('Team/ListOperation',{ FormControl, Label, OperationList })
    }
} // searchOperation

} // TeamController3