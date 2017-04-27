var express = require('express');
var router = express.Router();

var Usuarios = require('../models/usuario')
var Areas = require('../models/area');



router.get('/', function (req, res, next) {



    Usuarios.find().populate("areasVinculadas").exec(function (err, usuarios) {


        var successMsg = req.flash('success')[0];
        var listaUsuarios = [];
        for (var i = 0; i < usuarios.length; i++) {
            var usuario = usuarios[i];
            listaUsuarios.push({
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                login: usuario.login,
                peso: usuario.peso,
                areasVinculadas: usuario.areasVinculadas,
                possuiAreasVinculadas: usuario.areasVinculadas.length > 0
            });
        }

        res.render('usuarios/list', { listaUsuarios: listaUsuarios });

    });



});

router.get('/insert', function (req, res, next) {

    Areas.find(function (err, areas) {


        var successMsg = req.flash('success')[0];
        var listaArea = [];
        for (var i = 0; i < areas.length; i++) {
            listaArea.push({

                id: areas[i]._id,
                nome: areas[i].nome,
                selected: false
            });
        }

        res.render('usuarios/form', { listaAreas: listaArea, selectedUser: new Usuarios({ peso: 1 }), operacao: 'insert' });

    });

});

router.post('/insert', function (req, res, next) {

    var usuario = new Usuarios({
        nome: req.body.nome,
        login: req.body.login,
        peso: req.body.peso,
        email: req.body.email,
        password: '',
        areasVinculadas: []
    });



    if (req.body.areasSelecionadas == '') {

        usuario.save(function (err, data) {
            var successMsg = req.flash('success')[0];
            res.render('usuarios/insert');
        });

    }
    else {
        var j = 0;
        var lstAreaSelect = req.body.areasSelecionadas.split(',');
        for (var i = 0; i < lstAreaSelect.length; i++) {
            areaSelec = lstAreaSelect[i];
            Areas.findById(areaSelec, function (err, area) {
                usuario.areasVinculadas.push(area);
                j = j + 1;
                if (j == lstAreaSelect.length)
                    usuario.save(function (err, data) {
                        var successMsg = req.flash('success')[0];
                        res.render('usuarios/insert');
                    });
            });
        }

    }


});

router.get("/editar/:id", function (req, res, next) {

    var dtAreas = [];
    Areas.find(function (err, data) {
        dtAreas = data;

        Usuarios.findById(req.params.id).populate('areasVinculadas').exec(function (err, usuario) {

            var listaAreas = [];

            for (var i = 0; i < dtAreas.length; i++) {

                var area = dtAreas[i];
                var areaRet = {
                    id: area._id,
                    nome: area.nome,
                    selected: false
                };
                

                if (usuario.areasVinculadas[0] != null) {
                    for (var j = 0; j < usuario.areasVinculadas.length; j++) {

                        var areaVinculada = usuario.areasVinculadas[j];
                        if (area._id.toString() == areaVinculada._id.toString()) {
                            areaRet.selected = true;
                            break;
                        }
                    }
                }

                listaAreas.push(areaRet);

            }


            res.render('usuarios/form', { listaAreas: listaAreas, selectedUser: usuario, operacao: 'editar' })

        });
    });

});

router.post('/editar',function(req,res,next){

    Usuarios.findById(req.body.id,function(err,usuario){


        usuario.nome  = req.body.nome;
        usuario.login = req.body.login;
        usuario.peso  = req.body.peso;
        usuario.email = req.body.email;
        usuario.areasVinculadas = [];
        if (req.body.areasSelecionadas == ''){
            usuario.save(function (err, data) {
                            var successMsg = req.flash('success')[0];
                            res.render('/usuarios');
                        });
        }   
        else {
            var lstAreaSelect = req.body.areasSelecionadas.split(',');
            
            var j = 0;
            for (var i = 0; i < lstAreaSelect.length; i++) {
                areaSelec = lstAreaSelect[i];
                Areas.findById(areaSelec, function (err, area) {
                    usuario.areasVinculadas.push(area);
                    j = j + 1;
                    if (j == lstAreaSelect.length)
                        usuario.save(function (err, data) {
                            var successMsg = req.flash('success')[0];
                            res.render('/usuarios');
                        });
                });
            }

        }
        

    });

});



module.exports = router;