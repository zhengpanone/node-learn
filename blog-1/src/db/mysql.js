const mysql = require('mysql')

const { MYSQL_CONF } = require('../conf/db')

const con = mysql.createConnection(MYSQL_CONF)
con.connect()

function exec(sql) {
    const promise = new Promise((reslove, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            reslove(result)
        })
    })
    return promise
}



module.exports = { exec }