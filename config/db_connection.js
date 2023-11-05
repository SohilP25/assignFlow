import mysql from "mysql";
import { db_config } from "./db_config.js";


export const con = mysql.createConnection(db_config);

export default function connectDB(){

    con.connect(function(err) {
        if (err) 
        console.log("DATABASE CONNECTION ERROR", err)
        else
        console.log("Database Connected Successfully!"); 
      })
}
 
 