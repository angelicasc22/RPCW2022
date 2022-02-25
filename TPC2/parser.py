import json
import re
with open("cinemaATP.json", encoding='utf-8') as file:
    data = json.load(file)

filme_nr = 1
ator_nr = 1
atores = {}

prog = re.compile(r'(\(.*\))|(^\($)|(^\)$)|and')

def atorvalido(ator):
    result = prog.match(ator)
    if result: return False
    else: return True

def homePageGenerator():
    homepage_path = "./index.html"
    homepage = open(homepage_path, "w")
    homepage.write( '''
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <title>Indice</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <style>
                a { text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="w3-container" style="text-align: center;">
                <h1>Categorias</h1>
                    <ul class="w3-ul w3-hoverable" style=" width:50%; text-align: center;display: inline-block;">
                        <li><a href=\"http://localhost:7777/filmes\">Filmes</a></li>
                        <li><a href=\"http://localhost:7777/atores\">Atores</a></li>
                    </ul>
            </div>

        </body>
    </html>
    ''')
    homepage.close()

def moviesPageGenerator(data):
    moviespage_path = "./filmes.html"
    moviespage = open(moviespage_path, "w")
    moviespage.write( '''
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <title>Indice</title>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <style>
            a { text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="w3-container" style="text-align: center;">
            <h1>Filmes</h1>
            <ul class="w3-ul w3-hoverable" style=" width:50%; text-align: center;display: inline-block;">
    ''')
    i = 1
    for ele in data:
        numero = str(i)
        moviespage.write("\t\t\t\t<li><a href=\"http://localhost:7777/filmes/f" + numero + "\">" + ele['title'] +"</a></li>\n")
        i += 1
    moviespage.write('''
            </ul>
        </div>
    </body>
</html>     
     ''')

def eachMoviePageGenerator(elem):
    global filme_nr,ator_nr
    link="http://localhost:7777/filmes/f"+str(filme_nr)
    moviex_path = "./filmes/f" + str(filme_nr) + ".html"
    f = open(moviex_path,"w")
    moviex=('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>Indice</title>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <style>
        a { text-decoration: none; }
    </style>
</head>
<body>
    <div class="w3-container">
        <h1><b>'''+elem['title']+'''</b></h1>
    ''')
    moviex+=("\t<h3><b>Ano de Lançamento: </b>" + str(elem['year']) + "</h3>\n")
    moviex+=("\t\t<h3><b>Elenco:</b></h3>\n")
    moviex+=("\t\t<ul class=\"w3-ul w3-hoverable style=\" width:50%; text-align: center;display: inline-block;\">\n")

    for ator in elem["cast"]:
        if atorvalido(ator):
            if ator not in atores:
                atores[ator]=[0,ator_nr,[]]
                ator_nr+=1
            moviex+="\t\t\t<li><a href=\"http://localhost:7777/atores/a"+str(atores[ator][1])+"\">"+ator+"</a></li>\n"  
            atores[ator][0]+=1 #acrescentar 1 à contagem de filmes que ele participa
            atores[ator][2].append((elem["title"],link)) #juntar filme á lista de filmes do ator
    moviex+=("\t\t</ul>\n")
    moviex+=("\t\t<h4><b>Géneros:</b></h4>\n")
    moviex+=("\t\t<ul>\n")
    for g in elem['genres']:
        moviex+=("\t\t\t<li>" + g + "</li>\n")
    moviex+=("\t\t</ul>\n")         
    moviex+=("\t\t<p><a href=\"http://localhost:7777/filmes\" class=\"w3-button w3-black\">Voltar</a></p>\n")
    moviex+=("\t</div>\n")
    moviex+=("</body>\n")
    moviex+=("</html>\n")
    filme_nr+=1
    f.write(moviex)
    f.close()



def actorsPageGenerator(atores):
    global filme_nr,ator_nr,ator
    atores_html ="""
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <title>Indice</title>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <style>
            a { text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="w3-container" style="text-align: center;">
            <h1>Atores</h1>
            <ul class="w3-ul w3-hoverable" style=" width:50%; text-align: center;display: inline-block;">
"""
    for ator in order3:
        #print(order2[ator])
        link="http://localhost:7777/atores/a"+str(atores[ator][1])
        atores_html+="\t\t\t<li><a href=\""+ link +"\">"+ator+"</a></li>\n"
        filename="atores/a"+str(atores[ator][1])+".html"
        ator_html="""<html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <style>
                a { text-decoration: none; }
            </style>
            
            <link rel="stylesheet" href="/w3.css">
            <title>Ator</title>
        </head>
        <body>
            <div class="w3-container">
        """
        ator_html+="\t\t<h1><b>Nome do ator:</b> "+ator+"</h1>\n"
        ator_html+="\t\t<h3><b>Numero de filmes em que participa:</b> "+str(atores[ator][0])+"</h3>\n"
        ator_html+="""        <h3><b>Filmes onde participa:</b></h3>
            <ul class="w3-ul w3-hoverable style=" width:50%; text-align: center;display: inline-block;">
        """
        for (fn,li) in atores[ator][2]:
            ator_html+="\t\t\t<li><a href=\""+ li +"\">"+fn+"</a></li>\n"
        ator_html+="""\t\t</ul>
            <p><a href=\"http://localhost:7777/atores\" class=\"w3-button w3-black\">Voltar</a></p>
        </body>
        </html>"""

        filmeAtor = open(filename, "w")
        filmeAtor.write(ator_html)
        filmeAtor.close()

    atores_html+='''
            </ul>
        </div>
    </body>
</html>     
     '''
    fileAtores = open("./atores.html", "w")
    fileAtores.write(atores_html)
    fileAtores.close()



# Generating Home Page
homePageGenerator()

# Generating Movies Page
moviesPageGenerator(data)

# Generating Each Movie Page
for elem in data:
    eachMoviePageGenerator(elem)

#Ordenar atores
import collections
order1=collections.OrderedDict(sorted(atores.items()))
order2={k: v for k, v in sorted(order1.items(), key=lambda item: item[1])}
order3=reversed(order2)

# Generating Actors Page
actorsPageGenerator(atores)