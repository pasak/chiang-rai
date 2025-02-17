const { getLabel } = require('../../librarys/Library')
const { getDateTime, getDateString, getYMDfromDMY } = require('../../librarys/DayTimeLibrary')
const bcrypt = require("bcrypt")

const UserModel = require('./UserModel')

module.exports = new class UserController {
    
async signIn (req,res) {
    var Error = null 

    var User = await UserModel.getByUserName(req.body.UserName) 

    // console.log('User ' + JSON.stringify(User))

    if (User == null) {
        Error = 'This+user+does+not+exist+in+the+system'
    } else {
        const PermissionRole = ['Admin','Team','TeamLeader']

        if (PermissionRole.includes(User.Role)) {
            function compareAsync(param1, param2) {
                return new Promise(function(resolve, reject) {
                    bcrypt.compare(param1, param2, function(err, res) {
                        if (err) {
                             reject(err);
                        } else {
                             resolve(res);
                        }
                    });
                });
            }
            
            const res = await compareAsync(req.body.Password, User.PasswordHash);
            
            // console.log('res '+res);            

            if (res == false) {
                Error = 'Password+is+incorrect'
            }

        } else {
            Error = 'Your+role+can+not+sign+in'
        }
    }

    // console.log('Error ' + Error)

    if (Error) {
        let data = {
            UserName:   req.body.UserName,
            Password:   req.body.Password,
            DateTime:   getDateTime(new Date()),
            IPAddress:  req.ip,
            BrowserInformation: req.headers["user-agent"],
            Result:     Error
        }

        await UserModel.insert('user_login_fail',data)
    
        res.redirect('/back/index.html?Error='+Error)
    } else {
        let data = {
            user_ID:    User.ID,
            DateTime:   getDateTime(new Date()),
            IPAddress:  req.ip,
            BrowserInformation: req.headers["user-agent"],
            IsActive:   'Y'
        }

        await UserModel.insert('user_login',data)

        if (User.Picture == null) {
            User.Picture = process.env.BACKEND_URL + 'dist/img/avatar5.png'
        }

        req.session.User = User

        res.redirect('/back/home')
    }
} // signIn

async signOut (req,res) {
    delete req.session.User 

    res.redirect('/back')
} // signOut

async hash (req,res) {
    const hash = await bcrypt.hash(req.params.Password, 10);

    res.send(hash)
} // hash

async list (req,res) {
    const User = req.session.User

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)

        const FormControl = {
            System:         'Admin',
            BACKEND_URL:    process.env.BACKEND_URL,
            Title:          'My Prachin',
            Logo:           '/media/mp-logo.png',
        }

        var UserList = await UserModel.get_all()

        var promiseArray = UserList.map(async (user) => {
            user.Password   = (user.PasswordHash == null) ? null : user.PasswordHash.substring(0,10) 
            user.LineUserID = (user.LineUserID == null)   ? null : user.LineUserID.substring(0,10) 

            user.Edit       = Label.Edit 

            // let RentalOrderLog = await UserModel.getLogByUser('rental_order_log',user.ID)

            // if (RentalOrderLog.length == 0) {
                user.Delete         = Label.Delete 
                user.DeleteConfirm  = Label.DeleteConfirm
            // }

            return user 
        } )

        UserList = await Promise.all(promiseArray)        

        res.render('user/UserList',{ User, Label, FormControl, UserList })
    } else {
        res.redirect('/back/home')
    }
} // list

async edit (req,res) {
    const User = req.session.User

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)
        /*
        var user = (req.params.UserID == 'add')
            ? { ID: 'add', BirthDate: '1980-01-01', province_ID: 'TH25', IsActive: 'Y'}
            : await UserModel.find(req.params.UserID)
        */
        // console.log('126 req.params.UserID '+req.params.UserID)

        var user, Image   
        
        if (req.params.UserID == 'add') {
            user = { ID: 'add', BirthDate: '1980-01-01', province_ID: 'TH25', IsActive: 'Y'}
        } else { 
            user = await UserModel.find(req.params.UserID)
        }

        // console.log('136 user '+JSON.stringify(user))
 
        // let DT = new Date(user.BirthDate) 

        // console.log('140 DT '+DT)

        // user.BirthDate = getDateString(DT,'th')

        user.BirthDate = getDateString(new Date(user.BirthDate), 'th')

        if (user.Picture != null) {
            Image = process.env.UPLOADS_URL + user.Picture
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

        var SelectProvince = "<select name=province_ID class='form-control'>" 

        const ProvinceList = await UserModel.getList('province','Y')

        ProvinceList.map((Province) => {
            let s = (Province.ID == user.province_ID) ? 'selected' : '' 

            SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
        })

        SelectProvince += "</select>"

        const FormControl = {
            System:         'Admin',
            Page:           'UserEdit',
            BACKEND_URL:    process.env.BACKEND_URL,
            Title:          'My Prachin',
            Logo:           '/media/mp-logo.png',
            LabelClass:     'col-sm-3',
            InputClass:     'col-sm-9',
            DateLanguage:   'th-th', 
            Image:          Image,
            SelectProvince: SelectProvince 
        }

        res.render('user/UserEdit',{ User, Label, FormControl, user })
    } else {
        res.redirect('/back/home')
    }
} // edit

async save (req,res) {
    // console.log(JSON.stringify(req.file))

    const User = req.session.User

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        // const PasswordHash = (req.body.Password.length == 0) ? '' : await bcrypt.hash(req.body.Password, 10) 

        var data = {
            UserName:       req.body.UserName,
            // PasswordHash:   PasswordHash,
            Role:           req.body.Role,
            Language:       'th', // req.body.Language,
            IsActive:       (req.body.IsActive == 'Y') ? 'Y' : 'N',
            // Picture:        req.file.filename,
            Title:          req.body.Title,
            FirstName:      req.body.FirstName,
            LastName:       req.body.LastName,
            NickName:       req.body.NickName,
            Telephone:      req.body.Telephone,
            Email:          req.body.Email,
            BirthDate:      getYMDfromDMY( req.body.BirthDate, 'th' ),
            province_ID:    req.body.province_ID,
            ElectionDistrictNumber: (req.body.ElectionDistrictNumber == '') ? 0 : req.body.ElectionDistrictNumber
        }

        // console.log('Password ' + req.body.Password +' length '+ req.body.Password.length)

        if (req.body.Password.length > 0) {
            data.PasswordHash = await bcrypt.hash(req.body.Password, 10)
        }

        if (req.file != null) {
            data.Picture = req.file.filename
        }

        if (req.body.UserID == 'add') {
            var loop = true 
            var UserID 

            while (loop) {
                UserID = parseInt(Math.random() * 1000000)

                let UserRow = await UserModel.find(UserID)

                // console.log('UserID ' + UserID + ' UserRow ' + JSON.stringify(UserRow))

                if (UserRow == null & UserID > 100000) { loop = false }
            }

            data.ID = UserID

            // data.PasswordHash = (req.body.Password.length == 0) ? '' : await bcrypt.hash(req.body.Password, 10) 

            await UserModel.create(data)
            /*
            if (req.file.filename != null) {
                data = {
                    ParentType:     'user',
                    ParentID:       UserID, 
                    MediaType:      'Picture', 
                    FileName:       req.file.filename, 
                    Seq:            1,
                    IsActive:       'Y'
                }

                await UserModel.insert('media',data)
            }*/
        } else { 
            /*if (req.body.Password.length > 0) {
                data.PasswordHash = await bcrypt.hash(req.body.Password, 10)
            }*/

            await UserModel.update('user',req.body.UserID,data) 
            /*
            let MediaList = await UserModel.getChild('media','user',req.body.UserID,'Y','Seq') 

            if (MediaList.length == 0) {
                data = {
                    ParentType:     'user',
                    ParentID:       req.body.UserID, 
                    MediaType:      'Picture', 
                    FileName:       req.file.filename, 
                    Seq:            1,
                    IsActive:       'Y'
                }

                await UserModel.insert('media',data)
            } else {
                data = { FileName:  req.file.filename }

                await UserModel.update('media',MediaList[0].ID,data)
            }*/
        }
        // res.send(data)
        res.redirect('/back/user/list')
    } else {
        res.redirect('/back/home')
    }
} // save

async delete (req,res) {
    const User = req.session.User

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        await UserModel.delete(req.params.UserID)

        res.redirect('/back/user/list')
    } else {
        res.redirect('/back/home')
    }
} // delete

async getByUserName (req,res) {
    var User = await UserModel.getByUserName(req.params.UserName) 

    res.send( User )
} // delete

} // UserController

/*
        var InputTitle  

        var TitleList = [ Label.Mr, Label.Ms, Label.Mrs ]

        if (TitleList.includes(Team.Title)) {
            TitleList.push( Label.Other )

            InputTitle = "<select name=Title style='width: 100px'>" 

            TitleList.map((Title) => {
                let s = (Title == Team.Title) ? 'selected' : '' 

                InputTitle += "<option value=" + Title +" "+ s +">" + Title + "</option>"
            })

            InputTitle += "</select> &nbsp; <input type='text' class='form-control' style='width: calc(100% - 200px);' name='OtherTitle'>"
        } else {
            InputTitle = "<input type='text' class='form-control' name='Title' value='" + Team.Title + "' required>"
        }
*/
