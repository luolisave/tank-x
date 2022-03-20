var start = new Date();
var i = 0, interval = setInterval(function(){
    if (++i >= 1000) {
        var end = new Date();
        var result = (end-start)/1000;
        console.log("The average interval was "+result+" milliseconds");
        // $('#result').text("The average interval was "+result+" milliseconds");
        // $('#browser').text(navigator.userAgent);
        clearInterval(interval);
    }
}, 0);


// for browser
/*
var start = new Date();
var i = 0, interval = setInterval(function(){
    if (++i >= 1000) {
        var end = new Date();
        var result = (end-start)/1000;
        $('#result').text("The average interval was "
                          +result+" milliseconds");
        $('#browser').text(navigator.userAgent);
        clearInterval(interval);
    }
}, 0);
//*/