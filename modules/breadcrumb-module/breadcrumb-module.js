(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var breadcrumbModule;
    breadcrumbModule = (function() {
      breadcrumbModule.prototype.$el = void 0;

      breadcrumbModule.prototype._crumbTmpl = window.bootstrapdirectory + '/modules/breadcrumb-module/templates/breadcrumb.htm';

      breadcrumbModule.prototype._crumb = [];

      function breadcrumbModule($el, options) {
        this.render = __bind(this.render, this);
        this.buildTemplate = __bind(this.buildTemplate, this);
        this.$el = $($el.selector);
        $(this.$el).addClass('full-bleed breadcrumb-module');
        this._crumb.push({
          key: $('li.current-page .title').html(),
          link: $('li.current-page .nav-link').attr('href')
        });
        if ($('li.current-page').closest('ul.nav.main').closest('li').length > 0) {
          this.addParentToBreadCrumb($('li.current-page'));
        } else {
          this.$el.css('display', 'none');
        }
      }

      breadcrumbModule.prototype.addParentToBreadCrumb = function(el) {
        var parentHref, parentLI, parentTitle, parentUL;
        parentUL = $(el).closest('ul.nav.main');
        parentLI = $(parentUL).closest('li');
        parentTitle = $('> .nav-link .title', parentLI).html();
        parentHref = $('> .nav-link', parentLI).attr('href');
        if ((parentTitle != null) && (parentHref != null)) {
          this._crumb.unshift({
            key: parentTitle,
            link: parentHref
          });
        }
        if ($(parentLI).closest('ul.nav.main').length > 0) {
          return this.addParentToBreadCrumb($(parentLI));
        } else {
          return this.buildTemplate();
        }
      };

      breadcrumbModule.prototype.buildTemplate = function() {
        var concat, i,
          _this = this;
        concat = false;
        i = 0;
        return $.get(this._crumbTmpl, function(templates) {
          var listcrumb, listcrumbLast, template, templateConcat, templateFirst, templateLast, templateMiddle;
          templateFirst = $(templates).filter('#breadcrumb-first-tmpl').html();
          templateConcat = $(templates).filter('#breadcrumb-concat-tmpl').html();
          templateMiddle = $(templates).filter('#breadcrumb-mid-tmpl').html();
          templateLast = $(templates).filter('#breadcrumb-last-tmpl').html();
          if (_this._crumb.length > 3) {
            concat = true;
          }
          while (i < _this._crumb.length) {
            listcrumb = '<li><a href="' + _this._crumb[i].link + '">' + _this._crumb[i].key + '</a></li>';
            listcrumbLast = '<li><span class="active">' + _this._crumb[i].key + '</span></li>';
            if (i === 0) {
              template = templateFirst + listcrumb;
            }
            if (i > 0 && i < _this._crumb.length - 1) {
              template = template + templateMiddle + listcrumb;
            }
            if (i === _this._crumb.length - 1) {
              template = template + templateMiddle + listcrumbLast + templateLast;
            }
            i++;
          }
          return _this.render(template);
        });
      };

      breadcrumbModule.prototype.render = function(template) {
        return $(this.$el).html(Mustache.render(template));
      };

      return breadcrumbModule;

    })();
    $.fn.breadcrumbModule = function(args) {
      return this.breadcrumbModule = new breadcrumbModule(this, args);
    };
    return $(window).on("header-nav-loaded", function() {
      return $("#breadcrumb-target").breadcrumbModule();
    });
  })(jQuery, window, document);

}).call(this);
