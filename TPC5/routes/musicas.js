var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET home page. */
router.get(['/', '/musicas','/musicas/prov/:prov'], function(req, res, next) {
  if (req.query.prov) prov = req.query.prov
  else if (req.params.prov) prov = req.params.prov
  else prov = ""
  console.log("prov : " + prov)
  axios.get("http://localhost:3000/musicas" + (prov != "" ? `?prov=${prov}` : ''))
    .then(response => {
      var lista = response.data
      res.render('musicas', { musicas: lista });
      })
      .catch(function(erro){
        res.render('error', { error: erro });
      })
});

/* GET pagina de cada musica */
router.get('/musicas/:id', function(req, res, next) { //os : antes de id na rota quer dizer que aquilo não é texto, é uma rota variável
  axios.get("http://localhost:3000/musicas?id=" + req.params.id) 
    .then(response => {
      var dados = response.data[0]

      res.render('musica', { musica: dados });
      })
      .catch(function(erro){
        res.render('error', { error: erro });
      })
});

module.exports = router;
