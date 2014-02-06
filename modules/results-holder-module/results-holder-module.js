(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var VisaResultHolder;
    VisaResultHolder = (function() {
      function VisaResultHolder(el, options) {
        this.refresh = __bind(this.refresh, this);
        var _this = this;
        this.$el = $(el);
        this.parameters = $.extend({}, $.fn.resultsholder.defaults, options);
        this._data = this.parameters.data;
        this.allResults = $('.module-body', this.$el).clone();
        this.filteredResults = this.allResults;
        this.$el.closest('.filter-content-target').addClass('results-filter-holder');
        if (this.parameters.category != null) {
          this.filterByCategory(this.parameters.category);
        }
        if (this._data != null) {
          $.get(window.bootstrapdirectory + "/modules/results-holder-module/templates/results-holder-module-template.htm", function(templates) {
            _this.template = $(templates).html();
            return _this.loadData();
          });
        } else {
          this.initializeResults();
        }
      }

      VisaResultHolder.prototype.loadData = function() {
        var _this = this;
        this.$el.append(Mustache.render(this.template, this._data));
        return $.get(window.bootstrapdirectory + "/modules/results-holder-module/templates/results-holder-module-row-template.htm", function(template) {
          var index, numRows;
          numRows = Math.ceil(_this.visibleItemsCount() / 2);
          index = 0;
          while (index < numRows) {
            $('.grid-container', _this.$el).append($(template).html());
            index++;
          }
          return _this.initializeResults();
        });
      };

      VisaResultHolder.prototype.initializeResults = function() {
        var result, resultIndex, _i, _len, _ref, _results,
          _this = this;
        resultIndex = 0;
        _ref = this.filteredResults;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          result = _ref[_i];
          if ((resultIndex + 1) % 2 === 0) {
            setTimeout(function() {
              return $(".results-module:last", _this.$el).css('height', $(".results-module", _this.$el).outerHeight());
            }, 200);
            $(".results-module:last", this.$el).addClass('empty');
            $(".results-module:last", this.$el).closest('.row').addClass('empty');
          }
          _results.push($(this.$el).closest('.filter-body').css('height', ''));
        }
        return _results;
      };

      VisaResultHolder.prototype.visibleItemsCount = function() {
        return this.filteredResults.length;
      };

      VisaResultHolder.prototype.filterByCategory = function(category) {
        var emptyIndex, result, resultIndex, row, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
        this.filteredResults = new Array();
        _ref = this.allResults;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          result = _ref[_i];
          if ($(result).data('category').indexOf(category) > -1) {
            this.filteredResults.push($(result));
          }
        }
        resultIndex = 0;
        $(".results-module", this.$el).html();
        _ref1 = this.filteredResults;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          result = _ref1[_j];
          $($(".results-module .module-body", this.$el).get(resultIndex)).html($(result).html());
          resultIndex++;
        }
        emptyIndex = this.filteredResults.length;
        while (emptyIndex < this.allResults.length) {
          $($(".results-module .module-body", this.$el).get(emptyIndex)).html('');
          emptyIndex++;
        }
        _ref2 = $('.row', this.$el);
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          row = _ref2[_k];
          if ($('.module-body .result-image', row).length === 0) {
            $(row).hide();
          } else {
            $(row).show();
          }
        }
        $(this.$el).fadeIn();
        return $(this.$el).closest('.filter-body').css('height', '');
      };

      VisaResultHolder.prototype.refresh = function(category) {
        var _this = this;
        return $(this.$el).fadeOut(300, function() {
          return _this.filterByCategory(category);
        });
      };

      return VisaResultHolder;

    })();
    return $.fn.resultsholder = function(args) {
      var _args, _public;
      _public = ['refresh'];
      _args = arguments;
      return this.each(function() {
        if ($.inArray(_args[0], _public) !== -1) {
          return this.result[_args[0]].apply($(this).data('resultsholder'), Array.prototype.slice.call(_args, 1));
        } else {
          return this.result = new VisaResultHolder(this, args);
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
