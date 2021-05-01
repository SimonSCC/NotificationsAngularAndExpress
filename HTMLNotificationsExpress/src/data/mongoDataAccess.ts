import { Db, MongoClient } from "mongodb";

const assert = require("assert");

export class MongoDataAccess extends MongoClient {
  dbName: string;

  constructor(url: string) {
    console.log("Oi");
    super(url);
    this.dbName = "NotificationDB";

    super.connect();
  }

  findDocument(nameOfDoc: string) {
    // Get the documents collection
    const collection = super.db(this.dbName).collection(nameOfDoc);
    // Find some documents
    collection.find().toArray(function (err: any, docs: any) {
      assert.strictEqual(err, null);
      console.log("Found the following records");
      console.log(docs);
      return docs;
    });
  }

  insertMany(objCollectionToInsert: Object[], documentToInsertInto: string) {
    // Get the documents collection
    const collection = super.db(this.dbName).collection(documentToInsertInto);
    // Insert some documents
    collection.insertMany(objCollectionToInsert, function (err, result) {
      assert.strictEqual(err, null);
      console.log(`Inserted ${objCollectionToInsert.length} documents into the collection`);
      return true;
    });
  }
}
