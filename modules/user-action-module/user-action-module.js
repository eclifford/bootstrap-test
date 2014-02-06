(function() {
  (function($, window, document) {
    var userActionModule;
    userActionModule = (function() {
      userActionModule.prototype._data = void 0;

      userActionModule.prototype._pageTmpl = window.bootstrapdirectory + '/modules/user-action-module/templates/user-action-module.htm';

      function userActionModule($el, options) {
        this.$el = $($el.selector);
        $(this.$el).addClass('full-bleed user-action-module');
        this._data = options.data;
        if (this._data !== void 0) {
          this.renderUserActionTemplate();
        } else {
          throw new Error('User Action Module :: Please pass me a data object');
        }
      }

      userActionModule.prototype.bindHover = function() {
        var groupOffset, labelOffset, resultOffset;
        labelOffset = $('.ua-label').position();
        groupOffset = $('.ua-form').offset();
        resultOffset = groupOffset.left + labelOffset.left;
        $('.dropdown-menu li a').css('paddingLeft', labelOffset.left);
        $('.dropdown-menu li a').css('paddingRight', labelOffset.left);
        $('.ua-results li a, .ua-results li .result-title').css('paddingLeft', resultOffset);
        $('.ua-results li a, .ua-results li .result-title').css('paddingRight', resultOffset);
        if ($('html').hasClass('touch')) {
          $('.user-action-module, .user-action-module .inner-row').addClass('zindex-mobile-fix');
          $(".ua-module .ua-form").on("click", function(e) {
            e.preventDefault();
            if ($(this).hasClass("isDown")) {
              $(this).find(".ua-value").stop(true, true).animate({
                opacity: 1
              }, 150);
              $(this).find(".dropdown-menu").first().stop(true, true).slideUp(200);
              $(".ua-content-overlay").stop(true, true).animate({
                opacity: 0
              }, 400);
              setTimeout((function() {
                return $(".ua-content-overlay").hide();
              }), 400);
              return $(this).removeClass("isDown");
            } else {
              $(this).find(".dropdown-menu").first().stop(true, true).slideDown(200);
              $(".ua-content-overlay").show().stop(true, true).animate({
                opacity: .75
              }, 200);
              $(this).find(".ua-value").animate({
                opacity: 0
              }, 100);
              return $(this).addClass("isDown");
            }
          });
        } else {
          $(".ua-module .ua-form").hover((function() {
            $(this).find(".ua-value").animate({
              opacity: 0
            }, 100);
            $(this).find(".dropdown-menu").first().stop(true, true).slideDown(200);
            return $(".ua-content-overlay").show().stop(true, true).animate({
              opacity: .75
            }, 200);
          }), function() {
            $(this).find(".ua-value").stop(true, true).animate({
              opacity: 1
            }, 150);
            $(this).find(".dropdown-menu").first().stop(true, true).slideUp(200);
            $(".ua-content-overlay").stop(true, true).animate({
              opacity: 0
            }, 400);
            return setTimeout((function() {
              return $(".ua-content-overlay").hide();
            }), 400);
          });
        }
        return $(window).resize(function() {
          labelOffset = $('.ua-label').position();
          groupOffset = $('.ua-form').offset();
          resultOffset = groupOffset.left + labelOffset.left;
          $('.dropdown-menu li a').css('paddingLeft', labelOffset.left);
          $('.dropdown-menu li a').css('paddingRight', labelOffset.left);
          $('.ua-results li a, .ua-results li .result-title').css('paddingLeft', resultOffset);
          return $('.ua-results li a, .ua-results li .result-title').css('paddingRight', resultOffset);
        });
      };

      userActionModule.prototype.categoryClick = function() {
        return $(".ua-module .ua-form .dropdown-menu li a").on("click", function(e) {
          var $currentValue, $resultsModule, categoryIndex, clickedValue;
          e.preventDefault();
          $currentValue = $(e.currentTarget).closest(".dropdown-menu").prev(".btn-wrap").find(".ua-value");
          clickedValue = $(e.currentTarget).text();
          categoryIndex = $(e.currentTarget).data('category-index');
          $currentValue.addClass("glow").stop(true, true).html(clickedValue).animate({
            opacity: 1
          }, 200);
          $(e.currentTarget).closest(".dropdown-menu").first().stop(true, true).slideUp(200);
          $(".ua-content-overlay").stop(true, true).animate({
            opacity: 0
          }, 400);
          setTimeout((function() {
            return $(".ua-content-overlay").hide();
          }), 400);
          setTimeout((function() {
            return $currentValue.removeClass("glow");
          }), 150);
          $resultsModule = $(".ua-results");
          $resultsModule.find("li:not([data-dropdown-index=" + categoryIndex + "])").hide();
          $resultsModule.find("li[data-dropdown-index=" + categoryIndex + "]").show();
          $resultsModule.find("li.result-hdr").show();
          $resultsModule.stop(true, true).slideDown(400);
          return setTimeout((function() {}), 150);
        });
      };

      userActionModule.prototype.closeResultsClick = function() {
        return $(".result-close").on("click", function(e) {
          e.preventDefault();
          $(".ua-value").addClass("glow").html('view all').animate({
            opacity: 1
          }, 200);
          $(".ua-results").slideUp(400);
          return setTimeout((function() {
            return $(".ua-value").removeClass("glow");
          }), 150);
        });
      };

      userActionModule.prototype.renderUserActionTemplate = function() {
        var $tmplSel, data, elem;
        $tmplSel = this._pageTmpl;
        elem = this.$el;
        data = this._data;
        return $.get($tmplSel, function(template) {
          template = $(template).filter('#user-action-module-tmpl').html();
          $(elem).append(Mustache.render(template, data));
          userActionModule.prototype.bindHover();
          userActionModule.prototype.categoryClick();
          return userActionModule.prototype.closeResultsClick();
        });
      };

      return userActionModule;

    })();
    return $.fn.userActionModule = function(args) {
      return this.userActionModule = new userActionModule(this, args);
    };
  })(jQuery, window, document);

}).call(this);
