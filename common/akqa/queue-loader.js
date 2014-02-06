(function() {
  var QueueLoader;

  window.QueueLoader = QueueLoader = function(options) {
    _(this).extend(options);
    if (this.debug) {
      console.warn('QueueLoader:', this, options);
    }
    return this.clear();
  };

  _(QueueLoader.prototype).extend({
    start: function() {
      if (!(this.running || this.queue.length <= 0)) {
        return this.proceed();
      }
    },
    add: function(image) {
      return this.queue.push(image);
    },
    proceed: function() {
      var results;
      if (_(this.queue).isEmpty()) {
        this.running = false;
        results = this.history.concat();
        this.clear();
        if (this.callback) {
          return this.callback(results);
        }
      } else {
        this.running = true;
        return this.load(this.queue.shift());
      }
    },
    load: function(options) {
      this.history.push(options);
      return this.setupImage(options, function(response) {
        if (options.callback) {
          return options.callback.call(this, response, options);
        }
      });
    },
    setupImage: function(options, callback) {
      var cacheBuster, image;
      image = options.el;
      image.onload = _(callback).chain().wrap(function(fn) {
        return fn.call(this, image);
      }).bind(this).value();
      cacheBuster = "";
      image.src = options.url;
      this.cursor = image;
      if (this.debug) {
        this.debugConsole();
      }
      return this.proceed();
    },
    clear: function() {
      this.queue = [];
      this.history = [];
      this.running = false;
      if (this.cursor != null) {
        this.cursor.onload = null;
      }
      return this.cursor = null;
    },
    debugConsole: function() {
      console.warn("=====> Queue Dump (" + (this.queue.length + this.history.length) + "): ", this.id);
      console.warn("       history (" + this.history.length + "):");
      _(this.history).each(function(item) {
        return console.warn("       ", item.url);
      });
      console.warn("       queue (" + this.queue.length + "):");
      _(this.queue).each(function(item) {
        return console.warn("       ", item.url);
      });
      return console.warn('');
    }
  });

  return QueueLoader;

}).call(this);
