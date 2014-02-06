(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var CustomContentModule;
    CustomContentModule = (function() {
      CustomContentModule.prototype._data = void 0;

      CustomContentModule.prototype._pageTmpl = window.bootstrapdirectory + '/modules/custom-content-module/templates/custom-content-template.htm';

      function CustomContentModule($el, options) {
        this.render = __bind(this.render, this);
        var moduleData, moduleid;
        this.$el = $($el.selector);
        this.$el.addClass('full-bleed custom-content-module');
        this._data = options.data;
        moduleData = this._data['module-data'][0];
        moduleid = moduleData['module-id'];
        if (this._data != null) {
          this.render(this._data);
        } else {
          throw new Error('Custom Content Module :: Please pass me a data object');
        }
      }

      CustomContentModule.prototype.render = function(data) {
        var _this = this;
        return $.get(this._pageTmpl, function(template) {
          var moduleData, section, _i, _len, _ref, _results;
          template = $(template).filter('#section-tmpl').html();
          moduleData = {
            data: data['module-data'][0]
          };
          _ref = moduleData.data.sections;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            section = _ref[_i];
            _results.push($(_this.$el).append(Mustache.render(template, section)));
          }
          return _results;
        });
      };

      return CustomContentModule;

    })();
    return $.fn.customcontent = function(args) {
      return this.customContentModule = new CustomContentModule(this, args);
    };
  })(jQuery, window, document);

}).call(this);
