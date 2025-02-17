const { getLabel } = require('../../librarys/Library')
const { getDateTime, getDateString, getYMDfromDMY } = require('../../librarys/DayTimeLibrary')

const TeamModel = require('../Team/TeamModel')

module.exports = new class PeopleController {

async list (req,res) {
    const User = req.session.User

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)

        var List = ['ID','FirstName','LastName','NickName','Telephone','PostalCode','Province','CreatedDate'] 

        var SelectField = "<select id=Field name=Field class='form-control' onchange='SelectField()'>" + 
                            "<option value=''>" + Label.SelectField + "</option>" 

        List.map((Field) => {
            SelectField += "<option value=" + Field + ">" + Label[Field] + "</option>"
        })
        
        SelectField += "</select>"
        
        var DistrictCol = "<input type=hidden name=district_ID value=''>", 
            SubDistrictCol = "<input type=hidden name=sub_district_ID value=''>", 
            cDistrictCol = 'd-none', cSubDistrictCol = 'd-none', dSearch = 'disabled'

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

        const FormControl = {
            System:             'Admin',
            Page:               'PeopleList',
            BACKEND_URL:        process.env.BACKEND_URL,
            Title:              'My Prachin',
            Logo:               '/media/mp-logo.png',
            SelectField:        SelectField,
            SearchCol:          SearchCol,
            cSearchColL:        '',
            DistrictCol:        DistrictCol,
            SubDistrictCol:     SubDistrictCol,
            cDistrictCol:       cDistrictCol,
            cSubDistrictCol:    cSubDistrictCol, 
            cDateCol:           'd-none', 
            FromDate:           FromDate, 
            ToDate:             ToDate,
            DateLanguage:       (User.Language == 'th') ? 'th-th' : 'en',
            dSearch:            dSearch,
            Language:           User.Language
        }

        // console.log('FormControl '+JSON.stringify(FormControl))

        var PeopleList = await TeamModel.get_all()

        PeopleList = PeopleList.map((People) => {
            People.LineUserID = (People.LineUserID == null) ? null : People.LineUserID.substring(0,10) 
            People.Edit       = Label.Edit 

            return People 
        } )

        res.render('people/PeopleList',{ User, Label, FormControl, PeopleList })
    } else {
        res.redirect('/back/home')
    }
} // list

async edit (req,res) {
    const User = req.session.User

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)

        var People, Image, List   
        
        if (req.params.PeopleID == 'add') {

            People = { 
                ID:                     'add', 
                BirthDate:              '1980-01-01', 
                province_ID:            'TH25', 
                district_ID:            'TH2501', 
                sub_district_ID:        'TH250101', 
                Latitude:               '14.0965588', 
                Longitude:              '101.6157773',
                ElectionDistrictNumber: 0, 
                PollingStationNumber:   0, 
                MemberType:             '', 
                MemberRole:             '', 
                Prospective:            '', 
                HaveVotingRights:       'Y',  
                IsActive:               'Y' 
            }
        } else { 
            People = await TeamModel.getPeople(req.params.PeopleID)
        }

        //console.log('PeopleController 98 People '+JSON.stringify(People))
 
        People.BirthDate = getDateString(new Date(People.BirthDate), 'th')

        if (People.Picture != null) {
            Image = process.env.UPLOADS_URL + People.Picture
        }
        /*
        var MediaList = await UserModel.getChild('media','user',req.params.UserID,'Y','Seq') 

        console.log('142 MediaList '+JSON.stringify(MediaList))        

        if (MediaList.length > 0) {
            // let FileName = MediaList[0].FileName

            // Image = (FileName.search('https') < 0) ? FileName : process.env.UPLOADS_URL + FileName

            Image = process.env.UPLOADS_URL + MediaList[0].FileName
        }
        */
        // console.log('150 Image '+Image)


        var SelectProvince = "<select name=province_ID id=province_ID class='form-control' onchange='changeProvince()'>" 

        List = await TeamModel.getList('province','Y')

        List.map((Province) => {
            let s = (Province.ID == People.province_ID) ? 'selected' : '' 

            SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
        })

        SelectProvince += "</select>"


        var SelectDistrict = "<select name=district_ID id=district_ID class='form-control' onchange='changeDistrict()'>" 
        // var SelectDistrict = "<select name=district_ID id=district_ID class='form-control'>" 

        List = await TeamModel.getDistrictListByProvinceID(People.province_ID)

        List.map((District) => {
            let s = (District.ID == People.district_ID) ? 'selected' : '' 

            SelectDistrict += "<option value=" + District.ID +" "+ s +">"+ District.ThaiName + "</option>"
        })

        SelectDistrict += "</select>"


        var SelectSubDistrict = "<select name=sub_district_ID id=sub_district_ID class='form-control'>" 

        List = await TeamModel.getSubDistrictListByDistrictID(People.district_ID)

        List.map((SubDistrict) => {
            let s = (SubDistrict.ID == People.sub_district_ID) ? 'selected' : '' 

            SelectSubDistrict += "<option value=" + SubDistrict.ID +" "+ s +">"+ SubDistrict.ThaiName + "</option>"
        })

        SelectSubDistrict += "</select>"


        var SelectMemberType = "<select name=MemberType id=MemberType class='form-control'>" 

        List = await TeamModel.getMasterField('MemberType')

        // console.log('MemberType '+JSON.stringify(List))

        List.map((MasterField) => {
            let s = (MasterField.Value == People.MemberType) ? 'selected' : '' 

            SelectMemberType += "<option value='" + MasterField.Value +"' "+ s +">"+ MasterField.Value + "</option>"
        })

        SelectMemberType += "</select>"


        var SelectMemberRole = "<select name=MemberRole id=MemberRole class='form-control'>" 

        List = await TeamModel.getMasterField('MemberRole')

        List.map((MasterField) => {
            let s = (MasterField.Value == People.MemberRole) ? 'selected' : '' 

            SelectMemberRole += "<option value='" + MasterField.Value +"' "+ s +">"+ MasterField.Value + "</option>"
        })

        SelectMemberRole += "</select>"


        var SelectProspective = "<select name=Prospective id=Prospective class='form-control'>" 

        List = await TeamModel.getMasterField('Prospective')

        List.map((MasterField) => {
            let s = (MasterField.Value == People.Prospective) ? 'selected' : '' 

            SelectProspective += "<option value='" + MasterField.Value +"' "+ s +">"+ MasterField.Value + "</option>"
        })

        SelectProspective += "</select>"

        const FormControl = {
            System:             'Admin',
            Page:               'PeopleEdit',
            BACKEND_URL:        process.env.BACKEND_URL,
            GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
            Title:              'My Prachin',
            Logo:               '/media/mp-logo.png',
            LabelClass:         'col-sm-3',
            InputClass:         'col-sm-9',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
            DateLanguage:       'th-th', 
            Image:              Image,
            SelectProvince:     SelectProvince, 
            SelectDistrict:     SelectDistrict,
            SelectSubDistrict:  SelectSubDistrict,
            SelectMemberType:   SelectMemberType, 
            SelectMemberRole:   SelectMemberRole, 
            SelectProspective:  SelectProspective, 
        }

        res.render('people/PeopleEdit',{ User, Label, FormControl, People })
    } else {
        res.redirect('/back/home')
    }
} // edit

async save (req,res) {
    const User = req.session.User 

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        var data = {
            Language:               'th', 
            IsActive:               (req.body.IsActive == 'Y') ? 'Y' : 'N',
            Title:                  req.body.Title,
            FirstName:              req.body.FirstName,
            LastName:               req.body.LastName,
            NickName:               req.body.NickName,
            Telephone:              req.body.Telephone,
            Line:                   req.body.Line,
            Facebook:               req.body.Facebook,
            Others:                 req.body.Others,
            BirthDate:              getYMDfromDMY( req.body.BirthDate, 'th' ),
            PostalCode:             req.body.PostalCode,
            sub_district_ID:        req.body.sub_district_ID,
            Address:                req.body.Address,
            Road:                   req.body.Road,
            Village:                req.body.Village,
            Latitude:               req.body.Latitude,
            Longitude:              req.body.Longitude,
            ElectionDistrictNumber: req.body.ElectionDistrictNumber,
            PollingStationNumber:   req.body.PollingStationNumber,
            PollingStationName:     req.body.PollingStationName,
            HaveVotingRights:       (req.body.HaveVotingRights == 'Y') ? 'Y' : 'N',
            MemberType:             req.body.MemberType,
            MemberRole:             req.body.MemberRole,
            Prospective:            req.body.Prospective,
            Remark:                 req.body.Remark
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

        if (req.body.PeopleID == 'add') {
            var loop = true 
            var PeopleID 

            while (loop) {
                PeopleID = parseInt(Math.random() * 1000000)

                let People = TeamModel.find(PeopleID)

                // console.log('PeopleID ' + PeopleID + ' People ' + JSON.stringify(People))

                if (People.ID == null & PeopleID > 100000) { loop = false }
            }

            var DT = new Date() 

            if (process.env.TZ_HOUR == 7) { DT.setHours(DT.getHours() + 7) }
        
            data.ID                 = PeopleID
            data.CreatedDateTime    = getDateTime(DT)
            data.CreatedBy_user_ID  = User.ID 

            await TeamModel.create(data) 

            // console.log('People '+JSON.stringify(People))
        } else { 
            await TeamModel.update('people',req.body.PeopleID,data) 
        }

        res.redirect('/back/people/list')
    } else {
        res.redirect('/back/home')
    }
} // save

} // PeopleController
