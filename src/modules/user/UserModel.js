const Model = require('../../models/Model.js');

module.exports =  new class UserModel extends Model {
constructor(){ 
    super('user')
}

getByUserName( UserName ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM user WHERE UserName = ? "

        cThis.db.query(sql,[UserName], function (error, result) {
            if (error) throw  error;
            myResolve( (result.length == 0) ? null : result[0] );
        }) 
    }) 
} // getByUserName

getLogByUser( TableName, user_ID ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM ?? WHERE user_Id = ? "

        cThis.db.query(sql,[TableName, user_ID], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getLogByUser

} // UserModel