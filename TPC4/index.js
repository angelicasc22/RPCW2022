var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static.js')
var {parse} = require('querystring')

function geraPendentes(tasks){
    pagHTML = `
        <ul id="myUL">\n
    `
    tasks.forEach(task => {
        pagHTML +=`
        <li>
  	        <div class="w3-row">
    	        <div class="w3-col l10 s6">
    		        <p>${task.title}</p> 
    		        <p style="color: #696969 ">${task.description}</p> </div>
  		        <div class="w3-col l2 s6" >
        	        <div class="w3-center vertical-align">
                        <a href="/tasks/${task.id}/edit"><i class="fa fa-pencil" aria-hidden="true"></i></a>
                        <a href="/tasks/${task.id}/complete"><i class="fa fa-check-circle-o" aria-hidden="true"></i></a>
                    </div>  
  		        </div>
            </div>
        </li>\n
        `
    })
    pagHTML += `
        </ul>\n
    `
    return pagHTML
}

function geraFeitas(tasks) {
    pagHTML=`
    <ul id="myUL">\n
    `
    tasks.forEach(task => {
        pagHTML+=`
        <li>
  	        <div class="w3-row">
    	        <div class="w3-col l10 s6">
    		        <p>${task.title}</p> 
    		        <p style="color: #696969 ">${task.description}</p> </div>
  		        <div class="w3-col l2 s6" >
        	        <div class="w3-center vertical-align">
                        <a  href="/tasks/${task.id}/delete"><i class="fa fa-times" aria-hidden="true"></i></a>
                    </div>  
  		        </div>
            </div>
        </li>\n
        `
    })
    pagHTML += "</ul>\n"
    return pagHTML
}

function generateEditTasks(tasks, task_id) {
    pagHTML=`
    <ul id="myUL">\n
    `
    tasks.forEach(task => {
        if (task.id == task_id) {
            pagHTML +=`
            <li style="background: lightgray;"> 
                <form action="/tasks/${task.id}/edit" method="POST">
          	        <div class="w3-row">
                        <div class="w3-col l8 s8">
                            <input type="text" id="title" name="title"  style="margin-bottom: 10px;" placeholder="Write a task" value="${task.title}"/>
                            <input id="descrition" name="description" placeholder="When?" value="${task.description}"/>
                        </div>
                        <div class="w3-col l2 s2" style="padding-top: 20px;">
                            <input type="hidden" name="status" value="pending">
                            <input type="submit" value="Submit" class="addBtn"/>
                        </div>
                        <div class="w3-col l2 s2" style="padding-top: 20px;">
                        <a href="/" class="addBtn">Cancel</a>
                        </div>
                    </div>
                </form>
            </li>
            `
        }else{
            pagHTML += `
            <li>
  	        <div class="w3-row">
    	        <div class="w3-col l10 s6">
    		        <p>${task.title}</p> 
    		        <p style="color: #696969 ">${task.description}</p> </div>
  		        <div class="w3-col l2 s6" >
        	        <div class="w3-center vertical-align">
                        <a href="/tasks/${task.id}/edit"><i class="fa fa-pencil" aria-hidden="true"></i></a>
                        <a href="/tasks/${task.id}/complete"><i class="fa fa-check-circle-o" aria-hidden="true"></i></a>
                    </div>  
  		        </div>
            </div>
            </li>\n`
        }
    })
    pagHTML += "</ul>\n"
    
    return pagHTML
}

function recoverInfo(request, callback) {
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = ''
        request.on('data', block => {
            body += block.toString()
        })
        request.on('end', () => {
            console.log(body)
            callback(parse(body))
        })
    }
}

const server = http.createServer(function (req, res) {

    console.log(req.method + " " + req.url)

    // Tratamento do pedido
    if(static.recursoEstatico(req)) {
        static.sirvoRecursoEstatico(req, res)
        return
    }

    switch(req.method){
        case "GET": 
            if(req.url == "/" || /\/tasks\/[0-9]+\/edit/.test(req.url)){
                let task_id = null;
                if (req.url.length > 1)
                    task_id = req.url.split('/')[2]
                fs.readFile("index.html", (err, data) => {
                    if(err) throw "Index.html not found!"
                    var template = data.toString('utf-8')
                    axios.get("http://localhost:3000/tasks?status=pending")
                        .then(response => {
                            const tasks = response.data
                            if(task_id === null)
                                var pending_tasks = geraPendentes(tasks)
                            else {
                                var pending_tasks = generateEditTasks(tasks, task_id)
                            }
                            axios.get("http://localhost:3000/tasks?status=completed")
                            .then(response => {
                                const tasks = response.data
                                var completed_tasks = geraFeitas(tasks)
                                template = template.replace("${pending}", pending_tasks).replace("${completed}", completed_tasks)
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(template)
                                res.end()
                            }).catch(error => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Não foi possível obter a lista de tarefas feitas.</p>")
                                res.end()
                            })
                    }).catch(error => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a lista de tarefas pendentes.</p>")
                        res.end()
                    })
                })
            }
            else if (/\/tasks\/[0-9]+\/complete/.test(req.url)) {
                const task_id = req.url.split('/')[2]
                axios.get("http://localhost:3000/tasks/" + task_id).then(resp => {
                    const task = resp.data
                    task['status'] = 'completed'
                    axios.put('http://localhost:3000/tasks/' + task_id, task).then(resp => {
                        res.writeHead(303, {'Location': '/'}).end()
                    }).catch(erro => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Erro no PUT: " + erro + '</p>')
                        res.end()
                    })
                }).catch(error => {
                    console.log(error)
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(`<p>Não foi possível obter a tarefa ${task_id}.</p>`)
                    res.end()
                })
            }
            else if (/\/tasks\/[0-9]+\/delete\/?/.test(req.url)) {
                const task_id = req.url.split('/')[2]
                axios.delete('http://localhost:3000/tasks/' + task_id).then(resp => {
                    res.writeHead(303, {'Location': '/'}).end()
                }).catch(erro => {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>Erro no DELETE: " + erro + '</p>')
                    res.end()
                })
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break
        case "POST":
            if(req.url.startsWith("/tasks")) {
                recoverInfo(req, result => {
                    console.log("POST de tarefa: "+ JSON.stringify(result))
                    if(req.url == "/tasks") {
                        axios.post('http://localhost:3000/tasks', result).then(resp => {
                            res.writeHead(303, {'Location': '/'}).end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Erro no POST: " + erro + '</p>')
                            res.end()     
                        })
                    }
                    else if(/\/tasks\/[0-9]+\/edit/.test(req.url)) {
                        const task_id = req.url.split('/')[2]
                        result['id'] = task_id
                        axios.put('http://localhost:3000/tasks/' + task_id, result).then(resp => {
                            res.writeHead(303, {'Location': '/'}).end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Erro no POST: " + erro + '</p>')
                            res.end()     
                        })
                    }
                })
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                // Replace this code with a POST request to the API server
                res.write('<p>Recebi um POST não suportado</p>')
                res.write('<p><a href="/">Voltar</a></p>')
                res.end()
            }
            break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
            res.end()
    }
})

server.listen(7777)
console.log('Servidor à escuta na porta 7777...')