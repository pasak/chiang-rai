const { getLabel } = require('../../librarys/Library')
const { getDateTime } = require('../../librarys/DayTimeLibrary')

const TeamModel  = require('./TeamModel')
const TeamModel3  = require('./TeamModel3')

module.exports = new class TeamController5 {

async addPollingStation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        const PollingStation = { 
            ID:                     'add', 
            province_ID:            'TH57', 
            district_ID:            'TH5701', 
            sub_district_ID:        'TH570101', 
            Latitude:               (req.session.Latitude == null) ? '19.90858' : req.session.Latitude, 
            Longitude:              (req.session.Longitude == null) ? '99.8325' : req.session.Longitude,   
            VillageNumber:          0, 
            ElectionDistrictNumber: 0, 
            community_ID:           0,
            PollingStationNumber:   0, 
            RiskLevel:              0,
            IsActive:               'Y' 
        }
/*
        var SelectProvince = "<select name=province_ID id=province_ID class='form-control' onchange='changeProvince()'>" 
        //var SelectProvince = "<select name=province_ID id=province_ID class='form-control'>" 

        var List = await TeamModel.getList('province','Y')

        List.map((Province) => {
            let s = (Province.ID == PollingStation.province_ID) ? 'selected' : '' 

            SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
        })

        SelectProvince += "</select>"


        var SelectDistrict = "<select name=district_ID id=district_ID class='form-control' onchange='changeDistrict()'>" 
        //var SelectDistrict = "<select name=district_ID id=district_ID class='form-control'>" 

        List = await TeamModel.getDistrictListByProvinceID(PollingStation.province_ID)

        List.map((District) => {
            let s = (District.ID == PollingStation.district_ID) ? 'selected' : '' 

            SelectDistrict += "<option value=" + District.ID +" "+ s +">"+ District.ThaiName + "</option>"
        })

        SelectDistrict += "</select>"
*/

        var SelectSubDistrict = "<select name=sub_district_ID id=sub_district_ID class='form-control'>" 

        var List = await TeamModel.getSubDistrictListByDistrictID(PollingStation.district_ID)

        List.map((SubDistrict) => {
            let s = (SubDistrict.ID == PollingStation.sub_district_ID) ? 'selected' : '' 

            SelectSubDistrict += "<option value=" + SubDistrict.ID +" "+ s +">"+ SubDistrict.ThaiName + "</option>"
        })

        SelectSubDistrict += "</select>"

        const FormControl = { 
            System:             'Team',
            Page:               'PollingStation',
            Title:              'Chiang Rai Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            Debug:                  false,
            GOOGLE_MAPS_API_KEY:    process.env.GOOGLE_MAPS_API_KEY,
            BACKEND_URL:        process.env.BACKEND_URL,
            LabelClass:         'col-sm-3 col-6',
            InputClass:         'col-sm-9 col-6',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
            // SelectProvince:     SelectProvince, 
            // SelectDistrict:     SelectDistrict,
            SelectSubDistrict:  SelectSubDistrict,
        }

        res.render('Team/AddPollingStation',{ FormControl, Label, PollingStation })
    }
} // addPollingStation

async savePollingStation (req,res) {
    // return res.send('savePollingStation body ' + JSON.stringify(req.body))

    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        var data = {
            // IsActive:               (req.body.IsActive == 'Y') ? 'Y' : 'N',
            IsActive:               'Y',
            sub_district_ID:        req.body.sub_district_ID,
            VillageNumber:          req.body.VillageNumber,
            community_ID:           (req.body.community_ID == null) ? 0 : req.body.community_ID,
            Latitude:               req.body.Latitude,
            Longitude:              req.body.Longitude,
            ElectionDistrictNumber: req.body.ElectionDistrictNumber,
            PollingStationNumber:   req.body.PollingStationNumber,
            PollingStationName:     req.body.PollingStationName,
            RiskLevel:              req.body.RiskLevel,
            Remark:                 req.body.Remark
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

        if (req.body.PollingStationID == 'add') {
            var DT = new Date() 

            if (process.env.TZ_HOUR == 7) { DT.setHours(DT.getHours() + 7) }
        
            data.ID                 = null
            data.CreatedDateTime    = getDateTime(DT)
            data.CreatedBy_user_ID  = User.ID 

            let PollingStationID = await TeamModel.insert('polling_station',data)

            res.redirect('/back/team/PollingStation/view/'+PollingStationID)
        } else { 
            await TeamModel.update('polling_station',req.body.PollingStationID,data) 

            res.redirect('/back/team/PollingStation/view/'+req.body.PollingStationID)
        }
    }
} // savePollingStation

async listPollingStation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var List = []

        var SelectField = "<select id=Field name=Field class='form-control' onchange='SelectField()'>" + 
                            "<option>" + Label.SelectField + "</option>" 

        List.map((Field) => {
            SelectField += "<option value=" + Field + ">" + Label[Field] + "</option>"
        })
        
        SelectField += "</select>"

        var PollingStationList = await TeamModel3.getPollingStationList( User.ID )

        PollingStationList = PollingStationList.map((PollingStation) => {
            PollingStation.View = Label.View 
            PollingStation.Edit = Label.Edit 

            return PollingStation 
        })

        const FormControl = { 
            System:             'Team',
            Page:               'PollingStation',
            Title:              'Chiang Rai Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            BACKEND_URL:        process.env.BACKEND_URL,
            SelectField:        SelectField
        }

        res.render('Team/ListPollingStation',{ FormControl, Label, PollingStationList })
    }
} // listPollingStation

async viewPollingStation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var PollingStation = await TeamModel3.getPollingStation( req.params.PollingStationID )

        //console.log('#146 PollingStation '+JSON.stringify(PollingStation))
        
        const FormControl = { 
            System:             'Team',
            Page:               'ViewPollingStation',
            Title:              'Chiang Rai Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            Mode:               'View',
            GOOGLE_MAPS_API_KEY:    process.env.GOOGLE_MAPS_API_KEY,
            BACKEND_URL:        process.env.BACKEND_URL,
            LabelClass:         'col-sm-3 col-6',
            InputClass:         'col-sm-9 col-6',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
        }

        res.render('Team/ViewPollingStation',{ FormControl, Label, PollingStation })
    }
} // viewPollingStation

async editPollingStation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var PollingStation = await TeamModel3.getPollingStation( req.params.PollingStationID )
/*
        var SelectProvince = "<select name=province_ID id=province_ID class='form-control' onchange='changeProvince()'>" 
        //var SelectProvince = "<select name=province_ID id=province_ID class='form-control'>" 

        var List = await TeamModel.getList('province','Y')

        List.map((Province) => {
            let s = (Province.ID == PollingStation.province_ID) ? 'selected' : '' 

            SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
        })

        SelectProvince += "</select>"


        var SelectDistrict = "<select name=district_ID id=district_ID class='form-control' onchange='changeDistrict()'>" 
        //var SelectDistrict = "<select name=district_ID id=district_ID class='form-control'>" 

        List = await TeamModel.getDistrictListByProvinceID(PollingStation.province_ID)

        List.map((District) => {
            let s = (District.ID == PollingStation.district_ID) ? 'selected' : '' 

            SelectDistrict += "<option value=" + District.ID +" "+ s +">"+ District.ThaiName + "</option>"
        })

        SelectDistrict += "</select>"
*/

        var SelectSubDistrict = "<select name=sub_district_ID id=sub_district_ID class='form-control'>" 

        var List = await TeamModel.getSubDistrictListByDistrictID(PollingStation.district_ID)

        List.map((SubDistrict) => {
            let s = (SubDistrict.ID == PollingStation.sub_district_ID) ? 'selected' : '' 

            SelectSubDistrict += "<option value=" + SubDistrict.ID +" "+ s +">"+ SubDistrict.ThaiName + "</option>"
        })

        SelectSubDistrict += "</select>"

        var SelectCommunity = "<select name=community_ID id=community_ID class='form-control'>" 

        List = await TeamModel3.getCommunityList('district', 'TH5701', PollingStation.ElectionDistrictNumber)
    
        List.map((Community) => {
            let s = (Community.ID == PollingStation.community_ID) ? 'selected' : ''
    
            SelectCommunity += "<option value=" + Community.ID +" " + s +">"+ Community.Name + "</option>"
        })
    
        SelectCommunity += "</select>"
        
        const FormControl = { 
            System:             'Team',
            Page:               'PollingStation',
            Title:              'Chiang Rai Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            GOOGLE_MAPS_API_KEY:    process.env.GOOGLE_MAPS_API_KEY,
            BACKEND_URL:        process.env.BACKEND_URL,
            LabelClass:         'col-sm-3 col-6',
            InputClass:         'col-sm-9 col-6',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
            // SelectProvince:     SelectProvince, 
            // SelectDistrict:     SelectDistrict,
            SelectSubDistrict:  SelectSubDistrict,
            SelectCommunity:    SelectCommunity
        }

        res.render('Team/EditPollingStation',{ FormControl, Label, PollingStation })
    }
} // editPollingStation

async searchPollingStation (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var List = ['ID','FirstName','LastName','NickName','Telephone','PostalCode','Telephone'] 

        var SelectField = "<select id=Field name=Field class='form-control' onchange='SelectField()'>" 

        List.map((Field) => {
            let s = (Field == req.body.Field) ? 'selected' : '' 

            SelectField += "<option value=" + Field +" "+ s + ">" + Label[Field] + "</option>"
        })
        
        SelectField += "</select>"

        var PollingStationList = await TeamModel.searchPollingStation( req.body.Field, req.body.SearchTerm )

        PollingStationList = PollingStationList.map((PollingStation) => {
            PollingStation.View = Label.View 
            PollingStation.Edit = Label.Edit 

            return PollingStation 
        })

        const FormControl = { 
            System:             'Team',
            Page:               'PollingStation',
            Title:              'Chiang Rai Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            BACKEND_URL:        process.env.BACKEND_URL,
            LabelClass:         'col-sm-3 col-6',
            InputClass:         'col-sm-9 col-6',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
            SelectField:        SelectField,
            SearchTerm:         req.body.SearchTerm 
        }

        res.render('Team/ListPollingStation',{ FormControl, Label, PollingStationList })
    }
} // searchPollingStation

async clickElectionDistrictNumber (req,res) {
    var SelectCommunity = "<select name=community_ID id=community_ID class='form-control'>" 

    var List = await TeamModel3.getCommunityList('district', 'TH5701', req.params.ElectionDistrictNumber)

    List.map((Community) => {
        let s = (Community.ID == req.params.CommunityID) ? 'selected' : ''

        SelectCommunity += "<option value=" + Community.ID +" " + s +">"+ Community.Name + "</option>"
    })

    SelectCommunity += "</select>"

    res.send({ SelectCommunity: SelectCommunity })
} // clickElectionDistrictNumber
    
} // TeamController5