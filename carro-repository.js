module.exports = function(db) {
    return {
        criarTabela : async function(){
            return new Promise(async (resolve, reject) => {
                var sql = "CREATE TABLE IF NOT EXISTS carros (nome TEXT, cor TEXT, ano INTEGER, valor INTEGER)"

                await db.run(sql, [], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve() 
                })
                
            })
        },

        insereCarro : async function(carro) {
            return new Promise(async (resolve, reject) => {
                var sql = "SELECT COUNT(*) AS qtd FROM carros WHERE nome = ?"
                var parametros_where = [carro.nome.toUpperCase()]

                await this.contagemDeCarros(sql, parametros_where).then( (results ) => {
                    
                    if (results > 0) {                    
                        resolve( carro.nome + "ja existe na tabela")

                    } else {
                        var sql = "INSERT INTO carros(nome, cor, ano, valor) VALUES(?, ?, ?, ?)"

                        db.run(sql, [carro.nome.toUpperCase(), carro.cor.toUpperCase(), carro.ano, carro.valor], function(err) {
                            if (err) {
                                reject(err)
                            } 

                            resolve( "Carro cadastrado com sucesso, linha " + this.lastID )                         
                        })                         
                        
                    }

                }).catch( (error) => {
                    reject(error)
                }) 
            })
        },

        alterarCarro : async function(carro, alterar) {
            return new Promise(async (resolve, reject) => {
                var sql = "SELECT COUNT(*) AS qtd FROM carros WHERE nome = ?"
                var parametros_where = [alterar.toUpperCase()]

                await this.contagemDeCarros(sql, parametros_where).then( (results ) => {
                    
                    if (results > 0) {      
                        
                        var sql = "UPDATE carros SET nome = ?, cor = ?, ano = ?, valor = ? WHERE nome = ?"

                        db.run(sql, [carro.nome.toUpperCase(), carro.cor.toUpperCase(), carro.ano, carro.valor, alterar.toUpperCase()], function(err) {
                            if (err) {
                                reject(err)
                            } 

                            resolve( "Carro alterado com sucesso" )                         
                        })                    

                    } else {
                        resolve( carro.nome + "nao existe na tabela")                               
                    }

                }).catch( (error) => {
                    reject(error)
                }) 
            })
        },

        mostraCarros :  async function(sql, parametros_where) {
            return new Promise(async (resolve, reject) => {
                var carros = []
                // let sql = "SELECT * FROM carros"
                
                await db.all(sql, parametros_where, (err, result) => {
                    if (err) {
                        reject(err)
                    } 

                    if (result.length > 0) {
                        result.forEach((row) => {
                            carros.push({
                                nome  : row.nome ,
                                cor   : row.cor  ,
                                ano   : row.ano  ,
                                valor : row.valor
                            })
                        })

                    } else {
                        carros.push({
                            nome  : ""  ,
                            cor   : ""  ,
                            ano   : ""  ,
                            valor : ""
                        })
                    }                  

                    resolve(carros)
                })
            })
        },

        deletarCarro : async function(nome_carro) {            
            return new Promise(async (resolve, reject) => {
                
                var sql = "SELECT COUNT(*) AS qtd FROM carros WHERE nome = ?"
                var parametros_where = [nome_carro.toUpperCase()]

                await this.contagemDeCarros(sql, parametros_where).then( (results ) => {                
                    
                    if (results >= 1) {                    
                        var sql = "DELETE FROM carros WHERE nome = ?" 

                        db.run(sql, [nome_carro.toUpperCase()], (err, result) => {
                            if (err) {
                                reject(err)
                            }
                            
                            resolve(nome_carro + " deletado com sucesso ")
                        })

                    } else {
                        resolve( nome_carro + " nao existe na tabela " )                                           
                        
                    }

                }).catch( (error) => {
                    reject(error)
                }) 
            })

        },

        contagemDeCarros :  async function(sql, parametros_where) {
            return new Promise(async (resolve, reject) => {
                
                await db.all(sql, parametros_where, (err, result) => {
                    if (err) {
                        reject(err)
                    } 

                    resolve(result[0].qtd)
                })
            })
        }
    }
}
