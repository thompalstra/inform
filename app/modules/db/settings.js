class Settings{
    constructor( callback ){
        var db = new Database();
        var table = db.connect( 'user.settings', 1, function(data){
            window.idb['user.settings'].all(function(data){
                if( data.length == 0 ){
                    this.username = null;
                } else {
                    data.forEach(function(x){
                        Object.defineProperty( this, x.id, {
                            value: x.value,
                            readable: true,
                            writable: true,
                            enumerable: true
                        } );
                    }.bind(this));
                }
                callback.call( this, data );
            }.bind(this));
        }.bind(this));
    }
    save( callback ){
        var keys = Object.keys( app.settings );
        (function put( i ){
            if( i < keys.length ){
                var index = keys[i];
                this.setItem( index, this[index], function(data){
                    put.call( this, ++i );
                }.bind(this) )
            } else {
                callback.call( this, null );
            }
        }.bind(this))(0);
    }
    setItem( id, value, callback ){
        this[id] = value;
        window.idb['user.settings'].put( {
            id: id,
            value: value
        }, callback);
    }
    getItem( key ){
        return window.idb['user.settings'].get( key );
    }
}
