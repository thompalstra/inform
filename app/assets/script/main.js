doc.on('click', '[on="click"]', function(event){
    var eventType = this.getAttribute('do');
    var target = this;

    if( this.hasAttribute( 'target' ) ){
        target = doc.one( this.getAttribute('target') );
    }

    target.do(eventType);
});
