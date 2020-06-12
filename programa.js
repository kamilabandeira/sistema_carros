const rs = require("readline-sync")
const carro_repositorio = require("./carro-repository")
// const cTable = require("console.table") 
const db = require("./db")


function menu() {    
    console.log("\n")
    console.log("--------------------------MENU--------------------------")
    console.log("A -> Sair do programa")
    console.log("B -> Criar tabela CARROS")
    console.log("C -> Inserir novo carro")
    console.log("D -> Deletar carro")
    console.log("E -> Alterar carro")
    console.log("F -> Tabela completa")
    console.log("G -> Mais caro")
    console.log("H -> Mais barato")
    console.log("I -> Ordenar caro/barato")
    console.log("J -> Quantidade total")
    console.log("K -> Consulta por cor")
    console.log("L -> Consulta por ano")
    console.log("M -> Carros posteriores ao ano escolhido")
    console.log("N -> Carros anteriores ao ano escolhido")
    console.log(" ")

    choice = rs.question("Escolha: ")
    return choice.toUpperCase()
}

async function consultaCarro(lib_carro, sql, parametros_where, texto_comunicado) {

    await lib_carro.mostraCarros(sql, parametros_where).then( result => {
        console.log(texto_comunicado)
        console.table(result)

    }).catch( (error) => {
        console.log("Erro ao consultar tabela: \n \n " + error)
    })
}


db.getDb().then(async database => {
    var repositorio = carro_repositorio(database) 

    do{
        var choice = menu()

        if(choice == "A") {
            console.clear()
            console.log("Bye bye ")
            
        } else if(choice == "B"){
            console.clear()

            await repositorio.criarTabela().then(p => {
                console.log("Tabela criada com sucesso ")

            }).catch( (error) => {
                console.log("Erro ao criar tabela: \n \n " + error)
            })                            

        } else if(choice == "C") {
            console.clear()

            console.log("--------------------------CADASTRO NOVO CARRO--------------------------")
            var carro = {
                nome  : rs.question("nome : ")       ,
                cor   : rs.question("cor  : ")       ,
                ano   : rs.questionInt("ano  : ")    ,
                valor : rs.questionInt("valor: ")
            }

            await repositorio.insereCarro(carro).then( (result) => {
                console.log( result ) 
                
            }).catch( (error) => {
                console.log("Erro ao inserir carro: \n \n " + error )
            })
                         
        } else if (choice == "D") {
            console.clear()

            var carro_deletar = rs.question("Digite o nome do carro que deseja deletar: ")
            await repositorio.deletarCarro(carro_deletar).then( (result) => {
                console.log( result )

            }).catch( (error) => {
                console.log("Erro ao deletar carro: \n \n " + error)
            })            
            
        } else if (choice == "E") {
            console.clear()

            var carro_alterar = rs.question("Digite o nome do carro que deseja alterar: ")

            console.log(" ")
            console.log("--------------------------ALTERAR INFORMACOES CARRO--------------------------")
            var novo_carro = {
                nome  : rs.question("nome : ")       ,
                cor   : rs.question("cor  : ")       ,
                ano   : rs.questionInt("ano  : ")    ,
                valor : rs.questionInt("valor: ")
            }

            await repositorio.alterarCarro(novo_carro, carro_alterar).then( (result) => {
                console.log( result ) 
                
            }).catch( (error) => {
                console.log("Erro ao alterar carro: \n \n " + error )
            })          
            
        } else if (choice == "F") {
            console.clear()

            let sql = "SELECT * FROM carros"
            var parametros_where = []
            var texto_comunicado = "Todos os carros\n "

            await consultaCarro(repositorio, sql, parametros_where, texto_comunicado)            
            
        } else if(choice == "G"){
            console.clear()

            let sql = "SELECT * FROM carros WHERE valor = (  SELECT MAX(valor)  FROM carros )"
            var parametros_where = []
            var texto_comunicado = "Carro mais caro\n "

            await consultaCarro(repositorio, sql, parametros_where, texto_comunicado)            

        } else if(choice == "H"){
            console.clear()

            let sql = "SELECT * FROM carros WHERE valor = (  SELECT MIN(valor)  FROM carros )"
            var parametros_where = []
            var texto_comunicado = "Carro mais barato\n "

            await consultaCarro(repositorio, sql, parametros_where, texto_comunicado)
            
        } else if(choice == "I"){
            console.clear()

            let sql = "SELECT * FROM carros ORDER BY valor DESC"
            var parametros_where = []
            var texto_comunicado = "Tabela ordenada por preco \n "

            await consultaCarro(repositorio, sql, parametros_where, texto_comunicado)

        } else if(choice == "J"){
            console.clear()

            let sql = "SELECT COUNT(*) as qtd  FROM carros"
            var parametros_where = []

            await repositorio.contagemDeCarros(sql, parametros_where).then(qtd => {
                console.log("Existem " + qtd + " carros na tabela\n ")

            }).catch( (error) => {
                console.log("Erro ao realizar contagem: \n \n " + error)
            })

        } else if(choice == "K"){
            console.clear()

            let sql = "SELECT * FROM carros WHERE cor = ?"

            var cor_consulta = rs.question("Digite a cor que deseja consultar: ")
            cor_consulta = cor_consulta.toUpperCase()

            var parametros_where = [cor_consulta]
            var texto_comunicado = "Carros com a cor " + cor_consulta + "\n "

            await consultaCarro(repositorio, sql, parametros_where, texto_comunicado)

        } else if(choice == "L"){
            console.clear()

            let sql = "SELECT * FROM carros WHERE ano = ?"
            var ano_consulta = rs.question("Digite ano que deseja consultar: ")
            var parametros_where = [ano_consulta]
            var texto_comunicado = "Carros com o ano " + ano_consulta + "\n "

            await consultaCarro(repositorio, sql, parametros_where, texto_comunicado)

        } else if(choice == "M"){
            console.clear()

            let sql = "SELECT * FROM carros WHERE ano >= ? ORDER BY ano DESC"
            var ano_consulta = rs.question("Digite ano que deseja consultar: ")
            var parametros_where = [ano_consulta]
            var texto_comunicado = "Carros posteriores ao ano " + ano_consulta + "\n "

            await consultaCarro(repositorio, sql, parametros_where, texto_comunicado)

        } else if(choice == "N"){
            console.clear()

            let sql = "SELECT * FROM carros WHERE ano <= ? ORDER BY ano DESC"
            var ano_consulta = rs.question("Digite ano que deseja consultar: ")
            var parametros_where = [ano_consulta]
            var texto_comunicado = "Carros anteriores ao ano " + ano_consulta + "\n "

            await consultaCarro(repositorio, sql, parametros_where, texto_comunicado)

        } else {
            console.clear()
            console.log("Opcao invalida ")
        }

    } while(choice != "A")
}) 
