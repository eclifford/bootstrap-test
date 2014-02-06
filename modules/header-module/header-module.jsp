<!-- Docs master nav -->
<header class="navbar header-nav" data-json-file="/vendor/bower_components/visa-bootstrap/assets/json/header-navigation.json">
   <div class="container">
      <nav class="navbar-header">
         <div class="navbar-header-inner">
            <button class="navbar-toggle" type="button">
            <span class='toggle-text'>Menu</span><span class="toggle-icon"></span>
            </button>
            <div class="header-search">
              <div id="search-bg"></div>
              <form name="seek1" method="get" accept-charset="iso-8859-1" action="http://visasearch.visa.com/UsaSearch/query.html" id="search-form">
                <div class="searchinputs">
                  <div class="searchfield">
                    <input class="search-field" name="qt" id="search"  type="text" onfocus="if(this.value == 'Search...') { this.value = ''; }" onblur="this.value!=this.value?'Search...':this.value;" value="Search..." />
                    <input type="hidden" name="col" value="usa" />
                    <input type="hidden" name="qs" value="" />
                    <input type="hidden" name="ws" value="0" />
                    <input type="hidden" name="st" value="1" />
                    <input type="hidden" name="style" value="usa" />
                  </div>
                </div>
              </form>
              <button class="nav-search" type="button"><span class="search-icon"></span></button>
            </div>
            <a href="/" class="navbar-brand"><span id='visa-header-logo'></span></a>
         </div>

         <div id="nav-container" class="nav-container nav-collapse collapse"></div>
      </nav>
   </div>
</header>

<!-- Begin:Header Templates -->
<!-- Primary Breadcrumb -->
<script id="primary_breadcrumb" type="text/template">
   Home
   <span class="section-title"></span>
</script>
<!-- Personal Nav -->
<script id="personal-nav" type="text/template">
   <a
      class="primary-nav-link nav-link"
      {{ if (typeof(href) !== 'undefined') { }}
         href="{{= href }}"
      {{ } }}
   >
      <span class="nav-breadbrumb-icon"></span><span class="title">{{= title }}</span><span class="karat"></span>
   </a>
   {{ if (typeof(subNav) !== 'undefined') { }}
      <a class="expand"></a>
   {{ } }}
   <div style="clear: both"></div>
   <ul class="nav main subnav level-{{= level }}"></ul>
</script>
<!-- Top level Title -->
<script id="top-level-title" type="text/template">
   <span>{{= title }}</span>
</script>
<!-- About Nav -->
<script id="about-nav" type="text/template">
   <a
      class="primary-nav-link nav-link"
      {{ if (typeof(href) !== 'undefined') { }}
         href="{{= href }}"
      {{ } }}
   >
      <span class="nav-breadbrumb-icon"></span><span class="title">{{= title }}</span><span class="karat"></span>
   </a>
   <a class="expand "></a>
   <div style="clear: both"></div>
   <ul class="nav main subnav level-{{= level }}"></ul>
</script>
<!-- Begin:Header Templates -->

