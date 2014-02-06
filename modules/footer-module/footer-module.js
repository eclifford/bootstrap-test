(function() {
  (function($, window, document) {
    var VisaFooter;
    VisaFooter = (function() {
      function VisaFooter(el, options) {
        this.$el = $(el);
        $('body > #footer-target').addClass('container');
        this.parameters = $.extend({}, $.fn.footer.defaults, options);
        $(document).on("click", "footer li.list-title", function(e) {
          var list;
          list = $(this).closest('ul');
          if (Responsive.Breakpoint.isMobile()) {
            return $(list).toggleClass('open');
          }
        });
        $(window).on('responsive:breakpoint', function(event, state) {
          if (state.device === 'mobile') {
            return $('footer li:not(.list-title)').attr('style', '');
          } else {
            return $('footer li:not(.list-title)').attr('style', 'display: block !important');
          }
        });
      }

      return VisaFooter;

    })();
    $.fn.footer = function(args) {
      var _args, _public;
      _public = [];
      _args = arguments;
      return this.each(function() {
        if ($.inArray(_args[0], _public) !== -1) {
          return this.headerNav[_args[0]].apply($(this).data('footer'), Array.prototype.slice.call(_args, 1));
        } else {
          return this.headerNav = new VisaFooter(this, args);
        }
      });
    };
    return $(function() {
      return $('footer').footer();
    });
  })(jQuery, window, document);

}).call(this);
