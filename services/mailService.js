"use strict";

const {promisify} = require('util');
const nodemailer  = require('nodemailer');
const ejs         = require('ejs');
const CONFIG      = require('../config/configuration'); 

  module.exports.sendEmail=(email,token)=>
  {
        //
// create reusable transporter object using the default SMTP transport
     const transporter = nodemailer.createTransport({
        port: 465,               // true for 465, false for other ports
        host: "smtp.gmail.com",
           auth: {
                user: 'myshopyfyklm@gmail.com',   //https://myaccount.google.com/lesssecureapps? goto this link and toggle on else it will block your mail
                pass: '5448lord',
             },
        secure: true,
        });
        let rootLink=CONFIG.url;
        const mailData = {
            from: 'robinchacko246@gmail.com',  // sender address
              to: email,   // list of receivers
              subject: 'Enquery',
              text: "reset",
              html: '<p>Click <a href="http://' + rootLink+'/passwordReset/'+token + '/'+email+'">here</a> to reset your password</p>'
            //   html: `<b>Hey there! </b>
            //          <br> click the link below to reset password <br>
                     
            //          <a href="${rootLink}/resetPassword/${token}/${email}">click here</a>
                     
            //          `
                     
                     
                     
            };
            transporter.sendMail(mailData, function (err, info) {
                if(err)
                  console.log(err)
                else
                  console.log(info);
             });
  }






