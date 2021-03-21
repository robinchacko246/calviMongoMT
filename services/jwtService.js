
const fs          = require('fs');
const jwt         = require('jsonwebtoken');
const {promisify} = require('util');
const jwtVerify   = promisify(jwt.verify);
const jwtSign     = promisify(jwt.sign);

/* For JWT Verification 
   @i => Issuer
   @s => Subject
   @a => Audience
*/   

class jwtToken {
    
    constructor(){
        this.privateKEY    = fs.readFileSync('./config/private.key', 'utf8');
        this.publicKEY     = fs.readFileSync('./config/public.key', 'utf8');
        this.i             = 'Emvigo#2018';                  
        this.s             = 'JWT Securitty'; 
        this.a             = 'https://proveprivacy.com';      
        this.signOptions   = {issuer:this.i,subject:this.s,audience:this.a,algorithm:"RS256"};
        this.verifyOptions = {issuer:this.i,subject:this.s,audience:this.a,algorithm:["RS256"]};
        
    }

    async generateToken(payload){
        try{
            let token = await jwtSign(payload,this.privateKEY, this.signOptions);
            return token;
        }catch(err){
            return err;
        }
       
    }

    async verifyToken(token){
        try{
            let legit = await jwtVerify(token,this.publicKEY,this.verifyOptions);
            return legit;
        }catch(err){
            return err;
        }
       
       
    }


}

module.exports =  jwtToken;
   