const { getLabel } = require('../../librarys/Library')
const { getTime, getDateString, getYMDfromDMY } = require('../../librarys/DayTimeLibrary')

const TeamModel = require('../Team/TeamModel')
const TeamModel2 = require('../Team/TeamModel2')

module.exports = new class OperationController {

async list (req,res) {
    const User = req.session.User 

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)

        var List = ['Name','Status','Date','Type','ResponsibleName','SupervisorName','Province','CreatedDate'] 

        var SelectField = "<select id=Field name=Field class='form-control' onchange='SelectField()'>" + 
                            "<option value=''>" + Label.SelectField + "</option>" 

        List.map((Field) => {
            SelectField += "<option value=" + Field + ">" + Label[Field] + "</option>"
        })
        
        SelectField += "</select>"

        var SearchCol = 
            "<input type='text' class='form-control' id='SearchTerm' name='SearchTerm' " + 
            "placeholder='" + Label.EnterSearchTerm + "' onkeyup='KeySearchTerm()'> " + 
            "<input type=hidden name=province_ID value=''>"

        let DT = new Date() 
        let Year = DT.getFullYear() 
        let Month = DT.getMonth() + 1 
    
        if (Month < 10) { Month = '0'+Month }
    
        let YMD = Year +'-'+ Month +'-01'
    
        let FromDate = getDateString(new Date(YMD),User.Language) 
    
        DT.setMonth(DT.getMonth() + 1)
    
        Year = DT.getFullYear() 
        Month = DT.getMonth() + 1 
    
        if (Month < 10) { Month = '0'+Month }
    
        YMD = Year +'-'+ Month +'-01'
    
        let ToDate = getDateString(new Date(YMD),User.Language) 
    
        var OperationList = await TeamModel2.get_all()

            OperationList = OperationList.map((Operation) => {
            Operation.Edit = Label.Edit 

            return Operation 
        })

        const FormControl = { 
            System:             'Admin',
            Page:               'OperationList',
            BACKEND_URL:        process.env.BACKEND_URL,
            Title:              'My Prachin',
            Logo:               '/media/mp-logo.png',
            SelectField:        SelectField,
            SearchCol:          SearchCol,
            cSearchColL:        '',
            cDateCol:           'd-none', 
            FromDate:           FromDate, 
            ToDate:             ToDate,
            DateLanguage:       (User.Language == 'th') ? 'th-th' : 'en',
            dSearch:            'disabled', 
            Language:           User.Language
        }

        res.render('operation/OperationList',{ User, FormControl, Label, OperationList })
    } else {
        res.redirect('/back/home')
    }
} // list

async edit (req,res) {
    const User = req.session.User 

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)

        var Operation, Image, List   

        if (req.params.OperationID == 'add') {
            let DT = new Date() 

            if (process.env.TZ_HOUR == 7) { DT.setHours(DT.getHours() + 7) }
    
            let Today = getDateString(DT,'th')
    
            Operation = { 
                ID: 'add', province_ID: 'TH25', Latitude: '14.0965588', Longitude: '101.6157773',
                Date: Today, BeginDate: Today, BeginTime: '00:00', EndDate: Today, EndTime: '00:00', 
                Status: '', Type: '', ElectionDistrictNumber: 0, IsActive: 'Y' 
            }
    
        } else {
            Operation = await TeamModel2.getOperation( req.params.OperationID )

            Operation.Date = getDateString(new Date(Operation.Date),'th')

            let DT = new Date(Operation.BeginDateTime)

            Operation.BeginDate = getDateString(DT,'th')

            Operation.BeginTime = getTime(DT)

            DT = new Date(Operation.EndDateTime)

            Operation.EndDate = getDateString(DT,'th')

            Operation.EndTime = getTime(DT)
        }

        var SelectProvince = "<select name=province_ID id=province_ID class='form-control'>" 

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

        Image = (Operation.Picture == null) ? null : process.env.UPLOADS_URL + Operation.Picture 

        const FormControl = { 
            System:             'Admin',
            Page:               'OperationEdit',
            GOOGLE_MAPS_API_KEY:    process.env.GOOGLE_MAPS_API_KEY,
            BACKEND_URL:        process.env.BACKEND_URL,
            Title:              'My Prachin',
            Logo:               '/media/mp-logo.png',
            LabelClass:         'col-sm-3',
            InputClass:         'col-sm-9',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
            DateLanguage:       'th-th', 
            Image:              Image,
            SelectProvince:     SelectProvince, 
            SelectType:         SelectType, 
            SelectStatus:       SelectStatus, 
        }

        res.render('operation/OperationEdit',{ User, Label, FormControl, Operation })
    } else {
        res.redirect('/back/home')
    }
} // edit
    
async save (req,res) {
    const User = req.session.User 

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
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

            console.log('OperationController save data '+JSON.stringify(data))

            await TeamModel2.create(data)
        } else { 
            await TeamModel2.update('operation',req.body.OperationID,data) 
        }
        res.redirect('/back/operation/list')
    } else {
        res.redirect('/back/home')
    }
} // save
    
} // OperationController
