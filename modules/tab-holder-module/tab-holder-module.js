(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var tabModule;
    tabModule = (function() {
      tabModule.prototype.$el = void 0;

      tabModule.prototype.$columns = 12;

      tabModule.prototype._data = void 0;

      tabModule.prototype._tabLength = void 0;

      tabModule.prototype._tabbedTmpl = window.bootstrapdirectory + '/modules/tab-holder-module/templates/tabbed.htm';

      tabModule.prototype._contentTmpl = window.bootstrapdirectory + '/modules/tab-holder-module/templates/tab-content.htm';

      tabModule.prototype._accordion = [];

      tabModule.prototype._accordionReady = false;

      tabModule.prototype._flag = true;

      function tabModule($el, options) {
        this.bindTabs = __bind(this.bindTabs, this);
        this.bindInputs = __bind(this.bindInputs, this);
        this.bindDropdowns = __bind(this.bindDropdowns, this);
        this.callAccordion = __bind(this.callAccordion, this);
        this.moveContent = __bind(this.moveContent, this);
        this.renderTabContentTemplate = __bind(this.renderTabContentTemplate, this);
        this.renderTabTemplate = __bind(this.renderTabTemplate, this);
        this.updateTabIntro = __bind(this.updateTabIntro, this);
        var _this = this;
        this.$el = $($el.selector);
        $(this.$el).addClass('blocks tab-module');
        $(window).on('resize', function(e) {
          var num;
          if ($('html').hasClass('mobile')) {
            num = $('.tab', _this.$el).index($('.tab.active'));
            return $(_this.$el).accordion('option', {
              disabled: false,
              active: num
            });
          } else {
            if (_this._accordionReady) {
              return $(_this.$el).accordion('disable');
            }
          }
        });
        if ((options != null ? options.data : void 0) != null) {
          this._data = options.data;
          this._tabLength = this._data['module-data'].length;
          this.renderTabTemplate();
        } else {
          this.addFunctionality();
        }
      }

      tabModule.prototype.hideIntros = function() {
        $('.tab-content .tab-content-holder').removeClass('active').hide();
        return $('.tab-content .tab-content-holder:first').addClass('active').show();
      };

      tabModule.prototype.updateTabIntro = function(index) {
        var showNow;
        $('.tab-content .tab-content-holder').removeClass('active').hide();
        showNow = $('.tab-content').find('.tab-content-holder')[index];
        return $(showNow).addClass('active').show();
      };

      tabModule.prototype.renderTabTemplate = function() {
        var _this = this;
        return $.get(this._tabbedTmpl, function(template) {
          template = $(template).filter('#tabbed-tmpl').html();
          $(_this.$el).append(Mustache.render(template, {
            data: _this._data
          }));
          return _this.renderTabContentTemplate();
        });
      };

      tabModule.prototype.renderTabContentTemplate = function() {
        var i,
          _this = this;
        i = 0;
        return $.get(this._contentTmpl, function(templates) {
          var container, data, template, tmpl;
          while (i !== _this._tabLength) {
            data = _this._data['module-data'][i];
            tmpl = '#' + data['module-id'];
            template = $(templates).filter(tmpl).html();
            if (i === 0) {
              container = $(templates).filter('#row-container-tmpl').html();
              $(Mustache.render(container, {
                data: data
              })).insertAfter($(_this.$el));
            }
            $('.tab-content .inner-row').append(Mustache.render(template, {
              data: data
            }));
            i++;
          }
          return _this.addFunctionality();
        });
      };

      tabModule.prototype.addFunctionality = function() {
        var _this = this;
        this.moveContent();
        this.bindDropdowns();
        this.bindTabs();
        this.bindInputs();
        this.hideIntros();
        if ($('html').hasClass('mobile')) {
          $(this.$el).accordion('enable');
        } else {
          $(this.$el).accordion('disable');
        }
        return $('a.tab-input-form-submit').bind({
          click: function(e) {
            var param1Val, param2Val, paramFormat;
            e.preventDefault();
            param1Val = $('input.param1', $(e.currentTarget).siblings()).val();
            param2Val = $('input.param2', $(e.currentTarget).siblings()).val();
            paramFormat = $(e.currentTarget).data('format');
            paramFormat = paramFormat.replace('{1}', param1Val).replace('{2}', param2Val);
            return window.location = ($(e.currentTarget).attr('href')) + paramFormat;
          }
        });
      };

      tabModule.prototype.moveContent = function() {
        var i;
        i = 0;
        this._flag === false;
        $('.tab-content .inner-row').children()[i];
        while (i !== $('.tab-content .inner-row').children().length) {
          $($('.tab-content .inner-row').children()[i]).clone().insertAfter($('.tab')[i]);
          i++;
        }
        return this.callAccordion(0);
      };

      tabModule.prototype.callAccordion = function(active) {
        $(this.$el).accordion({
          heightStyle: "content",
          autoHeight: false,
          active: active,
          collapsible: true
        });
        return this._accordionReady = true;
      };

      tabModule.prototype.bindDropdowns = function() {
        var _this = this;
        $('.bootstrap-select select').fancySelect();
        $('.bootstrap-select ul li').bind({
          click: function(e) {
            var parent;
            parent = $(e.currentTarget).closest($('.bootstrap-select'));
            return $('.btn-primary', parent).removeClass('disable');
          }
        });
        return $('.tab-content-holder .btn-primary').bind({
          click: function(e) {
            if ($(e.currentTarget).hasClass('disable')) {
              return e.preventDefault();
            }
          }
        });
      };

      tabModule.prototype.bindInputs = function() {
        var _this = this;
        $('.tab-content-holder input').each(function() {
          return $(this).attr('data-default', $(this).val());
        });
        return $('.tab-content-holder input').bind({
          focus: function(e) {
            if ($(e.currentTarget).val() === $(e.currentTarget).data('default')) {
              return $(e.currentTarget).val('');
            }
          },
          focusout: function(e) {
            if ($(e.currentTarget).val() === '') {
              return $(e.currentTarget).val($(e.currentTarget).data('default'));
            }
          }
        });
      };

      tabModule.prototype.bindTabs = function() {
        var _this = this;
        $('.tab:first', this.$el).addClass('active');
        return $('.tab', this.$el).bind({
          click: function(e) {
            var idx;
            $(e.currentTarget).siblings().removeClass('active');
            $(e.currentTarget).toggleClass('active');
            idx = $('.tab', _this.$el).index($(e.currentTarget));
            _this.updateTabIntro(idx);
            return false;
          }
        });
      };

      return tabModule;

    })();
    return $.fn.tabModule = function(args) {
      return this.tabModule = new tabModule(this, args);
    };
  })(jQuery, window, document);

}).call(this);
