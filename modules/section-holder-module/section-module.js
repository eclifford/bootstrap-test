(function() {
  (function($, window, document) {
    var VisaSection;
    VisaSection = (function() {
      function VisaSection(el, options) {
        var _this = this;
        this.$el = $(el);
        this.parameters = $.extend({}, $.fn.section.defaults, options);
        if (this.parameters.data != null) {
          $.get(window.bootstrapdirectory + "/modules/section-holder-module/templates/section-module.htm", function(template) {
            _this.template = $(template).html();
            $(_this.$el).append(Mustache.render(_this.template, _this.parameters.data));
            return _this.setupDropDowns();
          });
        } else {
          this.setupDropDowns();
        }
      }

      VisaSection.prototype.setupDropDowns = function() {
        var _this = this;
        $('.bootstrap-select select', this.$el).fancySelect();
        return $("select", this.$el).change(function() {
          var href;
          href = $('ul li.selected', _this.$el).data('raw-value');
          return $('.bootstrap-select-go', _this.$el).attr('href', href);
        });
      };

      return VisaSection;

    })();
    return $.fn.section = function(args) {
      var _args, _public;
      _public = [];
      _args = arguments;
      return this.each(function() {
        if ($.inArray(_args[0], _public) !== -1) {
          return this.section[_args[0]].apply($(this).data('section'), Array.prototype.slice.call(_args, 1));
        } else {
          return this.section = new VisaSection(this, args);
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
