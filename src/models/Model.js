const db = require('./db_connection.js');

module.exports = class Model {

     constructor(table){
        this.db = db;
        this.table = table;
     }
 
    //get all table rows and return the result object:
    get_all(){

        let cThis = this;
        return new Promise(function(myResolve, myReject) {
        db.query('SELECT * FROM ??',[cThis.table], function (error, result) {
            if (error) throw  error;
             myResolve( result );
         }); 
        }); 
    }

    //get row by id and return the result object:
    find(id){
        let cThis = this;
        return new Promise(function(myResolve, myReject) {
           db.query('SELECT * FROM ?? WHERE ID = ?',[cThis.table,id], function (error, result) {
            if (error) throw error;
             myResolve( (result.length == 0) ? null : result[0] );
            })
        }); 
    }
    
    //insert data via object such as {id: 1, title: 'Hello MySQL'} 
    create(data){

        let cThis = this;
        return new Promise(function(myResolve, myReject) {  
        db.query('INSERT INTO ?? SET ?',[ cThis.table,data], function (error, result) {
           if (error) throw error;
          let data =  cThis.find(result.insertId);
          data.then( function(value){ myResolve( value )})
         .catch( function(error){ myReject(error)});

         });
        }); 
   }

    //update row and return new data as an object
    update( TableName, id, data){
        let cThis = this;

        return new Promise(function(myResolve, myReject) {  
            db.query('UPDATE  ?? SET ? WHERE id = ?',[TableName,data,id], function (error, result) {
                if (error) throw  error;
        
                let data =  cThis.get( TableName, id );
        
                data.then( function(value){ myResolve( value )})
                .catch( function(error){ myReject(error)});
            });
        }); 
    } // update 

    //delete row and return info
    // {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}

    delete(id){
        let cThis = this;
        return new Promise(function(myResolve, myReject) {  
            db.query('DELETE FROM  ??  WHERE id = ?',[ cThis.table,id], function (error, result) {
                if (error) throw  error;
                myResolve( result )
            });
        }); 
    }

    deleteRow( TableName,id ){
        return new Promise(function(myResolve, myReject) {  
            db.query('DELETE FROM  ??  WHERE id = ?',
                [TableName,id], function (error, result) {
                if (error) throw  error;
                myResolve( result )
            });
        }); 
    }

    deleteChild( TableName, ParentType, ParentID ){
        return new Promise(function(myResolve, myReject) {  
            db.query('DELETE FROM  ?? WHERE ParentType = ? AND ParentID = ?',
                [TableName,ParentType,ParentID], function (error, result) {
                if (error) throw  error;
                myResolve( result )
            });
        }); 
    }

    get( TableName, id ){
        return new Promise(function(myResolve, myReject) {
           db.query('SELECT * FROM ?? WHERE ID = ?',[TableName,id], function (error, result) {
            if (error) throw error;
             myResolve( (result.length == 0) ? null : result[0] );
            })
        }); 
    } // get

    getList( TableName, IsActive=null ){
        let sql = "SELECT * FROM ?? "  

        if (IsActive) { sql += "WHERE IsActive = '" + IsActive + "' " }

        return new Promise(function(myResolve, myReject) {
           db.query(sql,[TableName], function (error, result) {
            if (error) throw error;
             myResolve( result );
            })
        }); 
    } // get
    
    getChild( TableName, ParentType, ParentID, IsActive=null, OrderBy=null) {
        let sql = 'SELECT * FROM ?? WHERE ParentType = ? AND ParentID = ? ' 
        // let sql = 'SELECT * FROM ' + TableName + 
        // " WHERE ParentType = '" + ParentType + "' AND ParentID = " + ParentID 

        if (IsActive) { sql += " AND IsActive = '" + IsActive + "' " }

        if (OrderBy) { sql += "ORDER BY " + OrderBy }

        // console.log('sql '+sql)

        return new Promise(function(myResolve, myReject) {  
            db.query(sql,[ TableName, ParentType, ParentID ], function (error, result) {
                if (error) throw  error;
                myResolve( result )
            });
        }); 
    } // getChild
    
    getChildNextSeq( TableName, ParentType, ParentID) {
        let cThis = this;

        let sql = 'SELECT Max(Seq) AS Seq FROM ?? ' + 
                  'WHERE ParentType = ? AND ParentID = ? ' 

        // console.log('sql '+sql)

        return new Promise(function(myResolve, myReject) {  
            db.query(sql,[ TableName, ParentType, ParentID ], function (error, result) {
                if (error) throw  error;
                myResolve( result[0] )
            });
        }); 
    } // getChild

    insert( TableName, data ) { // return insert ID
        let cThis = this;

        return new Promise(function(myResolve, myReject) {  
            cThis.db.query('INSERT INTO ?? SET ?',[TableName,data], function (error, result) {
                if (error) throw error;
                myResolve( result.insertId );
            });
        }); 
    } // insert

    updateList( TableName, data, idList ) {
        let cThis = this;

        return new Promise(function(myResolve, myReject) {  
            cThis.db.query('UPDATE ?? SET ? WHERE ID IN (?)',[TableName,data,idList], function (error, result) {
                if (error) throw error;
                myResolve( result );
            });
        }); 
    } // insert
} // class Model