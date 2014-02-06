(function() {
  (function(root, factory) {
    return root.Responsive = factory(root, {}, root.jQuery);
  })(this, function(root, Responsive, $) {
    'use strict';
    var ResponsiveBreakpoint, ResponsiveDevice, ResponsiveImage, _breakpoint, _deepFreeze, _device;
    ResponsiveImage = (function(params) {
      var Image, instance;
      Image = (function() {
        var $scope, _addImageToQueue, _addListeners, _breakpointState, _buildURL, _createImage, _dispose, _images, _imagesRegistered, _init, _loadImage, _loadImages, _onImageAddedToDOM, _onImageLoadComplete, _onImageRemovedFromDOM, _onQueueLoadSetComplete, _options, _parseOptions, _parseURL, _queue, _queueAllImages, _queueSize, _registerImages, _removeListeners, _selectors, _unregisterImages, _urlParamDelimeter;

        $scope = void 0;

        _queue = void 0;

        _selectors = void 0;

        _images = [];

        _imagesRegistered = false;

        _queueSize = 5;

        _breakpointState = void 0;

        _options = void 0;

        function Image(parameters) {
          if (parameters == null) {
            parameters = {};
          }
          _init();
        }

        Image.prototype.reset = function() {
          _dispose();
          _init();
          return _loadImages();
        };

        Image.prototype.refreshImage = function($el) {
          var image,
            _this = this;
          image = _.find(_images, function(image) {
            return image.el === $el[0];
          });
          if (image != null) {
            return _loadImage(image);
          }
        };

        Image.prototype.refreshImages = function() {
          return _loadImages();
        };

        Image.prototype.getOptions = function(update) {
          var copyOptions;
          copyOptions = {};
          if ((update != null) && update === true) {
            $.extend(copyOptions, _parseOptions());
          } else {
            $.extend(copyOptions, _options);
          }
          return copyOptions;
        };

        Image.prototype.getInfo = function() {
          var images;
          return images = _images.concat();
        };

        _dispose = function() {
          _unregisterImages();
          _removeListeners();
          _queue.clear();
          _queue = null;
          _selectors = null;
          return _queueSize = 5;
        };

        _init = function() {
          $scope = $('body');
          Setup(the(QueueLoader));
          _queue = new QueueLoader({
            callback: _onQueueLoadSetComplete,
            id: 'responsive',
            debug: false
          });
          _parseOptions();
          _registerImages();
          return _addListeners();
        };

        _registerImages = function() {
          if (_imagesRegistered) {
            _unregisterImages();
          }
          _selectors = $scope.find('img.responsive');
          if (($(document).livequery != null) && !_imagesRegistered) {
            _selectors.livequery(_onImageAddedToDOM, _onImageRemovedFromDOM);
          } else {
            _selectors.each(function() {
              return _createImage($(this));
            });
          }
          return _imagesRegistered = true;
        };

        _unregisterImages = function() {
          _images = [];
          if (typeof _selectors.expire === "function") {
            _selectors.expire();
          }
          return _imagesRegistered = false;
        };

        _addListeners = function() {
          var _this = this;
          return $(window).on('responsive:breakpoint', function(event, state) {
            return _breakpointState = state;
          });
        };

        _removeListeners = function() {
          return $(window).off('responsive:breakpoint');
        };

        _createImage = function($el) {
          var a, image, name;
          name = $el.parent().attr('id');
          if (name != null) {
            $el.name = name;
          }
          a = _parseURL($el.data('src'));
          image = {};
          image.el = $el[0];
          image.callback = _onImageLoadComplete;
          image.defaults = {
            full: a.href,
            origin: a.origin,
            pathname: a.pathname,
            search: a.search
          };
          _images.push(image);
          return image;
        };

        _parseOptions = function() {
          var isValidAutosizeKey, options, _ref;
          $('body').removeData('responsive-image');
          options = $('body').data('responsive-image');
          isValidAutosizeKey = typeof (options != null ? options.autosizeKey : void 0) === 'string' && (options != null ? (_ref = options.autosizeKey) != null ? _ref.length : void 0 : void 0) > 0;
          _options = {
            autosize: false
          };
          if (options != null) {
            if (isValidAutosizeKey) {
              _options.autosize = Boolean(options.autosize);
              if (_options.autosize) {
                _options.autosizeKey = options.autosizeKey;
              }
            } else {
              _options.autosize = false;
            }
          }
          return _options;
        };

        _parseURL = function(url) {
          var a;
          a = document.createElement('a');
          a.href = url;
          return a;
        };

        _onImageAddedToDOM = function() {
          var image;
          image = _createImage($(this));
          if (_imagesRegistered) {
            return _loadImage(image);
          }
        };

        _onImageRemovedFromDOM = function() {
          var removedImage,
            _this = this;
          removedImage = $(this)[0];
          return _images = _.reject(_images, function(image) {
            return image.el === removedImage;
          });
        };

        _onImageLoadComplete = function(image, payload) {
          $(window).trigger('responsive:image:imagecomplete', image, payload);
          return $(image).trigger('responsive:image:imagecomplete', payload);
        };

        _onQueueLoadSetComplete = function(payload) {
          return $(window).trigger('responsive:image:queuecomplete', payload);
        };

        _queueAllImages = function() {
          var image, _i, _len, _results;
          _queue.clear();
          _results = [];
          for (_i = 0, _len = _images.length; _i < _len; _i++) {
            image = _images[_i];
            _results.push(_addImageToQueue(image));
          }
          return _results;
        };

        _addImageToQueue = function(image) {
          var oldUrl, url;
          oldUrl = image.url;
          url = _buildURL(image);
          if (url === oldUrl) {
            return;
          }
          return _queue.add({
            el: image.el,
            url: url,
            callback: image.callback
          });
        };

        _buildURL = function(image) {
          var $el, breakpoint, dataImage, dataUrlParams, parentWidth, url;
          $el = $(image.el);
          breakpoint = _breakpointState.breakpoint;
          dataImage = $el.attr("data-image-" + breakpoint);
          dataUrlParams = $el.attr("data-url-params-" + breakpoint);
          if (dataImage != null) {
            url = dataImage;
          } else {
            url = $el.attr('data-src');
          }
          if (_options.autosize) {
            $el.css('width', '100%');
            parentWidth = Math.ceil($el.parent().innerWidth());
            image.parentWidth = parentWidth;
            url += "" + (_urlParamDelimeter(url)) + "wid=" + image.parentWidth;
          }
          if (dataUrlParams != null) {
            url += "" + (_urlParamDelimeter(url)) + dataUrlParams;
          }
          image.url = url;
          return url;
        };

        _urlParamDelimeter = function(url) {
          if (url.indexOf('?') === -1) {
            return '?';
          } else {
            return '&';
          }
        };

        _loadImages = function() {
          if (_breakpointState != null) {
            _queueAllImages();
            return _queue.start();
          }
        };

        _loadImage = function(image) {
          if (_breakpointState != null) {
            _addImageToQueue(image);
            return _queue.start();
          }
        };

        return Image;

      })();
      instance = void 0;
      return {
        getInstance: function(params) {
          if (!instance) {
            instance = new Image(params);
          }
          return instance;
        }
      };
    })();
    ResponsiveDevice = (function(params) {
      var Device, instance;
      Device = (function() {
        function Device(params) {
          if (params == null) {
            params = {};
          }
        }

        Device.prototype.isMobile = function() {
          return Modernizr.touch;
        };

        Device.prototype.isDesktop = function() {
          return !Modernizr.touch;
        };

        return Device;

      })();
      instance = void 0;
      return {
        getInstance: function(params) {
          if (!instance) {
            instance = new Device(params);
          }
          return instance;
        }
      };
    })();
    ResponsiveBreakpoint = (function(params) {
      var Breakpoint, instance;
      Breakpoint = (function() {
        var _breakpoints, _defaultBreakpoints, _el, _getBreakpointDevice, _jRes, _onBreakpointEnter, _onBreakpointExit, _registerBreakpoints, _setState, _state, _toggleClasses;

        _el = void 0;

        _breakpoints = void 0;

        _jRes = void 0;

        _state = void 0;

        function Breakpoint(params) {
          if (params == null) {
            params = {};
          }
          _el = (params.el != null) ? $(params.el) : $('html');
          _breakpoints = params.breakpoints || _defaultBreakpoints();
          _jRes = jRespond(_breakpoints);
          _registerBreakpoints();
        }

        Breakpoint.prototype.state = function() {
          return _state;
        };

        Breakpoint.prototype.isDeviceEqualTo = function(value) {
          if (typeof value !== 'string') {
            throw new ReferenceError("The parameter [" + value + "] must be a String");
          }
          if (value.length <= 0) {
            throw new Error('The parameter must not be empty.');
          }
          return value === _state.device;
        };

        Breakpoint.prototype.isBreakpointEqualTo = function(value) {
          if (typeof value !== 'string') {
            throw new ReferenceError("The parameter [" + value + "] must be a String");
          }
          if (value.length <= 0) {
            throw new Error('The parameter must not be empty.');
          }
          return value === _state.breakpoint;
        };

        Breakpoint.prototype.isMobile = function() {
          return this.isDeviceEqualTo('mobile');
        };

        Breakpoint.prototype.isDeviceStateMobile = function() {
          return this.isDeviceEqualTo('mobile');
        };

        Breakpoint.prototype.isTablet = function() {
          return this.isDeviceEqualTo('tablet');
        };

        Breakpoint.prototype.isDeviceStateTablet = function() {
          return this.isDeviceEqualTo('tablet');
        };

        Breakpoint.prototype.isDesktop = function() {
          return this.isDeviceEqualTo('desktop');
        };

        Breakpoint.prototype.isDeviceStateDesktop = function() {
          return this.isDeviceEqualTo('desktop');
        };

        _onBreakpointEnter = function(breakpoint) {
          var oldState;
          oldState = _state != null ? _state : '';
          _setState(breakpoint);
          _toggleClasses(oldState, _state);
          if ((oldState != null ? oldState.device : void 0) !== _state.device) {
            $(window).trigger("responsive:breakpoint:" + oldState.device + ":exit", oldState);
          }
          $(window).trigger('responsive:breakpoint', _state);
          if (oldState.device !== _state.device) {
            return $(window).trigger("responsive:breakpoint:" + _state.device, _state);
          }
        };

        _onBreakpointExit = function() {
          return $(window).trigger('responsive:breakpoint:exit', _state);
        };

        _defaultBreakpoints = function() {
          return [
            {
              label: 'break-a',
              enter: 0,
              exit: 640,
              devices: ['mobile']
            }, {
              label: 'break-b',
              enter: 641,
              exit: 768,
              devices: ['tablet']
            }, {
              label: 'break-c',
              enter: 769,
              exit: 1024,
              devices: ['desktop']
            }, {
              label: 'break-d',
              enter: 1025,
              exit: 1280,
              devices: ['desktop']
            }, {
              label: 'break-e',
              enter: 1281,
              exit: 100000,
              devices: ['desktop']
            }
          ];
        };

        _registerBreakpoints = function() {
          var item, _i, _len, _results,
            _this = this;
          _results = [];
          for (_i = 0, _len = _breakpoints.length; _i < _len; _i++) {
            item = _breakpoints[_i];
            _results.push((function(item) {
              return _jRes.addFunc({
                breakpoint: item.label,
                enter: function() {
                  return _onBreakpointEnter(item);
                },
                exit: function() {
                  return _onBreakpointExit();
                }
              });
            })(item));
          }
          return _results;
        };

        _setState = function(breakpoint) {
          _state = {};
          _state.breakpoint = breakpoint.label;
          _state.enter = breakpoint.enter;
          _state.exit = breakpoint.exit;
          _state.device = _getBreakpointDevice(breakpoint.devices);
          return _state;
        };

        _getBreakpointDevice = function(devices) {
          var device, _i, _len;
          if (devices.length === 1) {
            return devices[0];
          }
          for (_i = 0, _len = devices.length; _i < _len; _i++) {
            device = devices[_i];
            switch (device) {
              case 'mobile' || 'tablet':
                if (Responsive.Device.isMobile()) {
                  return device;
                }
                break;
              default:
                if (Responsive.Device.isDesktop()) {
                  return device;
                }
            }
          }
          return devices[0];
        };

        _toggleClasses = function(oldState, newState) {
          if (oldState != null) {
            $(_el).removeClass("" + oldState.breakpoint + " " + oldState.device);
          }
          return $(_el).addClass("" + newState.breakpoint + " " + newState.device);
        };

        return Breakpoint;

      })();
      instance = void 0;
      return {
        getInstance: function(params) {
          if (!instance) {
            instance = new Breakpoint(params);
          }
          return instance;
        }
      };
    })();
    _device = Responsive.Device = ResponsiveDevice.getInstance();
    _breakpoint = Responsive.Breakpoint = ResponsiveBreakpoint.getInstance();
    _deepFreeze = function(o) {
      var prop, propKey, _results;
      Object.freeze(o);
      _results = [];
      for (propKey in o) {
        prop = o[propKey];
        if (!o.hasOwnProperty(propKey) || (typeof prop !== 'object') || Object.isFrozen(prop)) {
          continue;
        }
        _results.push(_deepFreeze(prop));
      }
      return _results;
    };
    return Responsive;
  });

}).call(this);
