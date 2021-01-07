const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mongdb_project';


// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  insertDocuments(db, function() {
    indexCollection(db, function() {
      client.close();
    });
  });
});

const insertDocuments = (db, callback) => {
    const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
//insertDocuments(db);
const findDocuments = (db , callback) => {
    const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

const updateDocument = (db, callback) => {
    const collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  

}
const removeDocument = (db, callback) => {
    const collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    

}
const indexCollection = (db, callback) => {
    db.collection('documents').createIndex(
        { "a": 1 },
          null,
          function(err, results) {
            console.log(results);
            callback();
        }
      );
}

//app config
const app = express();
const port = process.env.PORT || 5000



//api routes
app.get('/', (req, res) => {
    res.status(200).send("Welcome to my app!")
})

//listen
app.listen(port, () => {
    return console.log(`listening on port ${port}`)
})