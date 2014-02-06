(function() {
  (function($, window, document) {
    var VisaSectionHolder;
    VisaSectionHolder = (function() {
      function VisaSectionHolder(el, options) {
        this.$el = $(el);
        this.$el.addClass('full-bleed blocks custom-margin sections-holder');
        this.parameters = $.extend({}, $.fn.sectionsholder.defaults, options);
        this._data = this.parameters.data;
        if (this._data != null) {
          this.loadData();
        } else {
          this.initiateSections();
        }
      }

      VisaSectionHolder.prototype.loadData = function() {
        var _this = this;
        this.$el.append(Mustache.render(this.template, this._data));
        return $.get(window.bootstrapdirectory + "/modules/section-holder-module/templates/section-row-module-template.htm", function(template) {
          var $filter, dataLen, divNum, index, numRows;
          $filter = '#sections-three-wide-row-tmpl';
          index = 0;
          divNum = 3;
          dataLen = _this._data['module-data'].length;
          if (dataLen === 4 || dataLen < 3) {
            $filter = '#sections-two-wide-row-tmpl';
            divNum = 2;
          }
          numRows = Math.ceil(_this.visibleItemsCount() / divNum);
          while (index < numRows) {
            $(_this.$el).append($(template).filter($filter).html());
            index++;
          }
          return _this.initiateSections(true);
        });
      };

      VisaSectionHolder.prototype.initiateSections = function(withData) {
        var section, sectionIndex, _i, _len, _ref, _results,
          _this = this;
        if (withData == null) {
          withData = false;
        }
        sectionIndex = 0;
        if (withData) {
          _ref = this._data['module-data'];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            section = _ref[_i];
            if (section.visible === true) {
              $($(".sections-module", this.$el).get(sectionIndex)).section({
                data: section
              });
              _results.push(sectionIndex++);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        } else {
          $(".sections-module", this.$el).section();
          if ((sectionIndex + 1) % 3 === 0) {
            setTimeout(function() {
              return $(".sections-module:last", _this.$el).css('height', $(".sections-module", _this.$el).outerHeight());
            }, 200);
            $(".sections-module:last", this.$el).addClass('empty');
            return $(".sections-module:last", this.$el).closest('.row').addClass('empty');
          }
        }
      };

      VisaSectionHolder.prototype.visibleItemsCount = function() {
        var count, section, _i, _len, _ref;
        count = 0;
        _ref = this._data['module-data'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          section = _ref[_i];
          if (section.visible === true) {
            count++;
          }
        }
        return count;
      };

      return VisaSectionHolder;

    })();
    return $.fn.sectionsholder = function(args) {
      var _args, _public;
      _public = [];
      _args = arguments;
      return this.each(function() {
        if ($.inArray(_args[0], _public) !== -1) {
          return this.section[_args[0]].apply($(this).data('sectionsholder'), Array.prototype.slice.call(_args, 1));
        } else {
          return this.section = new VisaSectionHolder(this, args);
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
