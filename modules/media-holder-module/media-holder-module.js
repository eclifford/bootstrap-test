(function() {
  (function($, window, document) {
    var MediaHolder;
    MediaHolder = (function() {
      function MediaHolder(el, options) {
        var _this = this;
        this.$el = $(el);
        this.parameters = $.extend({}, $.fn.mediamodule.defaults, options);
        if (this.parameters.data != null) {
          $.get(window.bootstrapdirectory + "/modules/media-holder-module/templates/media-holder-module-template.htm", function(template) {
            _this.template = $(template).html();
            return $(_this.$el).append(Mustache.render(_this.template, _this.parameters.data['module-data'][0]));
          });
        } else {
          throw new Error('Media Holder Module :: Please pass me a data object');
        }
      }

      return MediaHolder;

    })();
    return $.fn.mediamodule = function(args) {
      var _args, _public;
      _public = [];
      _args = arguments;
      return this.each(function() {
        if ($.inArray(_args[0], _public) !== -1) {
          return this.result[_args[0]].apply($(this).data('media'), Array.prototype.slice.call(_args, 1));
        } else {
          return this.result = new MediaHolder(this, args);
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
