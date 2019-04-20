const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:String,
    name:String,
    password:String,
    bio:String,
    spec:String
})

const exerciseSchema = new Schema({
    meters:Number,
})

const fatSchema = new Schema({
    type:String
})

const specSchema = new Schema({
    bmi:Number,
    insulin:Number,
    glucose:Number,
    triceps:Number,
    bpressure:Number
});

const fitSchema = new Schema({
    exercise:String,
    fat:String,
    spec:String
});

Exercise = mongoose.model('Exercise',exerciseSchema);

Fat = mongoose.model('Fat',fatSchema)

Fit = mongoose.model('Fit',fitSchema);

Spec = mongoose.model('Spec', specSchema);

User = mongoose.model('User',userSchema);

module.exports = {
    User:User,
    Spec:Spec,
    Fit:Fit,
    Exercise:Exercise,
    Fat:fatSchema
}
