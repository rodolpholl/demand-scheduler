var passport = require('passport');
var Usuario = require('../models/usuario');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(usuario,done){
    done(null, usuario.id);
});

passport.deserializeUser(function(id,done){
    Usuario.findById(id,function(err,user){
        done(err, user);
    });
});