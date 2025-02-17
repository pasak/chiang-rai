const Model = require('../../models/Model.js');

module.exports =  new class MasterFieldModel extends Model {
constructor(){ 
    super('master_field')
}

getByFieldName( FieldName ) {
    let cThis = this;

    return new Promise(function(myResolve, myReject) {
        let sql = "SELECT * FROM master_field WHERE FieldName = ? "

        cThis.db.query(sql,[FieldName], function (error, result) {
            if (error) throw  error;
            myResolve( result );
        }) 
    }) 
} // getByFieldName

} // MasterFieldModel