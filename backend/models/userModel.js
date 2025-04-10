const {Schema, model} =require('../connection');
const mySchema=new Schema({
    name:String,
    email:{type:String,required:true},
    password:{type:String, required:true},
     createdAt:{type:Date,default:Date.now}
});

module.exports=model('user',mySchema);