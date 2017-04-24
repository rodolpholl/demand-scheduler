var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var schema = new Schema({
    nome: {type: String, required: true},
    peso: {type: Number, required: true}
});

module.exports = mongoose.model('Area',schema);