const { getLabel } = require('../../librarys/Library')

const MediaModel = require('./MediaModel')
const ProviderServiceModel = require('../ProviderService/ProviderServiceModel')

module.exports = new class MediaController {
async list (req,res) {
    const User = req.session.User

    const PermissionRole = ['ProviderAdmin','BranchAdmin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)

        const ProviderService = await ProviderServiceModel.getOne( req.params.ParentID )
    
        var FormControl = {
            System:         'Admin',
            BACKEND_URL:    process.env.BACKEND_URL,
            RentalTypeName: (ProviderService.service_type_ID == 'RC') ? Label.VehicleType : Label.RoomType 
        }

        if (req.params.MediaID == 'add') {
            let Media = await MediaModel.getChildNextSeq('media',req.params.MediaParentType,req.params.MediaParentID)

            FormControl.Seq = Media.Seq + 1
        }

        var MediaList = await MediaModel.getChild('media',req.params.MediaParentType,req.params.MediaParentID,null,'Seq')

        MediaList = MediaList.map((Media) => {
            Media.MediaParentType   = Media.ParentType
            Media.MediaParentID     = Media.ParentID
            Media.ParentType        = req.params.ParentType 
            Media.ParentID          = req.params.ParentID 
            Media.FileName = process.env.UPLOADS_URL + Media.FileName 

            if (Media.ID == req.params.MediaID) {
                Media.Mode = 'Edit' 
                Media.Save = Label.Save
            } else {
                Media.Mode          = 'View'
                Media.Edit          = Label.Edit
                Media.Delete        = Label.Delete
                Media.DeleteConfirm = Label.DeleteConfirm
            }

            return Media
        })

        var Parent 

        if (req.params.ParentType == 'ProviderService') {
            Parent = await MediaModel.get('provider_service', req.params.ParentID)
        }

        Parent.Name = 
        (User.Language == 'th') ? Parent.ThaiName : 
        (User.Language == 'zh') ? Parent.ChineseName : Parent.EnglishName 

        var MediaParent = await MediaModel.get(req.params.MediaParentType,req.params.MediaParentID)

        MediaParent.Type = (req.params.MediaParentType == 'rental_type') ? FormControl.RentalTypeName : ''

        MediaParent.Name = (User.Language == 'th') ? MediaParent.ThaiName : 
                           (User.Language == 'zh') ? MediaParent.ChineseName : MediaParent.EnglishName 

        res.render('Media/MediaList',
            { User, Label, FormControl, MediaList, Parent, MediaParent, req })
    } else {
        res.redirect('/back/home')
    }
} // list 

async save (req,res) {
    const User = req.session.User

    const PermissionRole = ['ProviderAdmin','BranchAdmin']

    if (PermissionRole.includes(User.Role)) {
        // res.send({ file: req.file, files: req.files })

        if (req.body.MediaID == 'add') {
            var data = { 
                ParentType: req.body.MediaParentType,
                ParentID:   req.body.MediaParentID,
                MediaType:  'Picture',
                Seq:        req.body.Seq, 
                FileName:   req.file.filename,
                IsActive:   (req.body.IsActive == 'Y') ? 'Y' : 'N'
            }

            await MediaModel.create(data)

        } else {
            var data = { 
                Seq:        req.body.Seq, 
                IsActive:   (req.body.IsActive == 'Y') ? 'Y' : 'N'
            }

            if (req.file != null) { data.FileName = req.file.filename }

            await MediaModel.update('media', req.body.MediaID, data)
        }
        
        res.redirect('/back/Media/list/' + req.body.ParentType +'/'+ req.body.ParentID +'/'+ 
                     req.body.MediaParentType +'/'+ req.body.MediaParentID +'/0' )
        
    } else {
        res.redirect('/back/home')
    }
} // save

async delete (req,res) {
    const User = req.session.User

    const PermissionRole = ['ProviderAdmin','BranchAdmin']

    if (PermissionRole.includes(User.Role)) {
        await MediaModel.delete(req.params.MediaID)

        res.redirect('/back/Media/list/' + req.params.ParentType +'/'+ req.params.ParentID +'/'+ 
                     req.params.MediaParentType +'/'+ req.params.MediaParentID +'/0' )
    } else {
        res.redirect('/back/home')
    }
} // delete

} // MediaController    