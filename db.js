const sqlite3 = require("sqlite3")

var db = {
    getDb : function() {
        return new Promise(async (resolve, reject) => {
            let db = await new sqlite3.Database("./bd_novo.db", (err) => {
                if (err) {
                    reject(err)
                }
            })

            resolve(db)
        })
    }
}

module.exports = db
