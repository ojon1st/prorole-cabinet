var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "serveur.ex2-r4.com",
    port: 465,
    secure: true,
    auth: {
        user: 'admin@prorole-ne.com',
        pass: '3o-2Ah__OuhG'
    },
    tls:{
      rejectUnauthorized: false
    }
});

var mailOptions = {
    from: 'Site Web <admin@prorole-ne.com>', // sender address
    to: 'a.garba@hotmail.fr', // list of receivers
    subject: 'Hello', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
        console.log('error : ' + err);
        return;
    }
    console.log('mail sent successfully');
});