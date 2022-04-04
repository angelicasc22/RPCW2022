var express = require('express');
var fs = require('fs')
var router = express.Router();
var Ficheiro = require('../controllers/ficheiro')
var multer = require('multer')
var upload = multer({dest : 'uploads'})

router.get('/', function(req, res, next) {
  Ficheiro.list()
    .then(data => res.render('index', {list : data}))
    .catch(error => res.render('error', {error : error}))
});

/* POST submissão do ficheiro */ 
router.post('/submitFile',  upload.single('myFile'), (req, res) => {
    var d = new Date().toISOString().substring(0,16)
    //console.log("Dirname ",__dirname)
    let oldPath = __dirname.substring(0, __dirname.length - 7) +'/'+ req.file.path 
    //console.log("Dirname_sub ",oldPath)
    let newPath = __dirname.substring(0, __dirname.length - 7) + '/uploads/' + req.file.originalname
    //console.log("Dirname_sub ",newPath)

    fs.rename(oldPath, newPath, erro => {
      if(erro) throw erro
    })

    var ficheiro = {
      data : d,
      _id : req.file.originalname,
      mimetype :req.file.mimetype,
      size : req.file.size,
      descricao : req.body.descricao
    }

    console.log(req.body.descricao);

    Ficheiro.insert(ficheiro)
      .then(() => res.redirect('/'))
      .catch(e => res.render('error', {error : e}))

})

/* POST apagar o ficheiro */ 
router.post('/deleteFile/:id',  (req, res) => {
  Ficheiro.remove(req.params.id)
  fs.unlinkSync(__dirname.substring(0, __dirname.length - 7) + '/uploads/' + req.params.id)
  res.redirect('/')
})

module.exports = router;