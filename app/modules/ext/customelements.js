console.log('extending elements...');

define = function( tag, constr ){
    if( typeof customElements == 'undefined' ){
        document.createElement( tag, constr );
    } else {
        customElements.define( tag, constr );
    }
}

class xBaseElement extends HTMLElement{
    constructor(){
        super();
    }

    get show(){
        return this.hasAttribute('show') ? true : false;
    }
    set show( value ){
        return this.hasAttribute('show') ? this.removeAttribute('show') : this.setAttribute('show', '');
    }
}

class xAppElement extends xBaseElement{}

class xLayoutsElement extends xBaseElement{
    open( url, onsuccess, onerror ){
        var layout =  doc.create('x-layout', {
            'id': this.generateID( url ),
            'data-eval-js': ''
        });

        var layout = this.appendChild( layout );

        if( typeof onsuccess !== 'function' ){
            onsuccess = function(){};
        }
        if( typeof onerror !== 'function' ){
            onerror = function(){};
        }
        layout.load( {
            url: url,
            onsuccess: function(event){
                this.setAttribute('data-showing', '');
                setTimeout(function(e){
                    this.removeAttribute('data-showing');
                    this.setAttribute('data-show', '');
                    onsuccess.call(this, event);
                }.bind(this), 500);
            },
            onerror: function(err){
                onerror.call(this, err);
            }
        } );
    }
    generateID( url ){
        return (url).replace(/\//g, "-").replace(/\./g, "-");
    }
    close( instance ){
        instance.setAttribute('data-dismissing', '');
        setTimeout(function(e){
            instance.removeAttribute('data-dismissing');
            instance.setAttribute('data-dismissed', '');
            instance.remove();
        });
    }
}
class xLayoutElement extends xBaseElement{
    connectedCallback(){
        this.on('dismiss', function(event){
            this.close();
        })
    }
    loading( bool, innerHTML ){
        if( bool === true ){
            var loadElement = this.appendChild( doc.create('x-loading', {
                innerHTML: "<x-message>" + innerHTML + "</x-message>"
            }) );
        } else {
            var loadElement = this.one('x-loading');
            if( loadElement ){
                loadElement.remove();
            }
        }
    }
    close(){
        var beforedismiss = this.do('beforedismiss');
        if( beforedismiss.defaultPrevented == false ){
            this.setAttribute('data-dismissing', '');
            setTimeout(function(e){
                this.removeAttribute('data-dismissing');
                this.setAttribute('data-dismissed', '');
                this.remove();
            }.bind(this), 300);
        }
    }
}

class xContentElement extends xBaseElement{
    open( url, onsuccess, onerror ){
        if( typeof onsuccess !== 'function' ){
            onsuccess = function(){};
        }
        if( typeof onerror !== 'function' ){
            onerror = function(){};
        }
        this.load( {
            url: url,
            onsuccess: function(event){
                this.setAttribute('data-showing', '');
                setTimeout(function(e){
                    this.removeAttribute('data-showing');
                    this.setAttribute('data-show', '');
                    onsuccess.call(this, event);
                }.bind(this), 500);
            },
            onerror: function(err){
                onerror.call(this, err);
            }
        } );
    }
}


define('x-app', xAppElement);
define('x-layouts', xLayoutsElement);
define('x-layout', xLayoutElement);
define('x-content', xContentElement);


console.log('extending elements... complete');
