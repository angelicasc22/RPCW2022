var express = require('express');
var router = express.Router();
var axios = require('axios');

const apikey = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGNiYTg0OWJhYmI2NjdjYmZkYzE2ZSIsImlhdCI6MTY0OTE5NTY1MiwiZXhwIjoxNjUxNzg3NjUyfQ.EuvH713Qr6IZ073-5FMF6j5p_3tb6Trv0TOOF5ZHWOPUlCBqKU1H9DTo_ueoCyWhPbEd6F8xzNvn-UkG3J8Ppq65xF8uukoElnSIsi3kldXI2E_EHMv5ETIq-2SGpiBmLyv1zu2broi-nXw18XwKM-WWpoumw5mZacg1qyj4kokGm--WzPIDD15Uibu2ObsDfeHpbDt81Npq-WgEVe56F5w0TdAvY_b-Xvm77hXI4MuaatL9bsOtYEyiepLuBelDyVWjAIoon3-7tB1lwrPnC0OJ_cxKUyCdqx8sZPkmciyTmBsV8fDTyvTP1ibiryAQsDRK5TrG83CcWmStZyDnoQ"

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('http://clav-api.di.uminho.pt/v2/classes?nivel=1&apikey='+apikey)
      .then(resp => {
        res.render('index', { classes : resp.data })
      })
      .catch( error => {
        res.render('error', { error : error })
      })
});

/* GET pagina de cada classe. */
router.get('/:id', function(req, res, next) {
  classe = req.params.id
  axios.get('http://clav-api.di.uminho.pt/v2/classes/c'+classe+'?apikey='+apikey)
      .then(resp => {
        res.render('classe', { classe : resp.data })
      })
      .catch( error => {
        res.render('error', { error : error })
      })
});


module.exports = router;
