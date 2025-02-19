const { getLabel, repyMessage } = require('../../librarys/Library')
// const { getDateTime, getDateTimeLang, getDateString, getTime } = require('../../librarys/DayTimeLibrary')

const TeamModel  = require('./TeamModel')

module.exports = new class TeamController1 {

async teamReply (req,res) {
    // console.log('staffReply '+JSON.stringify(req.body))
    const Label = getLabel('th')

    var User, response, ReplyMessage = null 

    if (req.body.events.length == 0) {
        response = { Status: 'OK'}
    } else {
        // register
        if (req.body.events[0].type == 'message') {
            var Text = req.body.events[0].message.text 

            console.log('Text ' + Text +' length '+ Text.length +' isNan '+ isNaN(Text))

            if (Text.length == 6 && !isNaN(Text)) {
                User = await TeamModel.get('user',Text) 

                console.log(JSON.stringify(User))

                if (User == null) {
                    ReplyMessage = [{type: "text", text: Label.NO_USER_ID }]
                } else {
                    await TeamModel.update('user',User.ID,{ LineUserID: req.body.events[0].source.userId })

                    const Label = getLabel(User.Language)

                    ReplyMessage = [{ type: "text", 
                    text: Label.WELCOME_USER +' '+ User.FirstName +' '+ 
                          User.LastName +' '+ Label.WORK_ROLE +' '+ Label[User.Role] }]
                          // +' '+ User.ID +' '+ req.body.events[0].source.userId }]
                }
            } else { 
                ReplyMessage = [{type: "text", text: Label.UnknowCommand }]
            }
        }

        if (ReplyMessage == null) {
            response = { Error: "Something wrong" }
        } else {
            const Channel = await TeamModel.getChannel('staff','th')

            // console.log(' Channel '+JSON.stringify(Channel))

            await repyMessage(Channel.Token, req.body.events[0].replyToken, ReplyMessage)
    
            response = {
                access_token:   Channel.Token, 
                replyToken:     req.body.events[0].replyToken,
                messages:       ReplyMessage
            }
        } // if (ReplyMessage != null)
    }

    // console.log('response ' + JSON.stringify(response))

    res.send(response)
} // teamReply

async loginLine (req,res) {
    var User = await TeamModel.getLineUser(req.body.LineUserID)

    if (User == null) {
        res.send('You are not registered yet.')
    } else {
        // console.log('User ' + JSON.stringify(User))

        if (User.LastName == ' ') {
            let Names = req.body.DisplayName.split(' ') 
            let FirstName = Names[0]
            let LastName = (Names[1] == undefined) ? '' : Names[1]

            let data = { FirstName: FirstName, LastName: LastName, Email: req.body.Email, Picture: req.body.Picture }

            // console.log('data ' + JSON.stringify(data))

            User = await TeamModel.update('user',User.ID,data)
        }

        req.session.User        = User
        req.session.Latitude    = (req.body.Latitude == '') ? '14.0965588' : req.body.Latitude
        req.session.Longitude   = (req.body.Longitude == '') ? '101.9785422' : req.body.Longitude
        
        // res.send(User)
        res.redirect('/back/team/'+req.body.Page)
    }
} // loginLine 

async people (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        const FormControl = { 
            System:         'Team',
            Title:          'Chiang Rai Team', 
            ENVIRONMENT:    process.env.ENVIRONMENT
        }

        res.render('Team/People',{ FormControl, Label })
    }
} // people

async addPeople (req,res) {
    const User = req.session.User 

    if (User == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(User.Language)

        const People = { 
            ID:                     'add', 
            BirthDate:              '01/01/2523', 
            province_ID:            'TH57', 
            district_ID:            'TH5701', 
            sub_district_ID:        'TH570101', 
            Latitude:               (req.session.Latitude == null) ? '19.90858' : req.session.Latitude, 
            Longitude:              (req.session.Longitude == null) ? '99.8325' : req.session.Longitude,     
            ElectionDistrictNumber: 0, 
            PollingStationNumber:   0, 
            MemberType:             '', 
            MemberRole:             '', 
            HaveVotingRights:       'Y',  
            Prospective:            '', 
            Color:                  'green',
            IsActive:               'Y' 
        }

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
            Debug:                  false,
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
            InputColor:         InputColor
        }

        res.render('Team/AddPeople',{ FormControl, Label, People })
    }
} // addPeople


async keyPostalCode (req,res) {
    var DistrictID = null, ProvinceID = null, List 
    
    var SelectProvince = "<select name=province_ID id=province_ID class='form-control' onchange='changeProvince()'>" 

    var SelectDistrict = "<select name=district_ID id=district_ID class='form-control' onchange='changeDistrict()'>" 

    var SelectSubDistrict = "<select name=sub_district_ID id=sub_district_ID class='form-control'>" 


    if (req.params.PostalCode == '0') {
        const People = {BirthDate: '01/01/2523',province_ID: 'TH57',district_ID: 'TH5701',sub_district_ID: 'TH5701',IsActive: 'Y'}

        List = await TeamModel.getList('province','Y')

        List.map((Province) => {
            let s = (Province.ID == People.province_ID) ? 'selected' : '' 

            SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
        })

        List = await TeamModel.getDistrictListByProvinceID(People.province_ID)

        List.map((District) => {
            let s = (District.ID == People.district_ID) ? 'selected' : '' 

            SelectDistrict += "<option value=" + District.ID +" "+ s +">"+ District.ThaiName + "</option>"
        })

        List = await TeamModel.getSubDistrictListByDistrictID(People.district_ID)

        List.map((SubDistrict) => {
            let s = (SubDistrict.ID == People.sub_district_ID) ? 'selected' : '' 

            SelectSubDistrict += "<option value=" + SubDistrict.ID +" "+ s +">"+ SubDistrict.ThaiName + "</option>"
        })
    } else {
        List = await TeamModel.getSubDistrictListByPostalCode(req.params.PostalCode)

        List.map((SubDistrict) => {
            if (DistrictID == null) { DistrictID = SubDistrict.district_ID }

            if (DistrictID == SubDistrict.district_ID) {
                SelectSubDistrict += "<option value=" + SubDistrict.ID +">"+ SubDistrict.ThaiName + "</option>"
            }
        })

        List = await TeamModel.getDistrictListByPostalCode(req.params.PostalCode)

        List.map((District) => {
            if (ProvinceID == null) { ProvinceID = District.province_ID }

            if (ProvinceID == District.province_ID) {
                SelectDistrict += "<option value=" + District.ID +">"+ District.ThaiName + "</option>"
            }
        })

        List = await TeamModel.getProvinceListByPostalCode(req.params.PostalCode)

        List.map((Province) => {
            let s = (ProvinceID == Province.ID) ? 'selected' : '' 

            SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
        })

        SelectProvince += "</select>"
    }

    SelectProvince += "</select>"

    SelectDistrict += "</select>"

    SelectSubDistrict += "</select>"

    res.send({ SelectSubDistrict: SelectSubDistrict, SelectDistrict: SelectDistrict, SelectProvince: SelectProvince })
} // keyPostalCode

async changeProvince (req,res) {
    var List, DistrictID = null  
    
    var SelectDistrict = "<select name=district_ID id=district_ID class='form-control' onchange='changeDistrict()'>" 
//    var SelectDistrict = "<select name=district_ID id=district_ID class='form-control'>" 

    var SelectSubDistrict = "<select name=sub_district_ID id=sub_district_ID class='form-control'>" 

    if (req.params.PostalCode == '0') {

        List = await TeamModel.getDistrictListByProvinceID(req.params.province_ID)

        List.map((District) => {
            if (DistrictID == null) { DistrictID = District.ID }

            SelectDistrict += "<option value=" + District.ID +">"+ District.ThaiName + "</option>"
        })

        List = await TeamModel.getSubDistrictListByDistrictID(DistrictID)

        List.map((SubDistrict) => {
            SelectSubDistrict += "<option value=" + SubDistrict.ID +">"+ SubDistrict.ThaiName + "</option>"
        })
    } else {
        List = await TeamModel.getDistrictListByPostalCode(req.params.PostalCode)

        List.map((District) => {
            if (req.params.province_ID == District.province_ID) {
                if (DistrictID == null) { DistrictID = District.ID }

                SelectDistrict += "<option value=" + District.ID +">"+ District.ThaiName + "</option>"
            }
        })

        List = await TeamModel.getSubDistrictListByPostalCode(req.params.PostalCode)

        List.map((SubDistrict) => {
            if (DistrictID == SubDistrict.district_ID) {
                SelectSubDistrict += "<option value=" + SubDistrict.ID +">"+ SubDistrict.ThaiName + "</option>"
            }
        })
    }

    SelectDistrict += "</select>"

    SelectSubDistrict += "</select>"

    res.send({ SelectSubDistrict: SelectSubDistrict, SelectDistrict: SelectDistrict })
} // changeProvince

async changeDistrict (req,res) {
    var List   
    
    var SelectSubDistrict = "<select name=sub_district_ID id=sub_district_ID class='form-control'>" 

    if (req.params.PostalCode == '0') {

        List = await TeamModel.getSubDistrictListByDistrictID(req.params.district_ID)

        List.map((SubDistrict) => {
            SelectSubDistrict += "<option value=" + SubDistrict.ID +">"+ SubDistrict.ThaiName + "</option>"
        })
    } else {
        List = await TeamModel.getSubDistrictListByPostalCode(req.params.PostalCode)

        List.map((SubDistrict) => {
            if (req.params.district_ID == SubDistrict.district_ID) {
                SelectSubDistrict += "<option value=" + SubDistrict.ID +">"+ SubDistrict.ThaiName + "</option>"
            }
        })
    }

    SelectSubDistrict += "</select>"

    res.send({ SelectSubDistrict: SelectSubDistrict })
} // changeDistrict

} // TeamController1

/*
        var SelectProvince = "<select name=province_ID id=province_ID class='form-control' onchange='changeProvince()'>" 
        //var SelectProvince = "<select name=province_ID id=province_ID class='form-control'>" 

        var List = await TeamModel.getList('province','Y')

        List.map((Province) => {
            let s = (Province.ID == People.province_ID) ? 'selected' : '' 

            SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
        })

        SelectProvince += "</select>"


        var SelectDistrict = "<select name=district_ID id=district_ID class='form-control' onchange='changeDistrict()'>" 
        //var SelectDistrict = "<select name=district_ID id=district_ID class='form-control'>" 

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

        var List = await TeamModel.getMasterField('Prospective')

        List.map((MasterField) => {
            let s = (MasterField.Value == People.Prospective) ? 'selected' : '' 

            SelectProspective += "<option value='" + MasterField.Value +"' "+ s +">"+ MasterField.Value + "</option>"
        })

        SelectProspective += "</select>"
*/
