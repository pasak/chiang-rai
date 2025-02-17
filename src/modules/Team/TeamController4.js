const { getLabel } = require('../../librarys/Library')
const { getYMDfromDMY, getDateTime, getDateString, getTime } = require('../../librarys/DayTimeLibrary')

const TeamModel  = require('./TeamModel')
const TeamModel2  = require('./TeamModel2')

module.exports = new class TeamController4 {

async manual (req,res) {
    const FormControl = { 
        System:             'Manual', 
    }

    res.render('Team/Manual', { FormControl })
} // manual

async edit (req,res) { 
    var team = req.session.User 

    if (team == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(team.Language)

        team.BirthDate = getDateString(new Date(team.BirthDate),'th')

        var SelectProvince = "<select name=province_ID id=province_ID class='form-control'>" 

        var List = await TeamModel.getList('province','Y')

        List.map((Province) => {
            let s = (Province.ID == team.province_ID) ? 'selected' : '' 

            SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
        })

        SelectProvince += "</select>"

        const FormControl = { 
            System:         'Team',
            Page:           'EditTeam',
            Title:          'My Prachin Team',
            ENVIRONMENT:    process.env.ENVIRONMENT,
            DateLanguage:   (team.Language == 'en') ? 'en' : 'th-th',
            Image:          (team.Picture == '') ? '' : 
                            (team.Picture.startsWith('https') ? team.Picture : process.env.UPLOADS_URL + team.Picture),
            SelectProvince: SelectProvince,
        }

        res.render('Team/EditTeam',{ FormControl, Label, team })
    }
} // edit

async save (req,res) { 
    var team = req.session.User 

    if (team == null) {
        res.redirect('/back/login-line.html')
    } else {
        const Label = getLabel(team.Language)

        let data = {
            Title:          req.body.Title,
            FirstName:      req.body.FirstName, 
            LastName:       req.body.LastName, 
            NickName:       req.body.NickName, 
            Telephone:      req.body.Telephone, 
            Email:          req.body.Email, 
            BirthDate:      getYMDfromDMY(req.body.BirthDate, team.Language), 
            province_ID:    req.body.province_ID, 
            ElectionDistrictNumber: req.body.ElectionDistrictNumber, 
        }

        if (req.file != null) {
            data.Picture = req.file.filename
        }

        req.session.User = await TeamModel.update('user',team.ID,data)

        res.redirect('/back/team/edit')
    }
} // save

} // TeamController4