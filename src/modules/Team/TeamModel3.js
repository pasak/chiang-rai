const Model = require('../../models/Model.js');

module.exports =  new class TeamModel3 extends Model {
constructor(){ 
    super('polling_station')
}

getPollingStationList( UserID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM polling_station WHERE CreatedBy_user_ID = ? " + 
                  "ORDER BY ID DESC"

        cThis.db.query(sql,[UserID], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getPollingStationList

searchPollingStation( Field, SearchTerm ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM polling_station WHERE " + Field + " LIKE '%" + SearchTerm + "%' "

        // console.log(sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchPollingStation

getPollingStation( PollingStationID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT PS.*, S.district_ID, S.ThaiName AS SubDistrict, D.province_ID, D.ThaiName AS District, " + 
        "P.ThaiName AS Province, G.Name AS GooglePlaceName, C.Name AS Community " + 
        "FROM polling_station AS PS " + 
        "INNER JOIN sub_district AS S ON S.ID = PS.sub_district_ID " + 
        "INNER JOIN district AS D ON D.ID = S.district_ID " + 
        "INNER JOIN province AS P ON P.ID = D.province_ID " + 
        "LEFT JOIN google_place AS G ON G.ID = PS.google_place_ID " + 
        "LEFT JOIN community AS C ON C.ID = PS.community_ID " + 
        "WHERE PS.ID = ? " 

        //console.log('TeamModel 246 sql '+sql+PeopleID)

        cThis.db.query(sql,[PollingStationID], function (error, result) {
            if (error) throw  error;
            myResolve( (result.length == 0) ? null : result[0] );
        }) 
    }) 
} // getPollingStation

getCommunityList( ParentType, ParentID, ElectionDistrictNumber ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM community " + 
                  "WHERE ParentType = ? AND ParentID = ? AND ElectionDistrictNumber = ? " + 
                  "ORDER BY Name ASC"

        cThis.db.query(sql,[ParentType, ParentID, ElectionDistrictNumber], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getCommunityList

} // TeamModel3
