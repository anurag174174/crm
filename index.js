var pool = require('../CRM/database/connection')
const express = require('express')
const app = express()
const path = require('path');
const router = express.Router();
var bodyParser = require('body-parser')



app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/pages'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'leadForm.html'));
})

// con.connect(function(err) {
//     if (err) throw err;
//     var sql = "select *from leads"
//     con.query(sql, function(err, result) {
//         if (err) throw err;
//         else {
//             console.log(result)
//         }

//     })
// })

app.post('/', (req, res) => {
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var email = req.body.email
    var phone = req.body.phoneNumber
    var company = req.body.companyName
    var leadScore = req.body.leadScore

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send('Error connecting to database');
            return;
        }

        var sql = "insert into leads(first_name, last_name, email, phone_number, company_name, lead_score,created_at,updated_at) values(?,?,?,?,?,?,NOW(),NOW())"
        connection.query(sql, [firstName, lastName, email, phone, company, leadScore], (error, results) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
                console.error('Error inserting data:', error);
                res.status(500).send('Error inserting data');
                return;
            }

            console.log('Data inserted successfully');
            res.redirect('/leads');

        });
    });
});

app.get('/leads', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send('Error connecting to database');
            return;
        }
        var sql = "SELECT * FROM leads"
        connection.query(sql, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error retrieving data:', error);
                res.status(500).send('Error retrieving data');
                return;
            }

            res.render('leadMainPage', { leads: results });
        });
    });
});

// app.get('/view', function(req, res) {
//     con.connect(function(err) {
//         if (err) throw err;

//         var sql = "select *from leads"
//         con.query(sql, function(error, result) {
//             if (error) throw error;
//             res.sendFile(path.join(__dirname, 'public', 'pages', 'leadMainPage.html'));

//         })
//     })
// })

app.listen(2000)