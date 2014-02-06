(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var toutModule;
    toutModule = (function() {
      toutModule.prototype.$win = void 0;

      toutModule.prototype.$el = void 0;

      toutModule.prototype._iOS = void 0;

      toutModule.prototype._data = void 0;

      toutModule.prototype._toutTmpl = window.bootstrapdirectory + '/modules/tout-holder-module/templates/tout-module.htm';

      function toutModule($el, options) {
        this.getVideoModalStyles = __bind(this.getVideoModalStyles, this);
        this.openVideoModal = __bind(this.openVideoModal, this);
        this.bindClick = __bind(this.bindClick, this);
        this.bindHover = __bind(this.bindHover, this);
        this.render = __bind(this.render, this);
        this.$win = $(window);
        this._iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
        this.$el = $($el);
        $(this.$el).addClass('blocks tout-module');
        this._data = options != null ? options.data : void 0;
        if (this._data != null) {
          this.render();
        } else {
          this.bindHover();
          this.bindClick();
        }
        this;
      }

      toutModule.prototype.render = function() {
        var _this = this;
        $.get(this._toutTmpl, function(templates) {
          var template;
          template = $(templates).filter('#tout-module').html();
          $(_this.$el).append(Mustache.render(template, {
            data: _this._data
          }));
          _this.bindHover();
          return _this.bindClick();
        });
        return this;
      };

      toutModule.prototype.bindHover = function() {
        $('.tout .image', this.$el).on({
          mouseover: function(e) {
            return $(this).find('.tout-shadow').animate({
              height: '80%'
            }, 200);
          },
          mouseleave: function(e) {
            return $(this).find('.tout-shadow').animate({
              height: '60%'
            }, 200);
          }
        });
        $('.tout .video', this.$el).on({
          mouseover: function(e) {
            return $(this).find('.btn-video-play').animate({
              backgroundColor: 'rgba(237, 139, 0, 1.0)'
            }, 200);
          },
          mouseleave: function(e) {
            return $(this).find('.btn-video-play').animate({
              backgroundColor: 'rgba(237, 139, 0, 0.8)'
            }, 200);
          }
        });
        return this;
      };

      toutModule.prototype.bindClick = function() {
        var _this;
        _this = this;
        $('.tout a', this.$el).on({
          click: function(e) {
            return e.preventDefault();
          }
        });
        $('.tout', this.$el).on({
          click: function(e) {
            var target, url, videoId;
            url = $(this).find('.tout-copy a').attr('href');
            videoId = $(this).find('.tout-copy a').data('video-url');
            target = $(this).find('.tout-copy a').attr('target');
            if (!$(this).children().hasClass('video')) {
              if (target !== '_blank') {
                return location.href = url;
              } else {
                return window.open(url, target);
              }
            } else {
              return _this.openVideoModal(videoId);
            }
          }
        });
        return this;
      };

      toutModule.prototype.openVideoModal = function(videoId) {
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

      toutModule.prototype.getVideoModalStyles = function() {
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

      return toutModule;

    })();
    return $.fn.toutModule = function(args) {
      return this.toutModule = new toutModule(this, args);
    };
  })($, window, document);

}).call(this);
