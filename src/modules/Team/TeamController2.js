const { getLabel } = require('../../librarys/Library')
const { getYMDfromDMY, getDateTime, getDateString } = require('../../librarys/DayTimeLibrary')

const TeamModel  = require('./TeamModel')

module.exports = new class TeamController2 {

async savePeople (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
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
            Color:                  req.body.Color,
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

            res.redirect('/back/team/people/view/'+PeopleID)
        } else { 
            await TeamModel.update('people',req.body.PeopleID,data) 

            res.redirect('/back/team/people/view/'+req.body.PeopleID)
        }
    }
} // savePeople

async listPeople (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var List = ['ID','FirstName','LastName','NickName','Telephone','PostalCode','Telephone'] 

        var SelectField = "<select id=Field name=Field class='form-control' onchange='SelectField()'>" + 
                            "<option>" + Label.SelectField + "</option>" 

        List.map((Field) => {
            SelectField += "<option value=" + Field + ">" + Label[Field] + "</option>"
        })
        
        SelectField += "</select>"

        var PeopleList = await TeamModel.getPeopleList( User.ID )

        PeopleList = PeopleList.map((People) => {
            People.View = Label.View 
            People.Edit = Label.Edit 

            return People 
        })

        const FormControl = { 
            System:             'Team',
            Page:               'People',
            Title:              'Chiang Rai Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            BACKEND_URL:        process.env.BACKEND_URL,
            SelectField:        SelectField
        }

        res.render('Team/ListPeople',{ FormControl, Label, PeopleList })
    }
} // listPeople

async viewPeople (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var People = await TeamModel.getPeople( req.params.PeopleID )

        //console.log('#146 People '+JSON.stringify(People))

        People.BirthDate = getDateString(new Date(People.BirthDate),'th')

        People.Color = 
        "<span class='border rounded-3 px-2 py-1 me-3'>" + 
            "<span class='badge rounded-circle' style='background-color: " + People.Color + ";'>&nbsp;</span> " + 
            Label[People.Color] + 
        "</span>"
        
        const FormControl = { 
            System:             'Team',
            Page:               'ViewPeople',
            Title:              'Chiang Rai Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            Mode:               'View',
            GOOGLE_MAPS_API_KEY:    process.env.GOOGLE_MAPS_API_KEY,
            BACKEND_URL:        process.env.BACKEND_URL,
            LabelClass:         'col-sm-3 col-6',
            InputClass:         'col-sm-9 col-6',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
            Image:              (People.Picture == null) ? null : process.env.UPLOADS_URL + People.Picture 
        }

        res.render('Team/ViewPeople',{ FormControl, Label, People })
    }
} // viewPeople

async editPeople (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        var People = await TeamModel.getPeople( req.params.PeopleID )

        People.BirthDate = getDateString(new Date(People.BirthDate),'th')
        
        var SelectSubDistrict = "<input type=hidden name=sub_district_ID value=" + People.sub_district_ID + " />"

        var SelectMemberType = "<input type=hidden name=MemberType value=" + People.MemberType + " />"

        var SelectMemberRole = "<input type=hidden name=MemberRole value=" + People.MemberRole + " />"

        var SelectProspective = "<input type=hidden name=Prospective value=" + People.Prospective + " />"

        var InputColor = "<input type=hidden id=Color name=Color value=" + People.Color + " />"

        var List = await TeamModel.getMasterField('Color')

        List.map((MasterField) => { 
            let border = (MasterField.Value == People.Color) ? 'border-danger' : ''

            InputColor += 
            "<span onclick=\"$('#Color').val('" + MasterField.Value + "'); $('.border-danger').removeClass('border-danger'); $(this).addClass('border-danger');\" " + 
                "class='border rounded-3 px-2 py-1 " + border + "'>" +
                "<span class='badge rounded-circle' style='background-color: " + MasterField.Value + ";'>&nbsp;</span> " + 
                Label[MasterField.Value] + 
            "</span><br>"
        })

        const FormControl = { 
            System:             'Team',
            Page:               'People',
            Title:              'Chiang Rai Team',
            ENVIRONMENT:        process.env.ENVIRONMENT,
            GOOGLE_MAPS_API_KEY:    process.env.GOOGLE_MAPS_API_KEY,
            BACKEND_URL:        process.env.BACKEND_URL,
            LabelClass:         'col-sm-3 col-6',
            InputClass:         'col-sm-9 col-6',
            fullLabelClass:     'col-sm-3',
            fullInputClass:     'col-sm-9',
            /*DateLanguage:       'th-th', 
            SelectProvince:     SelectProvince, 
            SelectDistrict:     SelectDistrict,*/
            SelectSubDistrict:  SelectSubDistrict,
            SelectMemberType:   SelectMemberType, 
            SelectMemberRole:   SelectMemberRole, 
            SelectProspective:  SelectProspective, 
            InputColor:         InputColor,
            Image:              (People.Picture == null) ? null : process.env.UPLOADS_URL + People.Picture 
        }

        res.render('Team/EditPeople',{ FormControl, Label, People })
    }
} // editPeople

async searchPeople (req,res) {
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

        var PeopleList = await TeamModel.searchPeople( req.body.Field, req.body.SearchTerm )

        PeopleList = PeopleList.map((People) => {
            People.View = Label.View 
            People.Edit = Label.Edit 

            return People 
        })

        const FormControl = { 
            System:             'Team',
            Page:               'People',
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

        res.render('Team/ListPeople',{ FormControl, Label, PeopleList })
    }
} // searchPeople

} // TeamController2