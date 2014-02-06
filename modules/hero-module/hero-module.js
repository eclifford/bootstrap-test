(function() {
  (function($, window, document) {
    var heroModule;
    heroModule = (function() {
      heroModule.prototype._data = void 0;

      heroModule.prototype._pageTmpl = window.bootstrapdirectory + '/modules/hero-module/templates/hero-module.htm';

      function heroModule($el, options) {
        this.$el = $($el.selector);
        $(this.$el).addClass('full-bleed');
        this._data = options.data;
        if (this._data !== void 0) {
          this.renderHeroTemplate();
        } else {
          throw new Error('Hero Module :: Please pass me a data object');
        }
      }

      heroModule.prototype.carouselSetup = function() {
        var currMP4Path, currOGVPath, updateMP4Path, updateOGVPath;
        $('.navbar-brand').addClass('olympic').append('<span id="visa-header-logo-olympics"></span>');
        if ($('html').hasClass('mobile')) {
          $("#hero-carousel").addClass("mobile");
        } else if ($('html').hasClass('tablet')) {
          $("#hero-carousel").addClass("tablet");
          $('.btn-video-cta').addClass('video-enabled');
        } else if ($('html').hasClass('desktop')) {
          $("#hero-carousel").addClass("desktop");
          $('.btn-video-cta').addClass('video-enabled');
          currMP4Path = $('video').find('source').eq('0').attr('src');
          currOGVPath = $('video').find('source').eq('1').attr('src');
          updateMP4Path = currMP4Path.replace('tablet', 'desktop');
          updateOGVPath = currOGVPath.replace('tablet', 'desktop');
          $('video').find('source').eq('0').attr('src', updateMP4Path);
          $('video').find('source').eq('1').attr('src', updateOGVPath);
        }
        $("#hero-carousel").carousel({
          interval: 5000,
          pause: false
        });
        $("#hero-carousel .item:first").addClass("active");
        $('.video-enabled').on("click", function(e) {
          var v;
          e.preventDefault();
          if (player) {
            player.play();
          }
          $(".hero-video-player").fadeIn(400);
          v = document.getElementsByTagName("video")[0];
          return new MediaElementPlayer(v, {
            autoRewind: false,
            success: function(media) {
              media.play();
              $('#visa-header-logo-olympics').fadeOut(400);
              return player.addEventListener("ended", function(e) {
                $('.mejs-overlay-play').hide();
                $('.hero-video-endframe').fadeIn(400);
                $('#visa-header-logo-olympics').fadeIn(400);
                return $('#hero-video-replay').on("click", function(e) {
                  e.preventDefault();
                  media.setCurrentTime(1);
                  media.play();
                  $('#visa-header-logo-olympics').fadeOut(400);
                  return $(".hero-video-endframe").fadeOut(400, function() {
                    return media.play();
                  });
                });
              });
            }
          });
        });
        return $(window).resize(function() {
          var currVideoPath, updateVideoPath;
          if (!$('#hero-carousel').hasClass('mobile') && $('html').hasClass('mobile')) {
            $('.btn-video-cta').removeClass('video-enabled');
            $('#visa-header-logo-olympics').fadeIn(400);
            $("#hero-carousel").removeClass('tablet desktop').addClass("mobile");
            $(".hero-video-player").fadeOut(400);
            return $("#hero-carousel").carousel("cycle");
          } else if (!$('#hero-carousel').hasClass('tablet') && $('html').hasClass('tablet')) {
            $('.btn-video-cta').addClass('video-enabled');
            $('#visa-header-logo-olympics').fadeIn(400);
            $("#hero-carousel").removeClass('mobile desktop').addClass("tablet");
            $(".hero-video-player, .hero-video-endframe").fadeOut(400);
            $("#hero-carousel").carousel("cycle");
            currVideoPath = $('video').attr('src');
            currMP4Path = $('video').find('source').eq('0').attr('src');
            currOGVPath = $('video').find('source').eq('1').attr('src');
            updateVideoPath = currVideoPath.replace('desktop', 'tablet');
            updateMP4Path = currMP4Path.replace('desktop', 'tablet');
            updateOGVPath = currOGVPath.replace('desktop', 'tablet');
            $('video').attr('src', updateVideoPath);
            $('video').find('source').eq('0').attr('src', updateMP4Path);
            return $('video').find('source').eq('1').attr('src', updateOGVPath);
          } else if (!$('#hero-carousel').hasClass('desktop') && $('html').hasClass('desktop')) {
            $('.btn-video-cta').addClass('video-enabled');
            $('#visa-header-logo-olympics').fadeIn(400);
            $("#hero-carousel").removeClass('mobile tablet').addClass("desktop");
            $(".hero-video-player, .hero-video-endframe").fadeOut(400);
            $("#hero-carousel").carousel("cycle");
            currVideoPath = $('video').attr('src');
            currMP4Path = $('video').find('source').eq('0').attr('src');
            currOGVPath = $('video').find('source').eq('1').attr('src');
            updateVideoPath = currVideoPath.replace('tablet', 'desktop');
            updateMP4Path = currMP4Path.replace('tablet', 'desktop');
            updateOGVPath = currOGVPath.replace('tablet', 'desktop');
            $('video').attr('src', updateVideoPath);
            $('video').find('source').eq('0').attr('src', updateMP4Path);
            return $('video').find('source').eq('1').attr('src', updateOGVPath);
          }
        });
      };

      heroModule.prototype.setBackgroundImage = function() {
        return $("#hero-carousel").find(".item").each(function() {
          var bgDataSrc, bgTarget, getCurrentBreakpoint, setBackgroundImageSrc, _currentBreakpoint;
          bgTarget = $(this);
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
                return $(bgTarget).css('background-image', 'url(' + bgDataSrc + 'lg.jpg)');
              case 'breakE':
                return $(bgTarget).css('background-image', 'url(' + bgDataSrc + 'lg.jpg)');
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
        });
      };

      heroModule.prototype.renderHeroTemplate = function() {
        var $tmplSel, data, elem;
        $tmplSel = this._pageTmpl;
        elem = this.$el;
        data = this._data;
        return $.get($tmplSel, function(template) {
          template = $(template).filter('#hero-module-tmpl').html();
          $(elem).append(Mustache.render(template, data));
          heroModule.prototype.carouselSetup();
          return heroModule.prototype.setBackgroundImage();
        });
      };

      return heroModule;

    })();
    return $.fn.heroModule = function(args) {
      return this.heroModule = new heroModule(this, args);
    };
  })(jQuery, window, document);

}).call(this);
