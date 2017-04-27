var express = require('express');
var router = express.Router();

var Areas = require('../models/area');

/* GET home page. */
router.get('/', function(req, res, next) {

Areas.find(function(err,areas) {

    
    
      var successMsg = req.flash('success')[0];
      var listaArea = [];
      for(var i = 0; i < areas.length; i++){
        listaArea.push(areas[i]);
      }

      res.render('areas/list',{listaAreas: listaArea});


  });

});

router.get('/insert', function(req, res, next) {

    res.render("areas/form",{operacao: 'insert',selectedArea: new Areas({peso: 1})});

});

router.post('/insert',function(req,res,next){



  var area = new Areas({
    nome: req.body.nome,
    peso: req.body.peso
  });

  area.save(function(err,data){

    req.flash('success','Compra realizada com Sucesso!');
    res.redirect('/areas/insert');

  });
  

});

router.get('/editar/:id',function(req,res,next){


  Areas.findById(req.params.id,function(err,data){

    res.render('areas/form',{operacao: 'editar',selectedArea: data})

  });

});

router.post('/editar',function(req,res,next){

  Areas.findById(req.body.id,function(err,data){
    

    data.nome = req.body.nome;
    data.peso = req.body.peso;

    data.save(function(err,saved){
      req.flash('success','Compra realizada com Sucesso!');
      res.redirect('/areas');
    });


    

  });

});

module.exports = router;