(function() {
  $(function() {
    var wdt,
      _this = this;
    wdt = $(window).width();
    $("#windowWidth").text(wdt);
    $(winow).on('responsive:breakpoint', function(event, state) {
      return console.log(event, state);
    });
    return $(winow).on('responsive:breakpoint:exit', function(event, state) {
      return console.log(event, state);
    });
  });

}).call(this);
