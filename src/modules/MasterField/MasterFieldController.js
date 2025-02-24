const { getLabel } = require('../../librarys/Library')

const MasterFieldModel = require('./MasterFieldModel')

module.exports = new class MasterFieldController {

async list (req,res) {
    // console.log(JSON.stringify(req.params))

    const User = req.session.User

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)

        var MasterFieldList 

        if (req.params.FieldName != null) { 
            MasterFieldList = await MasterFieldModel.getByFieldName(req.params.FieldName)

            var promiseArray = MasterFieldList.map(async (MasterField) => {
                if (MasterField.ID == req.params.MasterFieldID) {
                    MasterField.Save            = Label.Save 
                } else {
                    MasterField.Mode            = 'View'
                    MasterField.Edit            = Label.Edit 
                    MasterField.Delete          = Label.Delete 
                    MasterField.DeleteConfirm   = Label.DeleteConfirm
                }

                return MasterField 
            } )

            MasterFieldList = await Promise.all(promiseArray) 
        }

        var SelectFieldName = "<select name=FieldName class='form-control'>" 

        if (req.params.FieldName == null) { SelectFieldName += "<option></option>" }

        const FieldNameList = ['MemberType','MemberRole','Prospective','OperationType','OperationStatus']        

        FieldNameList.map((FieldName) => {
            let s = (FieldName == req.params.FieldName) ? 'selected' : '' 

            SelectFieldName += "<option value=" + FieldName +" "+ s +">" + Label[FieldName] + "</option>"
        })

        SelectFieldName += "</select>"

        const FormControl = {
            System:             'Admin',
            BACKEND_URL:        process.env.BACKEND_URL,
            Title:              process.env.BackTitle,
            Logo:               process.env.BackLogo,
            LabelClass:         'col-sm-3',
            InputClass:         'col-sm-9',
            SelectFieldName:    SelectFieldName, 
        }

        res.render('MasterField/MasterFieldList',{ User, Label, FormControl, MasterFieldList, req })
    } else {
        res.redirect('/back/home')
    }
} // list

async save (req,res) {
    // console.log(JSON.stringify(req.body))

    const User = req.session.User

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)

        if (req.body.Action == Label.Save) {
            let data = {
                FieldName:  req.body.FieldName,
                Value:      req.body.Value, 
                IsActive:   (req.body.IsActive == 'Y') ? 'Y' : 'N'
            }

            if (req.body.MasterFieldID == 'add') {
                await MasterFieldModel.create(data)
            } else {
                await MasterFieldModel.update('master_field',req.body.MasterFieldID,data)
            }
        }

        res.redirect('/back/MasterField/list/' + req.body.FieldName)
    } else {
        res.redirect('/back/home')
    }
} // save

async delete (req,res) {
    const User = req.session.User

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        await MasterFieldModel.delete(req.params.MasterFieldID)

        res.redirect('/back/MasterField/list/' + req.params.FieldName)
    } else {
        res.redirect('/back/home')
    }
} // delete
    
} // MasterFieldController