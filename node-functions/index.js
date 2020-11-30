const fetch = require('node-fetch');
const cors = require('cors')({ origin: true });
const express = require('express')
const https = require('https');
const bodyParser = require('body-parser');
const request = require('request');


const app = express()
const port = 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// funksjon som henter authcode fra softrig, redirectes til klient app med kode
const getAuthCode = () => {

  app.get('/getAuthCode', (req, res) => {
    if (req.method !== 'GET') {
      res.status(403).send('Forbidden');
    } else {
      cors(req, res, () => {
        const OAUTH_REDIRECT_URL = `https://test-login.softrig.com/connect/authorize?client_id=5d7f9666-42f9-48cb-8260-0e2a25c81427&redirect_uri=http://localhost:3000/contacts&response_type=code&prompt=login&scope=profile%20openid%20offline_access%20AppFramework&state=teststate`;
        res.writeHead(302, {
          'Location': OAUTH_REDIRECT_URL
        });
        res.end();
      });
    }
  })
}
getAuthCode()

//funksjon som henter authcode fra klient url, så kjøres bytte mot tokens
app.post('/postToken', async (req, res) => {
  cors(req, res, async () => {
    res.set('Access-Control-Allow-Origin', '*');
    let authCode = req.query.code
    console.log(authCode)

    let requestOptions = {
      url: 'https://test-login.softrig.com/connect/token',
      method: 'POST',
      auth: {
        user: '',
        pass: ''
      },
      form: {
        'grant_type': 'authorization_code',
        'code': authCode,
        'redirect_uri': `http://localhost:3000/contacts`,
      }
    };
    request(requestOptions,
      (err, response) => {
        let token = JSON.parse(response.body);
        let mytoken = token.access_token
        res.send(JSON.stringify(mytoken))
      })
  })
})


// funksjon som henter kontakter fra softrig apiet
app.post('/getContacts', async (req, res) => {
  cors(req, res, async () => {
    res.set('Access-Control-Allow-Origin', '*');

    let obj = await req.body;

    const request = await fetch(`https://test.softrig.com/api/biz/contacts?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress&hateoas=false&top=10`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${obj.token}`,
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    const body = await response.text()
    res.send(body)
  })
})


// poster ny kontakt til softrig api'et 
app.post('/newContact', async (req, res) => {
  cors(req, res, async () => {
    res.set('Access-Control-Allow-Origin', '*');

    let contactObj = await req.body;

    let contactJson = {
      "Info": {
        "Name": contactObj.contactName
      },
      "InvoiceAddress": {
        "AddressLine1": contactObj.address,
        "City": contactObj.city,
        "Country": contactObj.country
      },
      "DefaultPhone": {
        "Number": contactObj.phoneNum
      },
      "DefaultEmail": {
        "EmailAddress": contactObj.email
      }
    }

    const request = await fetch(`https://test.softrig.com/api/biz/contacts`, {
      method: 'POST',
      body: JSON.stringify(contactJson),
      headers: {
        Authorization: `Bearer ${contactObj.token}`,
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    //console.log(response)
    res.send()
  })
})

// redigering av kontakt
app.post('/editContact', async (req, res) => {
  cors(req, res, async () => {
    res.set('Access-Control-Allow-Origin', '*');

    let contactObj = await req.body;
    
    let contactJson = {
      "Info": {
        "Name": contactObj.contactName
      }
    }

    const request = await fetch(`https://test.softrig.com/api/biz/contacts/${contactObj.contactId}`, {
      method: 'PUT',
      body: JSON.stringify(contactJson),
      headers: {
        Authorization: `Bearer ${contactObj.token}`,
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    //console.log(response)
    res.send()
  })
})


// henting av spesifikk kontakt med ID, info sendes tilbake til klient side
app.post('/getContact', async (req, res) => {
  cors(req, res, async () => {
    res.set('Access-Control-Allow-Origin', '*');

    let obj = await req.body;

    // get på den spesifikke kontakten
    const request = await fetch(`https://test.softrig.com/api/biz/contacts/${obj.contactId}?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${obj.token}`,
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    const body = await response.text()
    res.send(body)
  })
})




// sletting av kontakt
app.post('/deleteContact', async (req, res) => {
  cors(req, res, async () => {
    res.set('Access-Control-Allow-Origin', '*');

    let obj = await req.body;
    console.log(obj.id)

    const request = await fetch(`https://test.softrig.com/api/biz/contacts/${obj.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${obj.token}`,
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    const body = await response.text()
    res.send(response)
  })
})

const getOne = () => {
  app.get('/yoyo', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const txt = "kva gjer du på"
    res.send(JSON.stringify(txt))
  })
}

app.listen(port, () => console.log('Server ready'))
