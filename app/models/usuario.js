var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
mongoose.Promise = require('bluebird');
var Areas = require('./area');


var Schema = mongoose.Schema;

var userSchema = new Schema({

    nome: {type: String, require: true},
    email: {type: String, require: true},
    login: {type: String, require: true, unique: true},
    peso: {type: Number, required: true},
    password: {type: String, require: true},
    areasVinculadas:[{ type: Schema.Types.ObjectId, ref: "Area"}]

});

userSchema.methods.encryptPassowrd = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password); //this indica a instância que o método foi evocado e que já contem o dado da senha. O parâmetro é o que foi informado externametne
};


module.exports = mongoose.model('Usuario',userSchema);