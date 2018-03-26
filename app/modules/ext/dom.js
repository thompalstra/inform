console.log('extending dom...');

var extend = function(){
    return ex = {
        args: arguments,
        with: function( obj ){
            for(let i in this.args){
                var arg = this.args[i];

                if( typeof arg.prototype === 'object' ){
                    for(let i in obj){
                        arg.prototype[i] = obj[i]
                    }
                } else {
                    arg[i] = obj[i];
                }
            }
        }
    };
}

var send = function( obj ){
    var obj = send.validate( obj );

    var xhr = new XMLHttpRequest();
    xhr.open( obj.method, obj.url );
    xhr.responseType = obj.responseType;
    xhr.onreadystatechange = function( event ){
        if( this.readyState == 4 ){
            this.onsuccess.call( this, this );
        }
    }.bind( xhr );
    xhr.onerror = obj.onerror;
    xhr.onsuccess = obj.onsuccess;
    xhr.send( obj.data );
}
send.validate = function( obj ){
    if( typeof obj === 'string' ){
        obj = {
            url: obj
        };
    }
    if( typeof obj.method === 'undefined' ){
        obj.method = 'get';
    }
    if( typeof obj.url === 'undefined' ){
        obj.url = location.href;
    }
    if( typeof obj.responseType === 'undefined' ){
        obj.responseType = '';
    }
    if( typeof obj.onsuccess === 'undefined' ){
        obj.onsuccess = function(){};
    }
    if( typeof obj.onerror === 'undefined' ){
        obj.onerror = function(){};
    }
    if( typeof obj.headers === 'undefined' ){
        obj.headers = [];
    }
    if( typeof obj.data === 'undefined' ){
        obj.data = {};
    }
    return obj;
}

var doc = document;
var body = document.body;
var head = document.head;

extend( String ).with({
    trimFirst: function( char ){
        var _char = this[0];
        if( _char == char ){
            this.substring( 0, this.length -1 );
        }
        return this;
    },
    trimLast: function( char ){
        var _char = this[ this.length-1 ];
        if( _char == char ){
            // this.substring( 0, this.length -2 );
        }
        return this;
    }
})


extend( HTMLElement, Document ).with({
    one: function( q ){
        return this.querySelector( q );
    },
    find: function( q ){
        return this.querySelectorAll( q );
    },
    on: function( eventTypes, b, c, d ){

        // element.on(eventType, callback, bool);
        // element.on(eventType, query, callback, bool);

        eventTypes.split(' ').forEach(function(eventType){
            if( typeof b === 'function' ){
                if( typeof c === 'undefined' ){
                    c = true;
                }
                this.addEventListener( eventType, function( originalEvent ){
                    if( originalEvent.defaultPrevented ){
                        return;
                    }
                    b.call( this, originalEvent );
                }, c );
            } else if( typeof b === 'string' ){
                if( typeof d === 'undefined' ){
                    d = true;
                }
                this.addEventListener( eventType, function( originalEvent ){
                    if( originalEvent.target.matches( b ) ){
                        c.call( originalEvent.target, originalEvent );
                        // console.log(originalEvent.defaultPrevented);
                    } else if( d === true && ( closest = originalEvent.target.closest( b ) ) ){
                        c.call( closest, originalEvent );
                        // console.log(originalEvent.defaultPrevented);
                    }
                } );
            } else {
                console.error('Invalid argument. Expecting string or callable');
            }
        }.bind(this));
    },
    do: function( eventType ){
        var customEvent = new CustomEvent( eventType );
        this.dispatchEvent( customEvent );
        return customEvent;
    }
})
extend( HTMLElement ).with({
    load: function( obj ){
        var obj = send.validate( obj );
        obj.responseType = 'document';

        if( typeof obj.onsuccess !== 'function' ){
            obj.onaftersuccess = function(){};
        } else {
            obj.onaftersuccess = obj.onsuccess;
        }

        obj.onsuccess = function( xhr ){
            if( xhr.statusText.length > 0 ){
                this.innerHTML = xhr.response.head.innerHTML + xhr.response.body.innerHTML;
            }
            if( typeof this.dataset.evalJs === 'string' ){
                this.do('before.eval');
                this.querySelectorAll('script').forEach(function(script){
                    eval(script.innerHTML);
                }.bind(this));
                this.do('after.eval');
                obj.onaftersuccess.call( this, xhr );
            }

        }.bind(this);
        send( obj );
    },
    siblings: function( includeSelf ){
        if( typeof includeSelf == 'undefined' ){
            includeSelf = false;
        }

        var collection = new HTMLElementCollection();
        for( var i = 0; i < this.parentNode.children.length; i++ ){
            if( this.parentNode.children[i] == this && includeSelf == true ){
                collection.appendChild( this.parentNode.children[i] );
            } else {
                collection.appendChild( this.parentNode.children[i] );
            }
        }
        return collection;
    }
})

class HTMLElementCollection{
    constructor(){
        this.length = 0;
    }
    appendChild( el ){
        this[ this.length++ ] = el;
    }
}

extend( Document ).with({
    create: function( tag, params ){
        var element = document.createElement( tag );
        if( typeof params == 'object' ){
            for( var i in params ){
                if( typeof element[i] !== 'undefined' ){
                    element[i] = params[i];
                } else {
                    element.setAttribute( i, params[i] );
                }
            }
        }
        return element;
    }
});

extend( HTMLFormControlsCollection, NodeList, HTMLElementCollection ).with({
    on: function(){
        this.delegate( 'on', arguments );
    },
    do: function(){
        this.delegate( 'do', arguments );
    },
    delegate: function( name, args ){
        for(var i = 0; i < this.length; i++){
            // this[i].do.apply( this[i], arguments );
            this[i][name].apply( this[i], args );
        }
    }
})

extend( HTMLFormControlsCollection, HTMLElementCollection  ).with({
    forEach: function( callback ){
        for( var i = 0; i < this.length; i++ ){
            callback.call( this, this[i] );
        }
    }
});

doc.on('DOMContentLoaded', function(event){
    doc.do('ready');
})

console.log('extending dom... complete');
