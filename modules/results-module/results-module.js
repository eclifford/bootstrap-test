(function() {
  (function($, window, document) {
    var VisaResult;
    VisaResult = (function() {
      function VisaResult(el, options) {
        var _this = this;
        this.$el = $(el);
        this.parameters = $.extend({}, $.fn.result.defaults, options);
        if (this.parameters.data != null) {
          $.get(window.bootstrapdirectory + "/modules/results-module/templates/result-module-template.htm", function(template) {
            _this.template = $(template).html();
            $(_this.$el).append(Mustache.render(_this.template, _this.parameters.data));
            if (_this.parameters.data['cta2-data'] == null) {
              return $('.cta-2', _this.$el).hide();
            }
          });
        }
      }

      return VisaResult;

    })();
    return $.fn.result = function(args) {
      var _args, _public;
      _public = [];
      _args = arguments;
      return this.each(function() {
        if ($.inArray(_args[0], _public) !== -1) {
          return this.result[_args[0]].apply($(this).data('result'), Array.prototype.slice.call(_args, 1));
        } else {
          return this.result = new VisaResult(this, args);
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
