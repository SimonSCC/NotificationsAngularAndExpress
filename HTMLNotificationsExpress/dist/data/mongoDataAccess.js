"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDataAccess = void 0;
var mongodb_1 = require("mongodb");
var assert = require("assert");
var MongoDataAccess = /** @class */ (function (_super) {
    __extends(MongoDataAccess, _super);
    function MongoDataAccess(url) {
        var _this = this;
        console.log("Oi");
        _this = _super.call(this, url) || this;
        _this.dbName = "NotificationDB";
        _super.prototype.connect.call(_this);
        return _this;
    }
    MongoDataAccess.prototype.findDocument = function (nameOfDoc) {
        // Get the documents collection
        var collection = _super.prototype.db.call(this, this.dbName).collection(nameOfDoc);
        // Find some documents
        collection.find().toArray(function (err, docs) {
            assert.strictEqual(err, null);
            console.log("Found the following records");
            console.log(docs);
            return docs;
        });
    };
    MongoDataAccess.prototype.insertMany = function (objCollectionToInsert, documentToInsertInto) {
        // Get the documents collection
        var collection = _super.prototype.db.call(this, this.dbName).collection(documentToInsertInto);
        // Insert some documents
        collection.insertMany(objCollectionToInsert, function (err, result) {
            assert.strictEqual(err, null);
            console.log("Inserted " + objCollectionToInsert.length + " documents into the collection");
            return true;
        });
    };
    return MongoDataAccess;
}(mongodb_1.MongoClient));
exports.MongoDataAccess = MongoDataAccess;
