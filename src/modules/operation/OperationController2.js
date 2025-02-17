const { getLabel } = require('../../librarys/Library')
const { getTime, getDateString, getYMDfromDMY } = require('../../librarys/DayTimeLibrary')

const TeamModel = require('../Team/TeamModel')
const TeamModel2 = require('../Team/TeamModel2')

module.exports = new class OperationController2 {

async SelectMasterField (req,res) {
    var SelectMasterField = "<select name=" + req.params.FieldName + "  class='form-control'>"

    const List = await TeamModel2.getMasterFieldList( 'Operation'+req.params.FieldName )

    List.map((MasterField) => {
        SelectMasterField += "<option value='" + MasterField.Value + "'>" + MasterField.Value + "</option>"
    })

    SelectMasterField += "</select>"

    res.send( SelectMasterField )
} // SelectMasterField

async search (req,res) {
    const User = req.session.User 

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)

        var List = ['Name','Status','Date','Type','ResponsibleName','SupervisorName','Province','CreatedDate'] 

        var SelectField = "<select id=Field name=Field class='form-control' onchange='SelectField()'>" 

        List.map((Field) => {
            let s = (Field == req.body.Field) ? 'selected' : '' 

            SelectField += "<option value=" + Field +" "+ s + ">" + Label[Field] + "</option>"
        })
        
        SelectField += "</select>"

        var OperationList 

        if (req.body.Action == 'CSV') {
            var CSVList = []

            var CSV = {
                ID:                     'Operation ID', 
                Picture:                'รูปภาพ', 
                Name:                   'ชื่อปฏิบัติการ', 
                Status:                 'สถานะ',
                Date:                   'วันที่', 
                BeginDateTime:          'วันเวลาเริ่มต้น',
                EndDateTime:            'วันเวลาสิ้นสุด', 
                Type:                   'ประเภท',
                Description:            'รายละเอียดปฏิบัติการ',
                ExpectedAmount:         'จำนวนคาดหวัง', 
                ActualAmount:           'จำนวนคน',
                Location:               'พิกัด',
                GooglePlaceName:        'ชื่อสถานที่', 
                Province:               'จังหวัด', 
                ElectionDistrictNumber: 'หน่วยเลือกตั้งที่', 
                ResponsibleName:        'ผู้รับผิดชอบ', 
                SupervisorName:         'หัวหน้า',
                Remark:                 'หมายเหตุ', 
                CreatedDateTime:        'วันเวลาที่สร้าง',
                CreatedBy:              'ผู้สร้าง',
            }

            CSVList.push(CSV) 

            if (req.body.Field == 'Province') {
                OperationList = await TeamModel2.searchOperationCSV( 'province_ID', req.body.province_ID )
            } else if (req.body.Field == 'Status' || req.body.Field == 'Type') {
                let FieldName = req.body.Field

                OperationList = await TeamModel2.searchOperationCSV( FieldName, req.body[FieldName] )
            } else if (req.body.Field == 'Date') {
                let FromYMD = getYMDfromDMY( req.body.FromDate, User.Language )
                let ToYMD = getYMDfromDMY( req.body.ToDate, User.Language )

                OperationList = await TeamModel2.searchOperationByDateCSV( FromYMD, ToYMD )
            } else if (req.body.Field == 'CreatedDate') {
                let FromYMD = getYMDfromDMY( req.body.FromDate, User.Language )
                let ToYMD = getYMDfromDMY( req.body.ToDate, User.Language )

                OperationList = await TeamModel2.searchOperationByCreatedDateCSV( FromYMD, ToYMD )
            } else {
                OperationList = await TeamModel2.searchOperationCSV( req.body.Field, req.body.SearchTerm )
            } 

            OperationList.map((Operation) => {
                let DT = new Date( Operation.BeginDateTime )

                Operation.BeginDateTime = getDateString( DT, User.Language ) +" "+ getTime( DT )

                DT = new Date( Operation.EndDateTime )
                Operation.EndDateTime = getDateString( DT, User.Language ) +" "+ getTime( DT )

                DT = new Date( Operation.CreatedDateTime )
                Operation.CreatedDateTime = getDateString( DT, User.Language ) +" "+ getTime( DT )

                CSV = {
                    ID:                     Operation.ID, 
                    Picture:                (Operation.Picture == null) ? '' : process.env.UPLOADS_URL + Operation.Picture, 
                    Name:                   Operation.Name, 
                    Status:                 Operation.Status,
                    Date:                   getDateString(new Date(Operation.Date),User.Language),
                    BeginDateTime:          Operation.BeginDateTime,
                    EndDateTime:            Operation.EndDateTime, 
                    Type:                   Operation.Type,
                    Description:            Operation.Description,
                    ExpectedAmount:         Operation.ExpectedAmount, 
                    ActualAmount:           Operation.ActualAmount,
                    Location:               Operation.Latitude +','+ Operation.Longitude,
                    GooglePlaceName:        Operation.GooglePlaceName, 
                    Province:               Operation.Province, 
                    ElectionDistrictNumber: Operation.ElectionDistrictNumber, 
                    ResponsibleName:        Operation.ResponsibleName, 
                    SupervisorName:         Operation.SupervisorName,
                    Remark:                 Operation.Remark, 
                    CreatedDateTime:        Operation.CreatedDateTime,
                    CreatedBy:              Operation.UF + ' ' + Operation.UL
                }

                CSVList.push(CSV) 
            })


            const fs = require('fs');
            const { stringify } = require('csv-stringify');

            stringify( CSVList, function (err, output) {
                //console.log(output);
                fs.writeFile('public/uploads/operation.csv', output,{
                    encoding: "utf8",
                    flag: "w",
                    mode: 0o666
                    },
                    (err) => {
                    if (err)
                        console.log(err);
                    else {
                        console.log("File written successfully\n");
                        //console.log("The written has the following contents:");
                        //console.log(fs.readFileSync("people.csv", "utf8"));
                    }
                });
            });

            console.log('Wait');

            setTimeout(() => { 
                console.log('Download'); 
                res.redirect('/uploads/operation.csv');
            }, 5000);

        } else {
            var SearchCol, FromDate, ToDate, cSearchCol = '', cDateCol = 'd-none'   

            if (req.body.Field == 'Province') {
                OperationList = await TeamModel2.searchOperation( 'province_ID', req.body.province_ID )

                var SearchCol = "<select name=province_ID id=province_ID class='form-control' onchange='changeProvince()'>" 

                List = await TeamModel.getList('province','Y')
            
                List.map((Province) => {
                    let s = (Province.ID == req.body.province_ID) ? 'selected' : '' 
            
                    SearchCol += "<option value='" + Province.ID +"' "+ s +">"+ Province.ThaiName + "</option>"
                })
            
                SearchCol += "</select>"

            } else if (req.body.Field == 'Status' || req.body.Field == 'Type') {
                let FieldName = req.body.Field

                OperationList = await TeamModel2.searchOperation( FieldName, req.body[FieldName] )

                var SearchCol = "<select name=" + FieldName + "  class='form-control'>"

                List = await TeamModel2.getMasterFieldList( 'Operation'+FieldName )
            
                List.map((MasterField) => {
                    let s = (req.body[FieldName] == MasterField.Value) ? 'selected' : ''

                    SearchCol += "<option value='" + MasterField.Value +"' "+ s + ">" + MasterField.Value + "</option>"
                })
            
                SearchCol += "</select>"

            } else if (req.body.Field == 'Date' || req.body.Field == 'CreatedDate') {
                let FromYMD = getYMDfromDMY( req.body.FromDate, User.Language )
                let ToYMD = getYMDfromDMY( req.body.ToDate, User.Language )

                OperationList = (req.body.Field == 'CreatedDate') 
                    ? await TeamModel2.searchOperationByCreatedDate( FromYMD, ToYMD ) 
                    : await TeamModel2.searchOperationByDate( FromYMD, ToYMD )

                cSearchCol = 'd-none' 
                cDateCol = ''

            } else {
                OperationList = await TeamModel2.searchOperation( req.body.Field, req.body.SearchTerm )

                SearchCol = 
                "<input type='text' class='form-control' id='SearchTerm' name='SearchTerm' " + 
                "placeholder='" + Label.EnterSearchTerm + "' value='" + req.body.SearchTerm + "' onkeyup='KeySearchTerm()'> " + 
                "<input type=hidden name=province_ID value=''>"
            }

            if (req.body.Field == 'Date' || req.body.Field == 'CreatedDate') {
                FromDate = req.body.FromDate 
                ToDate = req.body.ToDate 
            } else {
                let DT = new Date() 
                let Year = DT.getFullYear() 
                let Month = DT.getMonth() + 1 
            
                if (Month < 10) { Month = '0'+Month }
            
                let YMD = Year +'-'+ Month +'-01'
            
                FromDate = getDateString(new Date(YMD),User.Language) 
            
                DT.setMonth(DT.getMonth() + 1)
            
                Year = DT.getFullYear() 
                Month = DT.getMonth() + 1 
            
                if (Month < 10) { Month = '0'+Month }
            
                YMD = Year +'-'+ Month +'-01'
            
                ToDate = getDateString(new Date(YMD),User.Language)     
            }

            OperationList = OperationList.map((Operation) => {
                Operation.View = Label.View 
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
                cSearchCol:         cSearchCol,
                cDateCol:           cDateCol, 
                FromDate:           FromDate, 
                ToDate:             ToDate,
                DateLanguage:       (User.Language == 'th') ? 'th-th' : 'en',
                dSearch:            '', 
                Language:           User.Language,
            }

            res.render('operation/OperationList',{ User, FormControl, Label, OperationList })
        }
    } else {
        res.redirect('/back/home')
    }
} // search

} // OperationController2
