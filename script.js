require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

var access_token = '';

app.set('view engine', 'ejs');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.get('/', (req, res) => {
    res.render('index', {client_id: CLIENT_ID});
});

app.get('/github/callback', (req, res) => {
    const requestToken = req.query.code;
    
    axios({
        method: "post",
        url: `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {
        access_token = response.data.access_token;
        res.redirect('/success');
    })
    .catch((error) => {
        console.log(error);
    });
});

app.get('/success', (req, res) => {
    axios({
        method: "get",
        url: "https://api.github.com/user",
        headers: {
            Authorization: 'token ' + access_token
        }
    }).then((response) => {
        res.render('success', { userData: response.data });
    })
    .catch((error) => {
        console.log(error);
    });
});

app.listen('3000', () => {
    console.log('Server started');
});
