import { con } from "../config/db_connection.js";

function Query(query) {
  return new Promise(function (resolve, reject) {
    con.query(query, function (err, res) {
      if (err){
        console.log(err);
      reject("Query Error",err); 
      }
      else
      resolve(res);
    });
  });
}

export default Query;