(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var pageIntroVisualModule;
    pageIntroVisualModule = (function() {
      pageIntroVisualModule.prototype.$win = void 0;

      pageIntroVisualModule.prototype.$el = void 0;

      pageIntroVisualModule.prototype._iOS = void 0;

      pageIntroVisualModule.prototype._data = void 0;

      pageIntroVisualModule.prototype._pageTmpl = window.bootstrapdirectory + '/modules/page-intro-visual-module/templates/page-intro-visual.htm';

      function pageIntroVisualModule($el, options) {
        this.getVideoModalStyles = __bind(this.getVideoModalStyles, this);
        this.openVideoModal = __bind(this.openVideoModal, this);
        this.bindClick = __bind(this.bindClick, this);
        this.$win = $(window);
        this._iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
        this.$el = $($el.selector);
        this.bindClick();
        this.setBackgroundImage();
        this;
      }

      pageIntroVisualModule.prototype.setBackgroundImage = function() {
        var bgDataSrc, bgTarget, getCurrentBreakpoint, setBackgroundImageSrc, _currentBreakpoint;
        bgTarget = $(this.$el).find('.image-holder');
        bgDataSrc = $(bgTarget).attr('data-src-base');
        _currentBreakpoint = void 0;
        setBackgroundImageSrc = function(breakpoint) {
          this.breakpoint = breakpoint;
          switch (this.breakpoint) {
            case 'breakA':
              return $(bgTarget).css('background-image', 'url(' + bgDataSrc + 'sm.jpg)');
            case 'breakB':
              return $(bgTarget).css('background-image', 'url(' + bgDataSrc + 'md.jpg)');
            case 'breakC':
              return $(bgTarget).css('background-image', 'url(' + bgDataSrc + 'lg.jpg)');
            case 'breakD':
              return $(bgTarget).css('background-image', 'url(' + bgDataSrc + 'xlg.jpg)');
            case 'breakE':
              return $(bgTarget).css('background-image', 'url(' + bgDataSrc + '1600.jpg)');
          }
        };
        getCurrentBreakpoint = function() {
          if ($('html').hasClass('break-a')) {
            setBackgroundImageSrc('breakA');
            return $(bgTarget).attr('data-current-breakpoint', 'breakpoint-a');
          } else if ($('html').hasClass('break-b')) {
            setBackgroundImageSrc('breakB');
            return $(bgTarget).attr('data-current-breakpoint', 'breakpoint-b');
          } else if ($('html').hasClass('break-c')) {
            setBackgroundImageSrc('breakC');
            return $(bgTarget).attr('data-current-breakpoint', 'breakpoint-c');
          } else if ($('html').hasClass('break-d')) {
            setBackgroundImageSrc('breakD');
            return $(bgTarget).attr('data-current-breakpoint', 'breakpoint-d');
          } else if ($('html').hasClass('break-e')) {
            setBackgroundImageSrc('breakE');
            return $(bgTarget).attr('data-current-breakpoint', 'breakpoint-e');
          }
        };
        getCurrentBreakpoint();
        return $(window).resize(function() {
          if ($(bgTarget).attr('data-current-breakpoint') !== 'breakpoint-a' && $('html').hasClass('break-a')) {
            $(bgTarget).attr('data-current-breakpoint', 'breakpoint-a');
            return setBackgroundImageSrc('breakA');
          } else if ($(bgTarget).attr('data-current-breakpoint') !== 'breakpoint-b' && $('html').hasClass('break-b')) {
            $(bgTarget).attr('data-current-breakpoint', 'breakpoint-b');
            return setBackgroundImageSrc('breakB');
          } else if ($(bgTarget).attr('data-current-breakpoint') !== 'breakpoint-c' && $('html').hasClass('break-c')) {
            $(bgTarget).attr('data-current-breakpoint', 'breakpoint-c');
            return setBackgroundImageSrc('breakC');
          } else if ($(bgTarget).attr('data-current-breakpoint') !== 'breakpoint-d' && $('html').hasClass('break-d')) {
            $(bgTarget).attr('data-current-breakpoint', 'breakpoint-d');
            return setBackgroundImageSrc('breakD');
          } else if ($(bgTarget).attr('data-current-breakpoint') !== 'breakpoint-e' && $('html').hasClass('break-e')) {
            $(bgTarget).attr('data-current-breakpoint', 'breakpoint-e');
            return setBackgroundImageSrc('breakE');
          }
        });
      };

      pageIntroVisualModule.prototype.bindClick = function() {
        var _this = this;
        this.$el.find('.tout-video-play-button').on('click', function(e) {
          var $el, videoId;
          e.preventDefault();
          $el = $(e.currentTarget);
          videoId = $el.data('video-url');
          _this.openVideoModal(videoId);
          return void 0;
        });
        return this;
      };

      pageIntroVisualModule.prototype.openVideoModal = function(videoId) {
        var $videoPlayer, html,
          _this = this;
        html = '';
        html += '<iframe id="ytplayer" type="text/html" ';
        html += 'width="100%"';
        html += 'height="100%"';
        html += 'src="http://www.youtube.com/embed/' + videoId;
        html += '?autoplay=1&color=white&rel=0&modestbranding=1&showinfo=0" frameborder="0"/>';
        $videoPlayer = $(html);
        $videoPlayer.hide();
        vex.open({
          className: 'vex-theme-plain',
          contentCSS: this.getVideoModalStyles(),
          afterOpen: function($vexContent) {
            if (_this._iOS) {
              $vexContent.addClass('vex-_ios');
            }
            $vexContent.append($videoPlayer);
            $videoPlayer.fadeIn(500);
            _this.$win.on('resize', function(e) {
              return $vexContent.css(_this.getVideoModalStyles());
            });
            return _this.$win.on('orientationchange', function(e) {
              return $vexContent.css(_this.getVideoModalStyles());
            });
          },
          afterClose: function($vexContent) {
            _this.$win.off('resize');
            return _this.$win.off('orientationchange');
          }
        });
        return this;
      };

      pageIntroVisualModule.prototype.getVideoModalStyles = function() {
        var b, h, styles, w;
        b = 0;
        w = parseInt(this.$win.width(), 10);
        if (w > 1000) {
          w = 1000;
        }
        if (w > 660) {
          b = 10;
          w -= b * 2;
        }
        h = parseInt((w / 16) * 9);
        if (!this._iOS) {
          h += 30;
        }
        styles = {
          'width': w + (b * 2),
          'height': h + (b * 2),
          'padding': b
        };
        return styles;
      };

      return pageIntroVisualModule;

    })();
    return $.fn.pageIntroVisualModule = function(args) {
      return this.pageIntroVisualModule = new pageIntroVisualModule(this, args);
    };
  })(jQuery, window, document);

}).call(this);
