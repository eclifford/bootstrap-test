(function() {
  (function($, window, document) {
    var filterModule;
    filterModule = (function() {
      filterModule.prototype._data = void 0;

      filterModule.prototype._pageTmpl = window.bootstrapdirectory + '/modules/filter-module/templates/filter-module.htm';

      function filterModule($el, options) {
        var filterParam, queryParams;
        this.$el = $($el.selector);
        $(this.$el).addClass('full-bleed filter-module-container');
        this._data = options != null ? options.data : void 0;
        this._resultsTarget = options != null ? options.resultsTarget : void 0;
        queryParams = window.location.search.replace("?", "");
        filterParam = queryParams != null ? queryParams.split('filter=')[1] : void 0;
        if (filterParam != null) {
          this.filterParam = filterParam;
        }
        if (this._data !== void 0) {
          this.renderFilterTemplate();
        } else {
          this.initializeFilter();
        }
      }

      filterModule.prototype.bindHover = function() {
        var groupOffset, labelOffset, resultOffset;
        labelOffset = $('.filter-label').position();
        groupOffset = $('.filter-form').offset();
        resultOffset = groupOffset.left + labelOffset.left;
        $('.dropdown-menu li a').css('paddingLeft', labelOffset.left);
        $('.dropdown-menu li a').css('paddingRight', labelOffset.left);
        if ($('html').hasClass('touch')) {
          $('.filter-module-container, .filter-module-container .inner-row').addClass('zindex-mobile-fix');
          $(".filter-module .filter-form").on("click", function(e) {
            e.preventDefault();
            if ($(this).hasClass("isDown")) {
              $(this).find(".filter-value").stop(true, true).animate({
                opacity: 1
              }, 150);
              $(this).find(".dropdown-menu").first().stop(true, true).slideUp(200);
              $(".filter-content-overlay").stop(true, true).animate({
                opacity: 0
              }, 400);
              setTimeout((function() {
                return $(".filter-content-overlay").hide();
              }), 400);
              return $(this).removeClass("isDown");
            } else {
              $(this).find(".dropdown-menu").first().stop(true, true).slideDown(200);
              $(".filter-content-overlay").show().stop(true, true).animate({
                opacity: .75
              }, 200);
              $(this).find(".filter-value").animate({
                opacity: 0
              }, 100);
              return $(this).addClass("isDown");
            }
          });
        } else {
          $('.filter-module-container, .filter-module-container .inner-row').addClass('zindex-mobile-fix');
          $(".filter-module .filter-form").hover((function() {
            $(this).find(".filter-value").animate({
              opacity: 0
            }, 100);
            $(this).find(".dropdown-menu").first().stop(true, true).slideDown(200);
            return $(".filter-content-overlay").show().stop(true, true).animate({
              opacity: .75
            }, 200);
          }), function() {
            $(this).find(".filter-value").stop(true, true).animate({
              opacity: 1
            }, 150);
            $(this).find(".dropdown-menu").first().stop(true, true).slideUp(200);
            $(".filter-content-overlay").stop(true, true).animate({
              opacity: 0
            }, 400);
            return setTimeout((function() {
              return $(".filter-content-overlay").hide();
            }), 400);
          });
        }
        return $(window).resize(function() {
          labelOffset = $('.filter-label').position();
          groupOffset = $('.filter-form').offset();
          resultOffset = groupOffset.left + labelOffset.left;
          $('.dropdown-menu li a').css('paddingLeft', labelOffset.left);
          return $('.dropdown-menu li a').css('paddingRight', labelOffset.left);
        });
      };

      filterModule.prototype.categoryClick = function() {
        var _this = this;
        return $(".filter-module .filter-form .dropdown-menu li a").on("click", function(e) {
          var $currentValue, $resultsModule, category, clickedValue;
          e.preventDefault();
          $currentValue = $(e.currentTarget).closest(".dropdown-menu").prev(".btn-wrap").find(".filter-value");
          clickedValue = $(e.currentTarget).text();
          category = $(e.currentTarget).data('category');
          $currentValue.addClass("glow").stop(true, true).html(clickedValue).animate({
            opacity: 1
          }, 200);
          $(e.currentTarget).closest(".dropdown-menu").first().stop(true, true).slideUp(200);
          $(".filter-content-overlay").stop(true, true).animate({
            opacity: 0
          }, 400);
          setTimeout((function() {
            return $(".filter-content-overlay").hide();
          }), 400);
          setTimeout((function() {
            return $currentValue.removeClass("glow");
          }), 150);
          if (_this._resultsTarget == null) {
            _this._resultsTarget = ".filter-content-target";
          }
          if ($.fn.resultsholder != null) {
            $('.filter-body').css('height', $('.filter-body').outerHeight());
            $('.filter-content-target').resultsholder('refresh', category);
          } else {
            $resultsModule = $(_this._resultsTarget);
            $resultsModule.find(".filter-content-result:not([data-category=" + category + "])").hide();
            $resultsModule.find(".filter-content-result[data-category=" + category + "]").show();
          }
          return $('.dropdown-menu', _this.el).hide();
        });
      };

      filterModule.prototype.renderFilterTemplate = function() {
        var $tmplSel, data, elem,
          _this = this;
        $tmplSel = this._pageTmpl;
        elem = this.$el;
        data = this._data;
        return $.get($tmplSel, function(template) {
          template = $(template).filter('#filter-module-tmpl').html();
          $(elem).append(Mustache.render(template, data));
          return _this.initializeFilter();
        });
      };

      filterModule.prototype.initializeFilter = function() {
        var filter, _i, _len, _ref;
        this.bindHover();
        this.categoryClick();
        if (this.filterParam != null) {
          _ref = $('.filter-form .dropdown-menu li a', this.$el);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            filter = _ref[_i];
            if ($(filter).data('category' === this.filterParam)) {
              $('.filter-value').html($(filter).html());
            }
          }
        }
        if ($('.results-module .module-body', this.$el).length === 0) {
          $(".filter-module", this.$el).hide();
          $(".filter-content-target").addClass('border');
        }
        if ($.fn.resultsholder != null) {
          return $('.filter-content-target').resultsholder({
            'category': this.filterParam
          });
        }
      };

      return filterModule;

    })();
    return $.fn.filterModule = function(args) {
      return this.filterModule = new filterModule(this, args);
    };
  })(jQuery, window, document);

}).call(this);
