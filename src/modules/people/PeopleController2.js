const { getLabel } = require('../../librarys/Library')
const { getDateString, getYMDfromDMY, getTime } = require('../../librarys/DayTimeLibrary')

const TeamModel = require('../Team/TeamModel')

module.exports = new class PeopleController2 {

async search (req,res) {
    const User = req.session.User

    const PermissionRole = ['Admin']

    if (PermissionRole.includes(User.Role)) {
        const Label = getLabel(User.Language)

        var List = ['ID','FirstName','LastName','NickName','Telephone','PostalCode','Telephone','Province','CreatedDate'] 

        var SelectField = "<select id=Field name=Field class='form-control' onchange='SelectField()'>" + 
                            "<option>" + Label.SelectField + "</option>" 

        List.map((Field) => {
            let s = (Field == req.body.Field) ? 'selected' : '' 

            SelectField += "<option value=" + Field +" "+ s + ">" + Label[Field] + "</option>"
        })
        
        SelectField += "</select>"

        var PeopleList

        // console.log('PeopleController2 31 req.body '+JSON.stringify(req.body))

        if (req.body.Action == 'CSV') {
            var CSVList = []

            var CSV = {
                ID:         'People ID', 
                Picture:    'รูปภาพ', 
                Title:      'คำนำหน้า',
                FirstName:  'ชื่อ',
                LastName:   'นามสกุล',
                NickName:   'ชื่อเล่น',
                Telephone:  'โทรศัพท์',
                Line:       'Line',
                Facebook:   'Facebook',
                Others:     'Others',
                BirthDate:  'วันเกิด',
                Province:   'จังหวัด',
                District:   'อำเภอ', 
                SubDistrict:'ตำบล',
                Address:    'ที่อยู่',
                Road:       'ถนน',
                Village:    'หมู่บ้าน',
                Location:   'พิกัด',
                GooglePlaceName:        'ชื่อสถานที่', 
                ElectionDistrictNumber: 'เขตเลือกตั้ง',
                PollingStationNumber:   'หน่วยเลือกตั้งที่',
                PollingStationName:     'ชื่อหน่วยเลือกตั้ง',
                HaveVotingRights:       'สิทธิ์เลือกตั้ง',
                MemberType:             'สมาชิก',
                MemberRole:             'บทบาท',
                IsActive:               'สถานะ',
                Prospective:            'Prospective',
                Remark:                 'หมายเหตุ',
                CreatedDateTime:        'วันเวลาที่สร้าง',
                CreatedBy:              'ผู้สร้าง',
            }

            CSVList.push(CSV) 

            var Field = req.body.Field, SearchTerm = req.body.SearchTerm

            if (req.body.Field == 'CreatedDate') {
                let FromYMD = getYMDfromDMY( req.body.FromDate, User.Language )
                let ToYMD = getYMDfromDMY( req.body.ToDate, User.Language )

                PeopleList = await TeamModel.searchPeopleByDateCSV( FromYMD, ToYMD )
            } else {
                if (req.body.sub_district_ID != '') {
                    Field = 'Pe.sub_district_ID'; SearchTerm = req.body.sub_district_ID;
                } else if (req.body.district_ID != '') {
                    Field = 'S.district_ID'; SearchTerm = req.body.district_ID;
                } else if (req.body.province_ID != '') {
                    Field = 'D.province_ID'; SearchTerm = req.body.province_ID;
                } else {
                    Field = 'Pe.'+req.body.Field; SearchTerm = req.body.SearchTerm;
                }

                PeopleList = await TeamModel.searchPeopleCSV( Field, SearchTerm )
            }

            PeopleList.map((People) => {
                let DT = new Date(People.CreatedDateTime)

                CSV = {
                    ID:         People.ID, 
                    Picture:    (People.Picture == null) ? '' : process.env.UPLOADS_URL + People.Picture, 
                    Title:      People.Title,
                    FirstName:  People.FirstName,
                    LastName:   People.LastName,
                    NickName:   People.NickName,
                    Telephone:  ''+People.Telephone,
                    Line:       People.Line,
                    Facebook:   People.Facebook,
                    Others:     People.Others,
                    BirthDate:  getDateString(new Date(People.BirthDate),User.Language),
                    Province:   People.Province,
                    District:   People.District, 
                    SubDistrict:People.SubDistrict,
                    Address:    People.Address,
                    Road:       People.Road,
                    Village:    People.Village,
                    Location:   People.Latitude +','+ People.Longitude,
                    GooglePlaceName:        People.GooglePlaceName, 
                    ElectionDistrictNumber: People.ElectionDistrictNumber,
                    PollingStationNumber:   People.PollingStationNumber,
                    PollingStationName:     People.PollingStationName,
                    HaveVotingRights:       (People.HaveVotingRights == 'Y') ? Label.HaveVotingRights : Label.NoHaveVotingRights,
                    MemberType:     People.MemberType,
                    MemberRole:     People.MemberRole,
                    IsActive:       (People.IsActive == 'Y') ? 'On' : 'Off',
                    Prospective:    People.Prospective,
                    Remark:         People.Remark, 
                    CreatedDateTime: getDateString(DT,'th') + ' ' + getTime(DT),
                    CreatedBy:      People.UF + ' ' + People.UL
                }

                CSVList.push(CSV) 
            })

            // console.log('CSVList '+JSON.stringify(CSVList))

            const fs = require('fs');
            const { stringify } = require('csv-stringify');

            stringify( CSVList, function (err, output) {
                //console.log(output);
                fs.writeFile('public/uploads/people.csv', output,{
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
                res.redirect('/uploads/people.csv');
            }, 5000);
        } // if (req.body.Action == 'CSV')
        else {
            if (req.body.Field == 'CreatedDate') {
                let FromYMD = getYMDfromDMY( req.body.FromDate, User.Language )
                let ToYMD = getYMDfromDMY( req.body.ToDate, User.Language )

                PeopleList = await TeamModel.searchPeopleByDate( FromYMD, ToYMD )
            } else {
                PeopleList = (req.body.sub_district_ID != '') 
                    ? await TeamModel.searchPeopleBySubDistrictID( req.body.sub_district_ID )
                : (req.body.district_ID != '') 
                    ? await TeamModel.searchPeopleByDistrictID( req.body.district_ID )
                : (req.body.Field == 'Province') 
                    ? await TeamModel.searchPeopleByProvinceID( req.body.province_ID )
                : await TeamModel.searchPeople( req.body.Field, req.body.SearchTerm )
            }

            PeopleList = PeopleList.map((People) => {
                People.LineUserID = (People.LineUserID == null) ? null : People.LineUserID.substring(0,10) 
                People.Edit       = Label.Edit 

                return People 
            })

            var SearchCol, DistrictCol = "<input type=hidden name=district_ID value=''>", 
                SubDistrictCol = "<input type=hidden name=sub_district_ID value=''>", 
                cSearchCol = '', cDateCol = 'd-none',
                cDistrictCol = 'd-none', cSubDistrictCol = 'd-none', dSearch = ''
            
            if (req.body.Field == 'Province') {
                SearchCol = "<select name=province_ID id=province_ID class='form-control' onchange='changeProvince()'>" 

                List = await TeamModel.getList('province','Y')
            
                List.map((Province) => {
                    let s = (Province.ID == req.body.province_ID) ? 'selected' : '' 
            
                    SearchCol += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
                })
            
                SearchCol += "</select>"
            
                DistrictCol = "<select name=district_ID id=district_ID class='form-control' onchange='changeDistrict()'>"   

                if (req.body.district_ID == '') {
                    DistrictCol += "<option value='' selected>" + Label.SelectDistrict + "</option>"
                }

                List = await TeamModel.getDistrictListByProvinceID(req.body.province_ID)

                List.map((District) => {
                    let s = (District.ID == req.body.district_ID) ? 'selected' : ''

                    DistrictCol += "<option value=" + District.ID +" "+ s +">"+ District.ThaiName + "</option>"
                })

                DistrictCol += "</select>"

                cDistrictCol = ''

                if (req.body.district_ID != '') { 
                    SubDistrictCol = "<select name=sub_district_ID id=sub_district_ID class='form-control'>" 

                    if (req.body.sub_district_ID == '') {
                        SubDistrictCol += "<option value='' selected>" + Label.SelectSubDistrict + "</option>"
                    }

                    List = await TeamModel.getSubDistrictListByDistrictID(req.body.district_ID)

                    List.map((SubDistrict) => {
                        let s = (SubDistrict.ID == req.body.sub_district_ID) ? 'selected' : ''

                        SubDistrictCol += "<option value=" + SubDistrict.ID +" "+ s +">"+ SubDistrict.ThaiName + "</option>"
                    })

                    SubDistrictCol += "</select>"

                    cSubDistrictCol = ''
                } // if (req.body.district_ID != '')    
                
                dSearch = ''
            } else if (req.body.Field == 'CreatedDate') {
                cSearchCol = 'd-none' 
                cDateCol = ''
            } else {
                SearchCol = 
                "<input type='text' class='form-control' id='SearchTerm' name='SearchTerm' " + 
                "value='" + req.body.SearchTerm + "' placeholder='" + Label.EnterSearchTerm + "' onkeyup='KeySearchTerm()'> " + 
                "<input type=hidden name=province_ID value=''>"
            }

            const FormControl = {
                System:             'Admin',
                BACKEND_URL:        process.env.BACKEND_URL,
                Title:              'My Prachin',
                Logo:               '/media/mp-logo.png',
                SelectField:        SelectField,
                SearchCol:          SearchCol,
                cSearchCol:         cSearchCol,
                DistrictCol:        DistrictCol,
                SubDistrictCol:     SubDistrictCol,
                cDistrictCol:       cDistrictCol,
                cSubDistrictCol:    cSubDistrictCol,
                cDateCol:           cDateCol, 
                FromDate:           req.body.FromDate, 
                ToDate:             req.body.ToDate,
                DateLanguage:       (User.Language == 'th') ? 'th-th' : 'en',
                dSearch:            dSearch,
                Language:           User.Language
            }

            // console.log(JSON.stringify(FormControl))

            res.render('people/PeopleList',{ User, Label, FormControl, PeopleList, req })
        }
    } else {
        res.redirect('/back/home')
    }
} // search
    
async SelectFieldProvince (req,res) {
    const Label = getLabel(req.params.Language)

    var SelectProvince = "<select name=province_ID id=province_ID class='form-control' onchange='changeProvince()'>" 

    var List = await TeamModel.getList('province','Y')

    List.map((Province) => {
        let s = (Province.ID == 'TH25') ? 'selected' : '' 

        SelectProvince += "<option value=" + Province.ID +" "+ s +">"+ Province.ThaiName + "</option>"
    })

    SelectProvince += "</select>"

    var SelectDistrict = "<select name=district_ID id=district_ID class='form-control' onchange='changeDistrict()'>"  + 
                         "<option value='' selected>" + Label.SelectDistrict + "</option>"

    List = await TeamModel.getDistrictListByProvinceID('TH25')

    List.map((District) => {
        SelectDistrict += "<option value=" + District.ID +">"+ District.ThaiName + "</option>"
    })

    SelectDistrict += "</select>"

    res.send({ SelectProvince: SelectProvince, SelectDistrict: SelectDistrict })
} // SelectFieldProvince

async changeProvince (req,res) {
    const Label = getLabel(req.params.Language)

    var SelectDistrict = "<select name=district_ID id=district_ID class='form-control' onchange='changeDistrict()'>" +
                            "<option value='' selected>" + Label.SelectDistrict + "</option>"

    var List = await TeamModel.getDistrictListByProvinceID(req.params.province_ID)

    List.map((District) => {
        SelectDistrict += "<option value=" + District.ID +">"+ District.ThaiName + "</option>"
    })

    SelectDistrict += "</select>"

    res.send({ SelectDistrict: SelectDistrict })
} // changeProvince

async changeDistrict (req,res) {
    const Label = getLabel(req.params.Language)

    var SelectSubDistrict = "<select name=sub_district_ID id=sub_district_ID class='form-control'>" +
                            "<option value='' selected>" + Label.SelectSubDistrict + "</option>"

    var List = await TeamModel.getSubDistrictListByDistrictID(req.params.district_ID)

    List.map((SubDistrict) => {
        SelectSubDistrict += "<option value=" + SubDistrict.ID +">"+ SubDistrict.ThaiName + "</option>"
    })

    SelectSubDistrict += "</select>"

    res.send({ SelectSubDistrict: SelectSubDistrict })
} // changeDistrict

} // PeopleController2
