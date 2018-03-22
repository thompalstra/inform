if( typeof window['idb'] === 'undefined' ){
    window['idb'] = {};
}

class Database{
    constructor(){
        this.db;
        this.objectStore;
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
        this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    }
    connect( storeName, version, onsuccess, onerror ){
        var request = this.indexedDB.open( storeName, version );
        request.onerror = function(event) {
            onerror.call( window, event.target.errorCode );
        }.bind(this);
        request.onupgradeneeded = function(event) {
            this.db = event.target.result;
            this.objectStore = this.db.createObjectStore( storeName, { keyPath: 'id' });
        };
        request.onsuccess = function(event) {
            this.db = event.target.result;
            onsuccess.call( window, new DatabaseRequest( this.db, storeName ) );
        }.bind(this);

    }
}
class DatabaseRequest{
    constructor( db, storeName ){
        this.db = db;
        this.storeName = storeName;
        window['idb'][ storeName ] = this;
    }
    createTransaction(){
        return this.db.transaction([ this.storeName ], "readwrite");
    }
    get( id, onsuccess ){
        this.createTransaction().objectStore( this.storeName ).get( id ).onsuccess = function( event ){
            onsuccess.call( this, event.target.result )
        };
    }
    all( onsuccess ){
        this.createTransaction().objectStore( this.storeName ).getAll().onsuccess = function( event ){
            onsuccess.call( this, event.target.result )
        };
    }
    add( data, onsuccess ){
        if( !data.hasOwnProperty('id') ){
            alert('An ID is required');
        }
        this.createTransaction().objectStore( this.storeName ).add( data ).onsuccess = function( event ){
            onsuccess.call( this, event.target.result )
        };
    }
    put( data, onsuccess ){

        if( !data.hasOwnProperty('id') ){
            alert('An ID is required');
        }

        this.createTransaction().objectStore( this.storeName ).put( data ).onsuccess = function( event ){
            onsuccess.call( this, event.target.result )
        };
    }
    delete( identifier, onsuccess ){
        this.createTransaction().objectStore( this.storeName ).delete( identifier ).onsuccess = function( event ){
            onsuccess.call( this, true )
        };
    }
}
