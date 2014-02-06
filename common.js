(function() {
  require.config({
    baseUrl: '/',
    paths: {
      'bootstrap': 'vendor/bower_components/sass-bootstrap/js/',
      'jquery': 'vendor/bower_components/jquery/jquery',
      'jqueryui': 'vendor/bower_components/jqueryui/ui/jquery-ui',
      'mustache': 'vendor/bower_components/mustache/mustache',
      'header-nav': 'modules/header-module/header-module',
      'footer': 'modules/footer-module/footer-module',
      'queue-loader': 'common/akqa/queue-loader',
      'responsive': 'common/akqa/responsive'
    },
    shim: {
      'bootstrap': {
        deps: ["jquery"]
      },
      'header-nav': {
        deps: ["jquery"]
      }
    }
  });

}).call(this);
