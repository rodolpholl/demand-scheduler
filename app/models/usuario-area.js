var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var schema = new Schema({
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required: true},
    area: {type: Schema.Types.ObjectId, ref: 'Area', required: true},
});

module.exports = mongoose.model('Usuario-Area',schema);