const Model = require('../../models/Model.js');

module.exports =  new class TeamModel extends Model {
constructor(){ 
    super('people')
}

getLineUser( LineUserID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT U.* FROM user AS U WHERE U.LineUserID = ? "

        cThis.db.query(sql,[LineUserID], function (error, result) {
            if (error) throw  error;
            myResolve( (result.length == 0) ? null : result[0] );
        }) 
    }) 
} // getLineUser

getChannel( ChannelType, Language=null ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT C.* FROM channel AS C WHERE C.ChannelType = ? " 

        if (Language != null) {
            sql += "AND C.Language = '" + Language + "'"
        }

        cThis.db.query(sql,[ChannelType], function (error, result) {
            if (error) throw  error;
            myResolve( (result.length == 0) ? null : result[0] );
        }) 
    }) 
} // getChannel

getSubDistrictListByPostalCode( PostalCode ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT S.* FROM sub_district AS S " + 
                  "WHERE S.PostalCode = ? AND S.IsActive = 'Y' "

        cThis.db.query(sql,[PostalCode], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getSubDistrictListByPostalCode

getDistrictListByPostalCode( PostalCode ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT DISTINCT D.* FROM sub_district AS S " + 
                  "INNER JOIN district AS D ON D.ID = S.district_ID " + 
                  "WHERE S.PostalCode = ? AND D.IsActive = 'Y' "
        
        cThis.db.query(sql,[PostalCode], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getDistrictListByPostalCode

getProvinceListByPostalCode( PostalCode ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT DISTINCT P.* FROM sub_district AS S " + 
                  "INNER JOIN district AS D ON D.ID = S.district_ID " + 
                  "INNER JOIN province AS P ON P.ID = D.province_ID " + 
                  "WHERE S.PostalCode = ? AND P.IsActive = 'Y' "

        cThis.db.query(sql,[PostalCode], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getProvinceListByPostalCode

getDistrictListByProvinceID( ProvinceID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM district WHERE province_ID = ? AND IsActive = 'Y' "  
        
        cThis.db.query(sql,[ProvinceID], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getDistrictListByProvinceID

getSubDistrictListByDistrictID( DistrictID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM sub_district WHERE district_ID = ? AND IsActive = 'Y' "  
        
        cThis.db.query(sql,[DistrictID], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getSubDistrictListByDistrictID

getMasterField( FieldName ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM master_field WHERE FieldName = ? AND IsActive = 'Y' "

        cThis.db.query(sql,[FieldName], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getMasterField

getPeopleList( UserID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM people WHERE CreatedBy_user_ID = ? AND IsActive = 'Y' " + 
                  "ORDER BY CreatedDateTime DESC"

        cThis.db.query(sql,[UserID], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getPeopleList

searchPeople( Field, SearchTerm ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT * FROM people WHERE " + Field + " LIKE '%" + SearchTerm + "%' ORDER BY ID "

        // console.log(sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchPeople

searchPeopleByProvinceID( ProvinceID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT U.* FROM people AS U " + 
        "INNER JOIN sub_district AS S ON S.ID = U.sub_district_ID " + 
        "INNER JOIN district AS D ON D.ID = S.district_ID " + 
        "WHERE D.province_ID = ? ORDER BY U.ID " 

        // console.log(sql + ProvinceID)

        cThis.db.query(sql,[ProvinceID], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchPeopleByProvinceID

searchPeopleByDistrictID( DistrictID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT U.* FROM people AS U " + 
        "INNER JOIN sub_district AS S ON S.ID = U.sub_district_ID " + 
        "WHERE S.district_ID = ? ORDER BY U.ID " 

        // console.log(sql + DistrictID)

        cThis.db.query(sql,[DistrictID], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchPeopleByDistrictID

searchPeopleBySubDistrictID( SubDistrictID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT U.* FROM people AS U " + 
        "WHERE U.sub_district_ID = ? ORDER BY U.ID " 

        // console.log(sql + SubDistrictID)

        cThis.db.query(sql,[SubDistrictID], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchPeopleBySubDistrictID

searchPeopleByDate( FromDate, ToDate ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT * FROM people WHERE CreatedDateTime BETWEEN '" + FromDate + 
        " 00:00:00' AND '" + ToDate + " 23:59:59' ORDER BY CreatedDateTime "

        // console.log(sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchPeople

searchPeopleCSV( Field, SearchTerm ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT Pe.*, S.district_ID, S.ThaiName AS SubDistrict, D.province_ID, D.ThaiName AS District, " + 
        "P.ThaiName AS Province, G.Name AS GooglePlaceName, U.FirstName AS UF, U.LastName AS UL " + 
        "FROM people AS Pe " + 
        "LEFT JOIN sub_district AS S ON S.ID = Pe.sub_district_ID " + 
        "LEFT JOIN district AS D ON D.ID = S.district_ID " + 
        "LEFT JOIN province AS P ON P.ID = D.province_ID " + 
        "LEFT JOIN google_place AS G ON G.ID = Pe.google_place_ID " +
        "LEFT JOIN user AS U ON U.ID = Pe.CreatedBy_user_ID "  

        if (Field != '') {
            sql += "WHERE " + Field + " LIKE '%" + SearchTerm + "%' "
        }

        sql += "ORDER BY P.ID "

        // console.log('TeamModel 243 '+sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchPeopleCSV

searchPeopleByDateCSV( FromDate, ToDate ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT Pe.*, S.district_ID, S.ThaiName AS SubDistrict, D.province_ID, D.ThaiName AS District, " + 
        "P.ThaiName AS Province, G.Name AS GooglePlaceName, U.FirstName AS UF, U.LastName AS UL " + 
        "FROM people AS Pe " + 
        "INNER JOIN sub_district AS S ON S.ID = Pe.sub_district_ID " + 
        "INNER JOIN district AS D ON D.ID = S.district_ID " + 
        "INNER JOIN province AS P ON P.ID = D.province_ID " + 
        "LEFT JOIN google_place AS G ON G.ID = Pe.google_place_ID " +
        "LEFT JOIN user AS U ON U.ID = Pe.CreatedBy_user_ID " + 
        "WHERE Pe.CreatedDateTime BETWEEN '" + FromDate + " 00:00:00' AND '" + ToDate + " 23:59:59' " +
        "ORDER BY Pe.CreatedDateTime "

        // console.log('TeamModel 221 '+sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchPeopleCSV

getPeople( PeopleID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT Pe.*, S.district_ID, S.ThaiName AS SubDistrict, D.province_ID, D.ThaiName AS District, " + 
        "P.ThaiName AS Province, G.Name AS GooglePlaceName FROM people AS Pe " + 
        "INNER JOIN sub_district AS S ON S.ID = Pe.sub_district_ID " + 
        "INNER JOIN district AS D ON D.ID = S.district_ID " + 
        "INNER JOIN province AS P ON P.ID = D.province_ID " + 
        "LEFT JOIN google_place AS G ON G.ID = Pe.google_place_ID " + 
        "WHERE Pe.ID = ? " 

        //console.log('TeamModel 246 sql '+sql+PeopleID)

        cThis.db.query(sql,[PeopleID], function (error, result) {
            if (error) throw  error;
            myResolve( (result.length == 0) ? null : result[0] );
        }) 
    }) 
} // getPeopleList

} // TeamModel