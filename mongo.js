const {
  MongoClient
} = require("mongodb");
const ObjectId = require('mongodb').ObjectID;
const url = process.env.MongoUrl;
const fs = require('fs');
const rul = require('url');


// get all data from db
const get_from_database_all = async (req, res) => {
  const client = new MongoClient(url, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("contact");
    const collection = database.collection("contact");
    let find = new Promise(reso => {
      collection.find({}).sort({"_id": -1}).toArray(function (err, result) {
        if (err) {
          client.close();
          throw err;
        }
        if (result.length == 0) {
          res.json({
            empty: "Brak danych w bazie",
            length: 0
          });
          client.close();
        } else {
          res.send(result);
          client.close();
        }
      });
    })
    await find;
    client.close();
  } catch (e) {
    if (e) {
      client.close();
      throw e;
    }
  }
};



// add one to db
const add_one_db = async (req, res) => {
  const client = new MongoClient(url, {
    useUnifiedTopology: true
  });
  try {
    await client.connect();
    const database = client.db("contact");
    const collection = database.collection("contact");
    collection.insertOne({
        Imie: req.body.Imie,
        Nazwisko: req.body.Nazwisko,
        Telefon: req.body.Telefon,
        Grupa: req.body.Grupa,
      },
      function (err, dat) {
        if (err) {
          client.close();
          throw err;
        } else {
          res.json(dat.ops[0]);
          client.close();
        }
      }
    );
  } catch (e) {
    if (e) {
      client.close();
      throw e;
    }
  }
};


// update one to db
const update_one_db = async (req, res) => {
  const client = new MongoClient(url, {
    useUnifiedTopology: true
  });
  try {
    await client.connect();
    const database = client.db("contact");
    const collection = database.collection("contact");
    collection.updateOne(
      { "_id" : ObjectId(req.body.ID) },
      { $set: {
          'Imie': req.body.Imie,
          'Nazwisko': req.body.Nazwisko,
          'Telefon': req.body.Telefon,
          'Grupa': req.body.Grupa,
        }},
      function (err, dat) {
        if (err) {
          client.close();
          throw err;
        } else {
          res.json({'info': `${dat.modifiedCount} kontakt został zaktualizowany`});
          client.close();
        }
      }
    );
  } catch (e) {
    if (e) {
      client.close();
      throw e;
    }
  }
};



// delete db all data
const delete_db_all = async (req, res) => {
  const client = new MongoClient(url, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("contact");
    const collection = database.collection("contact");
    collection.deleteMany({})
      .then((result) => {
        res.json({
          info: `Usunięto: ${result.deletedCount} kontaktów`,
        });
        client.close();
      })
  } catch (e) {
    client.close();
    console.log(e);
  }
};



// delete db one data
const delete_one = async (req, res) => {
  const client = new MongoClient(url, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("contact");
    const collection = database.collection("contact");
    collection.deleteOne({
        "_id": ObjectId(`${req.body.id}`)
      })
      .then((result) => {
        if (result.deletedCount != 0) {
          res.json({
            info: "Usunięto kontakt",
          });
          client.close();
        }
      });

  } catch (e) {
    client.close();
    if (e) console.log(e);
  }
};



// delete db many data
const delete_many = async (req, res) => {
  const client = new MongoClient(url, {
    useUnifiedTopology: true,
  });
  try {
    const objectsId = [];
    for (let i = 0; i < req.body.id.length; i++) {
      objectsId.push(ObjectId(`${req.body.id[i]}`));
    }
    await client.connect();
    const database = client.db("contact");
    const collection = database.collection("contact");
    collection.deleteMany({
        '_id': {
          $in: objectsId
        }
      })
      .then((result) => {
        let delLong = result.deletedCount;
        if (delLong == req.body.id.length) {
          res.json({
            info: `Usunięto ${delLong} kontakty(ów) z bazy`,
          });
          client.close();
        }
      });

  } catch (e) {
    client.close();
    if (e) console.log(e);
  }
};




// zaladuj org baze
const get_trial = async (req, res) => {
  const client = new MongoClient(url, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("contact");
    fs.readFile('contact-bcp.json', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      database.collection("contact").insertMany(JSON.parse(data))
        .then((result) => {
          res.json({
            "info": `Dodano do bazy ${result.insertedCount} kontaktów`
          });
          client.close();
        });
    });
  } catch (e) {
    console.log(e);
    client.close();
  }
};



// get all data from db
const sort_by = async (req, res) => {
  console.log(rul.hostname, rul.parse('localhost').host, rul.parse('localhost').path);
  const client = new MongoClient(url, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("contact");
    const collection = database.collection("contact");
    let find = new Promise(reso => {
      collection.find({}).sort(  { [`${req.body.by}`]: parseInt(req.body.sort), [`${req.body.byNext}`]: 1 }  ).limit(parseInt(req.body.limit)).toArray(function (err, result) {
        if (err) {
          client.close();
          throw err;
        }
        res.send(result);
        client.close();
      });
    })
    await find;
    client.close();
  } catch (e) {
    if (e) {
      client.close();
      throw e;
    }
  }
};


exports.get_from_database_all = get_from_database_all;
exports.delete_db_all = delete_db_all;
exports.add_one_db = add_one_db;
exports.update_one_db = update_one_db;
exports.delete_one = delete_one;
exports.delete_many = delete_many;
exports.get_trial = get_trial;
exports.sort_by = sort_by;