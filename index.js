// express

// const, require
require('dotenv').config();
const express = require("express");
const serveStatic = require('serve-static');
const app = express();
const port = process.env.PORT || 8000;
const getdb = require('./mongo');
const ipfilter = require('express-ipfilter').IpFilter;
const ips = ['127.0.0.1'];
// use
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(serveStatic('Public', { 'index': ['index.html', 'index.htm'] }))
// get
app.get('/db', ipfilter(ips, {mode: 'allow'}), async function(req, res){
   getdb.get_from_database_all(req, res);
})

app.get('/trial', async function(req, res){
  getdb.get_trial(req, res);
})


app.post('/del', async function(req, res){
    getdb.delete_db_all(req, res);
 })


 app.post('/ado', async function(req, res){
  getdb.add_one_db(req, res);
})

app.post('/sort', async function(req, res){
  getdb.sort_by(req, res);
})

app.post('/uo', async function(req, res){
  getdb.update_one_db(req, res);
})

app.post('/do', async function(req, res){
  getdb.delete_one(req, res);
})

app.post('/dm', async function(req, res){
  getdb.delete_many(req, res);
})


// listen
app.listen(port, () => {
  console.log(`Działający port ${port}!`);
});
