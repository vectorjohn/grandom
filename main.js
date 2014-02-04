$(function() {

    var handler = compose( unthis, truncargs );
    var handler1 = curry( handler, 1 );

    var genbtn = $('#simplerng button[name=generate]'),
        output = $('#rng-output'),
        minBox = $('#simplerng input[name=min]'),
        maxBox = $('#simplerng input[name=max]');

    genbtn.click( function() {
        logLine( '' + genRandom() );
    });

    function logLine( txt ) {
        output.children( '.lastitem' )
            .removeClass( 'lastitem' )
            .children().removeClass( 'ui-state-highlight' );

        txt = $('<span class="ui-state-highlight" />').append( txt );

        $('<div class="lastitem"/>')
            .append( txt )
            .appendTo( output );

        output[0].scrollTop = output[0].scrollHeight;
    }

    var validMin = curry( validNumber, 0 ),
        validMax = curry( validNumber, 100 );

    function genRandom() {
        var min = parseInt( validMin( minBox.val() ) ),
            max = parseInt( validMax( maxBox.val() ) ) + 1;

        return Math.floor( Math.random() * (max - min) + min );
    }

    minBox.change( handler1( curry( setOnChange, validMin ) ) );
    maxBox.change( handler1( curry( setOnChange, validMax ) ) );

    //minBox.change( handler1( curry( validNumber, 0 ) ) );
    //maxBox.change( handler1( curry( validNumber, 100 ) ) );

    function validNumber( val, def ) {
        if ( isNaN( parseInt( val, 10 ) ) )
            return def;
        return val;
    }

    function setOnChange( el, fn ) {
        var pre = $(el).val(),
            post = fn( pre );

        if ( pre !== post )
            $(el).val( post );
    }

    function unthis( fn ) {
        return function() {
            return fn.apply( null, [this].concat( toArray( arguments ) ) );
        };
    }

    function truncargs( fn, numArgs ) {
        return function() {
            return fn.apply( this, toArray( arguments ).slice( 0, numArgs ) );
        };
    }

    function toArray( a ) {
        return Array.prototype.slice.call( a );
    }

    function compose( f, g ){
        return function() {
            return f( g.apply( this, arguments ) );
        };
    }

    function curry( fn ) {
        var args = toArray( arguments ).slice( 1 );
        return function() {
            return fn.apply( this, toArray( arguments ).concat( args ) );
        };
    }

    function dbg( fn ){
        return function() {
            debugger;
            return fn.apply( this, arguments );
        };
    }
});
