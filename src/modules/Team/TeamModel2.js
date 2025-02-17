const Model = require('../../models/Model.js');

module.exports =  new class TeamModel2 extends Model {
constructor(){ 
    super('operation')
}

getOperationList( UserID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM operation WHERE CreatedBy_user_ID = ? " + 
                  "ORDER BY ID DESC"

        cThis.db.query(sql,[UserID], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getOperationList

searchOperation( Field, SearchTerm ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM operation WHERE " + Field + " LIKE '%" + SearchTerm + "%' "

        // console.log(sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchOperation

searchOperationByDate( FromDate, ToDate ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM operation " + 
                  "WHERE Date BETWEEN '" + FromDate + "' AND '" + ToDate + "' "

        // console.log(sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchOperationByDate

searchOperationByCreatedDate( FromDate, ToDate ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM operation " + 
                  "WHERE CreatedDateTime BETWEEN '" + FromDate + " 00:00:00' AND '" + ToDate + " 23:59:59' "

        // console.log(sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchOperationByDate

searchOperationCSV( Field, SearchTerm ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT O.*, P.ThaiName AS Province, G.Name AS GooglePlaceName, U.FirstName AS UF, U.LastName AS UL " + 
        "FROM operation AS O " + 
        "INNER JOIN province AS P ON P.ID = O.province_ID " + 
        "LEFT JOIN google_place AS G ON G.ID = O.google_place_ID " + 
        "LEFT JOIN user AS U ON U.ID = O.CreatedBy_user_ID " 

        if (Field != '') {
            sql += "WHERE O." + Field + " LIKE '%" + SearchTerm + "%' "
        }

        //console.log(sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchOperationCSV

searchOperationByDateCSV( FromDate, ToDate ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT O.*, P.ThaiName AS Province, G.Name AS GooglePlaceName, U.FirstName AS UF, U.LastName AS UL " + 
        "FROM operation AS O " + 
        "INNER JOIN province AS P ON P.ID = O.province_ID " + 
        "LEFT JOIN google_place AS G ON G.ID = O.google_place_ID " + 
        "LEFT JOIN user AS U ON U.ID = O.CreatedBy_user_ID " +
        "WHERE O.Date BETWEEN '" + FromDate + "' AND '" + ToDate + "' "

        // console.log(sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchOperationByDateCSV

searchOperationByCreatedDateCSV( FromDate, ToDate ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT O.*, P.ThaiName AS Province, G.Name AS GooglePlaceName, U.FirstName AS UF, U.LastName AS UL " + 
        "FROM operation AS O " + 
        "INNER JOIN province AS P ON P.ID = O.province_ID " + 
        "LEFT JOIN google_place AS G ON G.ID = O.google_place_ID " + 
        "LEFT JOIN user AS U ON U.ID = O.CreatedBy_user_ID " +
        "WHERE O.CreatedDateTime BETWEEN '" + FromDate + " 00:00:00' AND '" + ToDate + " 23:59:59' "

        // console.log(sql)

        cThis.db.query(sql,[], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // searchOperationByDateCSV

getOperation( OperationID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = 
        "SELECT U.*, P.ThaiName AS Province, G.Name AS GooglePlaceName FROM operation AS U " + 
        "INNER JOIN province AS P ON P.ID = U.province_ID " + 
        "LEFT JOIN google_place AS G ON G.ID = U.google_place_ID " + 
        "WHERE U.ID = ? " 

        cThis.db.query(sql,[OperationID], function (error, result) {
            if (error) throw  error;
            myResolve( (result.length == 0) ? null : result[0] );
        }) 
    }) 
} // getOperationList

getMasterFieldList( FieldName ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM master_field WHERE FieldName = ? AND IsActive = 'Y' "
         
        // console.log(sql + FieldName)

        cThis.db.query(sql,[FieldName], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getMasterFieldList

} // TeamModel2
