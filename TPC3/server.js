var http = require('http')
var url = require('url')
const axios = require('axios');

setPage = `
<head>
<meta charset="UTF-8"/>
<style>
#escola {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#escola td, #escola th {
  border: 1px solid #ddd;
  padding: 8px;
}

#escola tr:nth-child(even){background-color: #f2f2f2;}

#escola tr:hover {background-color: #ddd;}

#escola th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #CE5937;
  color: white;
}
</style>
</head>`

function mainPage()
{
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8"/>
    <style>
    .navbar{
        font-family: Impact, sans-serif;
        background: #CE5937 !important;
        height: 80px;
        display: flex;
        justify-content: center;
        font-size: 1.1rem;
        z-index: 999;
    }
    
    a { text-decoration: none; }
    a:visited { text-decoration: none; color:black; }
    </style>
    <title>Lista Alunos</title>
    </head>
    <body>
      <nav class="navbar">
          <h1 style="color:white;">
            Escola de Música
        </h1>
       </nav>
      <center style="list-style-type: none;">
      <li ><h3> <a href="http://localhost:4000/alunos"> Lista de Alunos </a> </h3></li>
      <li><h3> <a href="http://localhost:4000/instrumentos"> Lista de Instrumentos </a></h3> </li>
      <li><h3> <a href="http://localhost:4000/cursos"> Lista de Cursos </a>  </h3></li>
      </center>
    </body>
    </html>
    `
}

async function alunosPage()
{   page = '<html>\n ' 
    page += setPage
        
    page += '<body><center><h1 style="font-family: Arial, Helvetica, sans-serif;">Lista de Alunos</h1></center> ' +
            '<table id="escola">'+
            '<tr>'+
                '<th>Id</th>'+
                '<th>Nome</th>'+
                '<th>Data Nascimento</th>'+
                '<th>Curso</th>'+
                '<th>Ano do Curso</th>'+
                '<th>Instrumento</th>'+
            '</tr>'
    try{
     await axios.get('http://localhost:3000/alunos')
    .then(function(resp) {
        pubs = resp.data;
        pubs.forEach(p => {
            id = `${p.id}`
            nome =`${p.nome}`
            birthday = `${p.dataNasc}`
            curso = `${p.curso}`
            anoCurso = `${p.anoCurso}`
            instrumento = `${p.instrumento}`
            page += '<tr>'+
            '<td>' + id + '</td>' + '<td>' + nome + '</td>' +'<td>' + birthday + '</td>' + 
            '<td>' + curso + '</td>' + '<td>' + anoCurso + '</td>' + '<td>' + instrumento + '</td>' + 
                '</tr>'
        });
       
    })
    .catch(function(error) {
        console.log(error);
    });}
    catch(error){
        console.log(error);
    }
    
    page += '</table></body></html>'

    return page;
}

async function instrumentosPage()
{
    page = '<html>\n ' 
    page += setPage
        
    page += '<body><center><h1 style="font-family: Arial, Helvetica, sans-serif;">Lista de Instrumentos</h1><center> ' +
            '<table id="escola" >'+
            '<tr>'+
                '<th>Id</th>'+
                '<th>Descrição</th>'+
            '</tr>'
    try{
     await axios.get('http://localhost:3000/instrumentos')
    .then(function(resp) {
        pubs = resp.data;
        pubs.forEach(p => {
            id = `${p.id}`
            text =`${p['#text']}`
            page += '<tr>'+ '<td>' + id + '</td>' +'<td>' + text + '</td>' +'</tr>'
        });
       
    })
    .catch(function(error) {
        console.log(error);
    });}
    catch(error){
        console.log(error);
    }
    
    page += '</table></body></html>'

    return page;
}

async function cursosPage()
{
    page='<html>\n ' 
    page += setPage
        
    page += '<body><center><h1 style="font-family: Arial, Helvetica, sans-serif;">Lista de Cursos</h1></center> ' +
            '<table id="escola">'+
            '<tr>'+
                '<th>Id</th>'+
                '<th>Designação</th>'+
                '<th>Duração</th>'+
                '<th>Id do Instrumento</th>'+
                '<th>Tipo do Instrumento</th>'+
            '</tr>'
    try{
     await axios.get('http://localhost:3000/cursos')
    .then(function(resp) {
        pubs = resp.data;
        pubs.forEach(p => {
            id = `${p.id}`
            designacao = `${p.designacao}`
            duracao = `${p.duracao}`
            instrumento_Id = `${p.instrumento.id}`
            instrumento_Desc = `${p.instrumento['#text']}`
            page += '<tr>'+ '<td>' + id + '</td>' +'<td>' + designacao + '</td>' +
            '<td>' + duracao + '</td>' +'<td>' +instrumento_Id + '</td>' +
            '<td>' + instrumento_Desc + '</td>' +'</tr>'
        });
       
    })
    .catch(function(error) {
        console.log(error);
    });}
    catch(error){
        console.log(error);
    }
    
    page += '</table></body></html>'

    return page;
}


http.createServer(async function(req, res){
    var myurl = url.parse(req.url, true).pathname
   
    if(myurl == "/"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(mainPage())
        res.end()

    }else if(myurl == "/alunos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(await alunosPage())
        res.end()

    } else if(myurl == "/instrumentos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(await instrumentosPage())
        res.end()

    }else if(myurl == "/cursos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(await cursosPage())
        res.end()
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write('<p>Rota não Suportada: ' + req.url + '</p>')
        res.end()
    }
    
    
}).listen(4000)
console.log("Servidor à escuta na porta 4000...")