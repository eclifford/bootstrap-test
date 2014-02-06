(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($, window, document) {
    var HeaderNav;
    HeaderNav = (function() {
      HeaderNav.prototype.initBackbone = function() {
        var url,
          _this = this;
        url = this.$el.data('json-file');
        if (url == null) {
          throw new Error('You must supply a json file to the header via the data-json-file attribute on the header-nav');
        }
        new Backbone.Model({}).fetch({
          url: url,
          success: function(model, response, options) {
            _this.initVars();
            _this.initTemplates();
            _this.initModel(model, false);
            _this.initView();
            return _this;
          },
          error: function(model, response, options) {
            return _this;
          }
        });
        return this;
      };

      HeaderNav.prototype.initVars = function() {
        this.NAV_BREADCRUMB = 'primary_breadcrumb';
        this.NAV_PERSONAL = 'personal-nav';
        this.NAV_TITLE = 'top-level-title';
        this.NAV_ABOUT = 'about-nav';
        return this;
      };

      HeaderNav.prototype.initTemplates = function() {
        _.templateSettings = {
          evaluate: /\{\{(.+?)\}\}/g,
          interpolate: /\{\{=(.+?)\}\}/g
        };
        this.templates = {};
        this.templates["" + this.NAV_BREADCRUMB] = Backbone.Marionette.TemplateCache.get("#" + this.NAV_BREADCRUMB);
        this.templates["" + this.NAV_PERSONAL] = Backbone.Marionette.TemplateCache.get("#" + this.NAV_PERSONAL);
        this.templates["" + this.NAV_TITLE] = Backbone.Marionette.TemplateCache.get("#" + this.NAV_TITLE);
        this.templates["" + this.NAV_ABOUT] = Backbone.Marionette.TemplateCache.get("#" + this.NAV_ABOUT);
        return this.templates;
      };

      HeaderNav.prototype.initModel = function(model, debug) {
        var breadcrumb, subNav, title, tree,
          _this = this;
        tree = model.get('primaryNavigation');
        _.each(tree, function(item) {
          return item.template = _this.NAV_PERSONAL;
        });
        if (debug === false) {
          breadcrumb = [
            {
              id: 0,
              template: this.NAV_BREADCRUMB
            }
          ];
          title = _.findWhere(tree, {
            type: 'topLevel'
          });
          subNav = title.subNav;
          delete title.id;
          delete title.subNav;
          title.template = this.NAV_TITLE;
          _.each(subNav, function(item) {
            return item.template = _this.NAV_ABOUT;
          });
          tree = breadcrumb.concat(tree, subNav);
          _.each(tree, function(item) {
            return item.className = item.template.split('_').join(' ');
          });
        }
        _.each(tree, function(item, index, list) {
          item.index = index;
          item.path = index.toString();
          item.level = 1;
          item.active = false;
          item.open = false;
          return item.breadcrumb = false;
        });
        this.treeModel = new Backbone.DeepModel({
          tree: tree,
          primary: {
            breadcrumb: false
          }
        });
        return this.treeModel;
      };

      HeaderNav.prototype.initView = function() {
        var $window, SelectableModel, SingleCollection, TreeBranch, TreeNode, TreeNodeCollection, TreeRoot, breadcrumbOffsetElementArray, collection, isIOS, isWindows, that, treeModel, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        that = this;
        treeModel = this.treeModel;
        isWindows = this.isWindows;
        isIOS = this.isIOS;
        $window = $(window);
        breadcrumbOffsetElementArray = [];
        TreeBranch = (function(_super) {
          __extends(TreeBranch, _super);

          function TreeBranch() {
            _ref = TreeBranch.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          TreeBranch.prototype.template = function(data) {
            var template;
            template = data.template || that.NAV_PERSONAL;
            return that.templates[template](data);
          };

          TreeBranch.prototype.tagName = 'li';

          TreeBranch.prototype.className = function() {
            return this.model.get('className' || '');
          };

          TreeBranch.prototype.attributes = function() {
            var atts;
            return atts = {
              'data-nav-id': this.model.get('id')
            };
          };

          TreeBranch.prototype.bindModelEvents = function() {
            var _this = this;
            this.treeModel.bind("change:" + this.treePath + ".active", function(model) {
              return _this;
            });
            this.treeModel.bind("change:" + this.treePath + ".open", function(model) {
              return _this;
            });
            if (this.isPrimary) {
              this.treeModel.bind("change:primary.breadcrumb", function(model) {
                var breadcrumb;
                breadcrumb = model.attributes.primary.breadcrumb;
                if (breadcrumb) {
                  _this.$el.html('<span class="white-up"></span>Main Menu');
                } else {
                  _this.$el.html('Home');
                }
                return _this;
              });
            }
            return this;
          };

          TreeBranch.prototype.bindViewEvents = function() {
            var _this = this;
            if (this.isPrimary) {
              this.$el.on('click', function(e) {
                var breadcrumb;
                breadcrumb = _this.treeModel.get("primary.breadcrumb");
                if (breadcrumb) {
                  _this.treeModel.set('primary.breadcrumb', false);
                  _this.model.collection.selected.set('breadcrumb', false);
                } else {
                  setTimeout(function() {
                    return window.location.href = '/';
                  }, 500);
                }
                return false;
              });
            }
            return this;
          };

          TreeBranch.prototype.getSiblingViews = function() {
            var all, except, index, lower, upper;
            if (!this.siblingViews) {
              index = this.model.get('index');
              all = _.toArray(this.parent.children._views);
              lower = all.slice(0);
              lower.splice(index, all.length - 1);
              upper = all.slice(0);
              upper.splice(0, index + 1);
              if ((this.model.get('level')) === 1) {
                all.shift();
                lower.shift();
              }
              except = lower.concat(upper);
              this.siblingViews = {
                all: all,
                lower: lower,
                upper: upper,
                except: except
              };
            }
            return this.siblingViews;
          };

          TreeBranch.prototype.activateBreadcrumb = function() {
            var duration, ease, height, index, level, siblingViewsExcept, siblingViewsLower, siblingViewsUpper,
              _this = this;
            this.$el.addClass('sub-breadcrumb');
            this.$subNavItems.addClass('current-primary');
            this.$expand.hide(0);
            siblingViewsLower = this.getSiblingViews().lower;
            siblingViewsUpper = this.getSiblingViews().upper;
            siblingViewsExcept = this.getSiblingViews().except;
            duration = 0.5;
            ease = Linear.easeOut;
            index = this.model.get('index');
            level = this.model.get('level');
            this.resetSubNavHeight = this.subNavHeight;
            height = this.$subNav.height() + ($window.height() * 2);
            TweenLite.to(this.$subNav, duration, {
              height: height,
              ease: ease
            });
            _.each(siblingViewsExcept, function(view, index) {
              return $(view.el).hide();
            });
            /*
            if isWindows
              # For PC Only
              # Remove siblings from the DOM
              _.each siblingViewsExcept, ( view, index ) =>
                $(view.el).hide()
            else
              # For Mac Only
              # Animate siblings
              # HACK : Hack Level 1000000
              offset = undefined
              if level is 1
                offset = $( '.primary.breadcrumb' ).outerHeight()
              else
                offset = breadcrumbOffsetElementArray[ level - 2 ]
            
              breadcrumbHeight = @elementHeight
              breadcrumbOffsetElementArray.push ( offset + breadcrumbHeight )
            
              elementOffsetTop = @$el.offset().top
              top = offset - elementOffsetTop
            
              TweenLite.to @$el, duration,
                top: top
                ease: ease
            
              _.each siblingViewsLower, ( view, index ) =>
                TweenLite.to view.el, duration,
                  alpha: 0
                  top: -50
                  ease: ease
            
              _.each siblingViewsUpper, ( view, index ) =>
                TweenLite.to view.el, duration,
                  alpha: 0
                  top: 100
                  ease: ease
            */

            if (this.isPrimarySibling) {
              this.treeModel.set('primary.breadcrumb', true);
            }
            return this;
          };

          TreeBranch.prototype.deactivateBreadcrumb = function() {
            var duration, ease, height, level, parentBreadcrumb, siblingViewsExcept,
              _this = this;
            this.$el.removeClass('sub-breadcrumb');
            this.$subNavItems.removeClass('current-primary');
            this.$expand.show(0);
            this.closeSubNav();
            siblingViewsExcept = this.getSiblingViews().except;
            duration = 0.5;
            ease = Linear.easeOut;
            level = this.model.get('level');
            _.each(siblingViewsExcept, function(view, index) {
              return $(view.el).show();
            });
            /*
            if isWindows
              # For PC Only
              # Add siblings to the DOM
              _.each siblingViewsExcept, ( view, index ) =>
                $(view.el).show()
            else
              # For Mac Only
              # Animate siblings
              breadcrumbOffsetElementArray.splice ( level - 1 )
            
              TweenLite.to @$el, duration,
                top: 0
                ease: ease
            */

            parentBreadcrumb = this.parent.model ? this.parent.model.get('breadcrumb') : false;
            if (this.isRoot || parentBreadcrumb) {
              height = this.resetSubNavHeight;
            } else {
              height = 0;
              this.closeSubNav();
            }
            TweenLite.to(this.$subNav, duration, {
              height: height,
              ease: ease
            });
            if (this.isPrimarySibling) {
              this.treeModel.set('primary.breadcrumb', false);
            }
            return this;
          };

          TreeBranch.prototype.animateSubNavOpen = function() {
            var subNavHeight,
              _this = this;
            subNavHeight = 0;
            this.$subNavItems.each(function(ixd, el) {
              return subNavHeight += $(el).outerHeight();
            });
            this.elementHeight = this.$el.outerHeight();
            this.subNavHeight = subNavHeight;
            TweenLite.to(this.$subNav, this.subNavSpeedOpen, {
              height: subNavHeight
            });
            return this;
          };

          TreeBranch.prototype.closeSubNav = function() {
            var selected, _ref1;
            selected = (_ref1 = this.collection) != null ? _ref1.selected : void 0;
            if (selected) {
              selected.deselect();
              if ((selected.get('breadcrumb')) === true) {
                selected.set('breadcrumb', false);
              }
            }
            return this;
          };

          TreeBranch.prototype.modelEvents = {
            'change:breadcrumb': function(ob) {
              if (ob.changed.breadcrumb) {
                this.activateBreadcrumb();
              } else {
                this.deactivateBreadcrumb();
              }
              this.treeModel.set("" + this.treePath + ".breadcrumb", ob.changed.breadcrumb);
              return this;
            },
            'change:active': function(ob) {
              this.treeModel.set("" + this.treePath + ".active", ob.changed.active);
              return this;
            },
            'change:open': function(ob) {
              this.treeModel.set("" + this.treePath + ".open", ob.changed.open);
              return this;
            },
            'selected': function(model) {
              var _ref1, _ref2;
              this.model.set('open', true);
              this.$el.addClass('active');
              this.$expand.addClass('open');
              this.$el.addClass('current-page');
              this.parent.$el.removeClass('current-page');
              this.animateSubNavOpen();
              if ((_ref1 = this.parent) != null ? (_ref2 = _ref1.model) != null ? _ref2.selected : void 0 : void 0) {
                this.parent.model.set('breadcrumb', true);
              }
              return this;
            },
            'deselected': function(model) {
              this.model.set('open', false);
              this.$el.removeClass('active');
              this.$expand.removeClass('open');
              this.$el.removeClass('current-page');
              TweenLite.to(this.$subNav, this.subNavSpeedClose, {
                height: 0
              });
              this.closeSubNav();
              return this;
            }
          };

          TreeBranch.prototype.events = {
            'click .nav-link': function(e) {
              e.preventDefault();
              if ((this.model.get('breadcrumb')) === true) {
                this.model.set('breadcrumb', false);
              } else {
                this.model.set('active', !(this.model.get('active')));
                window.location.href = this.model.get('href');
              }
              return false;
            },
            'click .expand': function(e) {
              e.preventDefault();
              this.model.toggleSelected();
              return false;
            }
          };

          TreeBranch.prototype.checkDeeplink = function() {
            var deeplink, href, models, queueParentModel, selectModels,
              _this = this;
            deeplink = window.location.pathname;
            href = this.model.get('href');
            models = [];
            selectModels = function() {
              var model, _i, _len;
              for (_i = 0, _len = models.length; _i < _len; _i++) {
                model = models[_i];
                model.select();
              }
              window.dispatchEvent(new Event('header-nav-loaded'));
              return _this;
            };
            queueParentModel = function(parent) {
              if (parent.options.root === true) {
                selectModels();
              } else {
                models.unshift(parent.model);
                queueParentModel(parent.parent);
              }
              return _this;
            };
            if (href === deeplink) {
              setTimeout(function() {
                models.unshift(_this.model);
                return queueParentModel(_this.parent);
              }, 500);
            }
            return this;
          };

          TreeBranch.prototype.itemViewOptions = function() {
            return {
              parent: this,
              treeModel: treeModel
            };
          };

          TreeBranch.prototype.initialize = function(options) {
            this.setVars();
            this.setCollection();
            this.bindModelEvents();
            this.bindViewEvents();
            this.checkDeeplink();
            return this;
          };

          TreeBranch.prototype.setVars = function() {
            this.index = this.model.get('index');
            this.parent = this.options.parent;
            this.treeModel = this.options.treeModel;
            this.treePath = "tree." + ((this.model.get('path')).split('.').join('.subNav.'));
            this.subNavArr = this.model.get('subNav');
            this.subNavArrLength = this.subNavArr != null ? this.subNavArr.length : 0;
            this.subNavSpeedOpen = (Math.max(500, this.subNavArrLength * 150)) / 1000;
            this.subNavSpeedClose = this.subNavSpeedOpen * 0.5;
            this.isRoot = this.parent.options.root === true;
            this.isPrimary = this.isRoot === true && (this.model.get('index')) === 0;
            this.isPrimarySibling = this.isRoot === true;
            return this;
          };

          TreeBranch.prototype.setElementVars = function() {
            this.$expand = this.$el.children('.expand');
            this.$subNav = this.$el.children('.subnav');
            this.$subNavItems = this.$subNav.children();
            return this;
          };

          TreeBranch.prototype.setCollection = function() {
            var level, path,
              _this = this;
            this.collection = this.model.nodes;
            if (this.collection != null) {
              path = this.model.get('path');
              level = (this.model.get('level')) + 1;
              this.collection.each(function(item, index, list) {
                item.set('index', index);
                item.set('path', path + '.' + index);
                item.set('level', level);
                item.set('open', false);
                item.set('active', false);
                return item.set('breadcrumb', false);
              });
            }
            return this;
          };

          TreeBranch.prototype.appendHtml = function(collectionView, itemView) {
            collectionView.$('ul:first').append(itemView.el);
            return this;
          };

          TreeBranch.prototype.onRender = function() {
            this.setElementVars();
            if (this.collection == null) {
              this.$('ul:first').remove();
            }
            return this;
          };

          return TreeBranch;

        })(Backbone.Marionette.CompositeView);
        TreeRoot = (function(_super) {
          __extends(TreeRoot, _super);

          function TreeRoot() {
            _ref1 = TreeRoot.__super__.constructor.apply(this, arguments);
            return _ref1;
          }

          TreeRoot.prototype.tagName = 'ul';

          TreeRoot.prototype.className = 'nav main primary-nav';

          TreeRoot.prototype.itemView = TreeBranch;

          TreeRoot.prototype.itemViewOptions = function() {
            return {
              parent: this,
              treeModel: treeModel
            };
          };

          return TreeRoot;

        })(Backbone.Marionette.CollectionView);
        SelectableModel = (function(_super) {
          __extends(SelectableModel, _super);

          function SelectableModel() {
            _ref2 = SelectableModel.__super__.constructor.apply(this, arguments);
            return _ref2;
          }

          SelectableModel.prototype.initialize = function() {
            var selectable;
            selectable = new Backbone.Picky.Selectable(this);
            _.extend(this, selectable);
            return this;
          };

          return SelectableModel;

        })(Backbone.Model);
        TreeNode = (function(_super) {
          __extends(TreeNode, _super);

          function TreeNode() {
            _ref3 = TreeNode.__super__.constructor.apply(this, arguments);
            return _ref3;
          }

          TreeNode.prototype.initialize = function() {
            var nodes;
            TreeNode.__super__.initialize.apply(this, arguments);
            nodes = this.get('subNav');
            if (nodes != null) {
              this.nodes = new TreeNodeCollection(nodes);
              this.unset('nodes');
            }
            return this;
          };

          return TreeNode;

        })(SelectableModel);
        SingleCollection = (function(_super) {
          __extends(SingleCollection, _super);

          function SingleCollection() {
            _ref4 = SingleCollection.__super__.constructor.apply(this, arguments);
            return _ref4;
          }

          SingleCollection.prototype.model = SelectableModel;

          SingleCollection.prototype.initialize = function() {
            var singleSelect;
            singleSelect = new Backbone.Picky.SingleSelect(this);
            _.extend(this, singleSelect);
            return this;
          };

          return SingleCollection;

        })(Backbone.Collection);
        TreeNodeCollection = (function(_super) {
          __extends(TreeNodeCollection, _super);

          function TreeNodeCollection() {
            _ref5 = TreeNodeCollection.__super__.constructor.apply(this, arguments);
            return _ref5;
          }

          TreeNodeCollection.prototype.model = TreeNode;

          return TreeNodeCollection;

        })(SingleCollection);
        collection = new TreeNodeCollection(treeModel.get('tree'));
        this.treeView = new TreeRoot({
          collection: collection,
          root: true
        });
        this.treeView.render();
        $('.nav-container').append(this.treeView.el);
        return this.treeView;
      };

      function HeaderNav(el, options) {
        var _this = this;
        this.$window = $(window);
        this.$html = $('html');
        this.$body = $('body');
        this.$navCollapse = $('.nav-collapse');
        this.$el = $(el);
        this.parameters = $.extend({}, $.fn.headernav.defaults, options);
        this.defaultTransitionSpeed = this.parameters.defaultTransitionSpeed;
        this.isIOS = false;
        if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
          this.isIOS = true;
          this.$html.addClass('ua-ios');
        }
        this.isWindows = false;
        if (navigator.appVersion.match(/(Win)/g)) {
          this.isWindows = true;
          this.$html.addClass('os-windows');
        }
        this.isChrome = false;
        if (navigator.userAgent.match(/(Chrome)/g)) {
          this.isChrome = true;
          this.$html.addClass('browser-chrome');
        }
        this.addModernizrTests();
        this.hasScrollbarWidth = false;
        if (Modernizr.scrollbarwidth === true) {
          this.hasScrollbarWidth = false;
        }
        this.loadData();
        $(this.$navCollapse, this.$el).height(window.innerHeight);
        this.$window.on('resize', function(e) {
          return _this.onResize();
        });
      }

      HeaderNav.prototype.addModernizrTests = function() {
        return Modernizr.addTest("scrollbarwidth", function() {
          var element, head, root, rules, scrollbarWidth, style;
          rules = void 0;
          head = void 0;
          root = void 0;
          element = void 0;
          scrollbarWidth = void 0;
          style = void 0;
          rules = ["#modernizr-scrollbarwidth{ width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px; }"];
          head = document.getElementsByTagName("head")[0] || ((function() {
            return document.documentElement.appendChild(document.createElement("head"));
          })());
          root = document.body || ((function() {
            return document.documentElement.appendChild(document.createElement("body"));
          })());
          element = document.createElement("div");
          style = document.createElement("style");
          style.type = "text/css";
          if (style.styleSheet) {
            style.styleSheet.cssText = rules.join("");
          } else {
            style.appendChild(document.createTextNode(rules.join("")));
          }
          head.appendChild(style);
          element.id = "modernizr-scrollbarwidth";
          root.appendChild(element);
          scrollbarWidth = element.offsetWidth - element.clientWidth;
          head.removeChild(style);
          root.removeChild(element);
          return scrollbarWidth > 0;
        });
      };

      HeaderNav.prototype.onResize = function() {
        $(this.$navCollapse, this.$el).height(window.innerHeight);
        if (this.$body.hasClass('open-nav')) {
          return $(this.$body, this.$el).height(window.innerHeight);
        } else {
          return this.$body.height('auto');
        }
      };

      HeaderNav.prototype.loadData = function() {
        var _this = this;
        if ($(this.$el).data('json-file') == null) {
          throw new Error('You must supply a json file to the header via the data-json-file attribute on the header-nav');
        }
        this.initBackbone();
        $.each($.fn.headernav.defaults.els, function(k, v) {
          return _this.$el[k] = $(v, _this.$el);
        });
        this.createClickHandlers();
        if ($('li.current-page', this.$el).length > 0) {
          return this.renderNavForCurrentPage();
        }
      };

      HeaderNav.prototype.renderNavForCurrentPage = function() {
        var currentNavItem, isCompleted, navItem, navLevel, primaryNavItem, _results;
        $(this.$el).addClass('nav-deeplinked');
        currentNavItem = $('li.current-page', this.$el);
        primaryNavItem = $('li.current-page', this.$el).closest($('ul.primary-nav > li'));
        this.primaryNavItemClicked($('> a.expand', primaryNavItem), false);
        navLevel = 1;
        isCompleted = false;
        _results = [];
        while (!isCompleted) {
          navItem = $('li.current-page', this.$el).closest($("ul.level-" + navLevel + " > li"));
          if (navItem.length > 0) {
            this.secondaryNavItemClicked($('> a.expand', navItem), false);
            _results.push(navLevel++);
          } else {
            _results.push(isCompleted = true);
          }
        }
        return _results;
      };

      HeaderNav.prototype.createClickHandlers = function() {
        var _this = this;
        $('.navbar-header').on("click", ".navbar-toggle", function(e) {
          return _this.toggleClicked(e);
        });
        return $('.navbar-header').on("click", ".nav-search", function(e) {
          return _this.toggleSearch(e);
        });
      };

      HeaderNav.prototype.toggleSearch = function(e) {
        var isopen, oursearchterm, _this;
        _this = this;
        isopen = $("#search-bg").width();
        oursearchterm = $("#search").val();
        if (isopen > 1) {
          if ((oursearchterm !== "Search...") && (oursearchterm !== "")) {
            event.preventDefault();
            return $("form").submit();
          } else {
            $("#search").css({
              visibility: "hidden"
            });
            $("#search").css({
              opacity: 0
            });
            return $("#search-bg").css({
              width: "0px"
            });
          }
        } else {
          _this = this;
          return $("#search-bg").animate({
            width: "240px"
          }, 500, function() {
            $("#search").css({
              opacity: 0,
              visibility: "visible"
            }).animate({
              opacity: 1.0
            }, 250);
            return $("#search").keypress(function(event) {
              if (event.which === 13) {
                event.preventDefault();
                return $("form").submit();
              }
            });
          });
        }
      };

      HeaderNav.prototype.toggleClicked = function(e) {
        var $body, $container;
        e.preventDefault();
        window.scrollTo(0, 0);
        this.updateContainerLocation();
        $body = $('body').toggleClass('open-nav');
        $container = $('body > div.container');
        if ($body.hasClass('open-nav')) {
          $('body').height(window.innerHeight);
          $container.on('touchstart click', function(e) {
            $body.removeClass('open-nav');
            e.preventDefault();
            $container.off('touchstart click');
            return $('body > .container').each(function() {
              return $(this).css('top', '');
            });
          });
          return window.scrollTo(0, 0);
        } else {
          return $('body').height('auto');
        }
      };

      HeaderNav.prototype.navLinkClicked = function(e) {
        e.preventDefault();
        this.updateContainerLocation();
        return $('body').removeClass('open-nav');
      };

      HeaderNav.prototype.primaryNavItemClicked = function(el, shouldAnimate) {
        if (shouldAnimate == null) {
          shouldAnimate = true;
        }
        console.log('primaryNavItemClicked');
        this.collapseNavItem($('li.active ul.subnav'));
        $('li.active').removeClass('active');
        if (!$(el).hasClass('open')) {
          $(".expand").removeClass('open');
          $(el).addClass('open');
          return this.expandSelectedNav(el, shouldAnimate);
        } else {
          return $(el).removeClass('open');
        }
      };

      HeaderNav.prototype.secondaryNavItemClicked = function(el, shouldAnimate) {
        var $selectedNavSection, finalTopOffset, grandparentNodeListItem, mainBreadcrumbHeight, navIndex, numBreadcrumbs, parentNodeList, subBreadcrumbHeight, topOffset,
          _this = this;
        if (shouldAnimate == null) {
          shouldAnimate = true;
        }
        console.log('secondaryNavItemClicked');
        parentNodeList = $(el).parent().parent();
        grandparentNodeListItem = parentNodeList.parent();
        navIndex = $('> li:not(.breadcrumb)', grandparentNodeListItem.parent()).index(grandparentNodeListItem);
        $selectedNavSection = $($("> li:not(.breadcrumb)", grandparentNodeListItem.parent()).get(navIndex));
        $('.current-list').removeClass('current-list');
        $(el).parent().addClass('current-list');
        if (!$(el).hasClass('open')) {
          $(".subnav > li > a.expand").removeClass('open');
          $(el).addClass('open');
          this.transitionOutNav(navIndex, grandparentNodeListItem.parent());
          if ($('.sub-breadcrumb').length > 0) {
            topOffset = $selectedNavSection.offset().top;
          } else {
            topOffset = $selectedNavSection.position().top;
          }
          numBreadcrumbs = $('li.sub-breadcrumb', '.primary-nav').length;
          subBreadcrumbHeight = $('li.sub-breadcrumb a.nav-link', '.primary-nav').outerHeight();
          mainBreadcrumbHeight = $('li.primary.breadcrumb').outerHeight();
          finalTopOffset = (topOffset * -1) + mainBreadcrumbHeight + (numBreadcrumbs * subBreadcrumbHeight);
          if (!$selectedNavSection.hasClass('sub-breadcrumb')) {
            $('.collapse', this.$el).animate({
              scrollTop: 0
            });
            if (shouldAnimate) {
              $selectedNavSection.addClass('open').animate({
                top: finalTopOffset
              }, this.defaultTransitionSpeed, function() {
                return _this.openSelectedNav($selectedNavSection, parentNodeList);
              });
            } else {
              $selectedNavSection.addClass('open').css('top', finalTopOffset);
              this.openSelectedNav($selectedNavSection, parentNodeList, shouldAnimate);
            }
          } else {
            this.openSelectedNav($selectedNavSection, parentNodeList);
          }
          this.transitionNavItemToBreadcrumb($selectedNavSection);
          $(".subnav > li > a.expand").removeClass('open');
          $(el).addClass('open');
        } else {
          $(el).removeClass('open');
          $('> li', parentNodeList).addClass('current-primary');
          this.collapseNavItem($('> ul', $(el).parent()));
        }
        return this.updateHomeSection();
      };

      HeaderNav.prototype.breadcrumbClicked = function(e) {
        var breadcrumbIndex, primaryNav, secondaryNav;
        e.preventDefault();
        secondaryNav = $(e.currentTarget).parent();
        primaryNav = $(e.currentTarget).parent().parent();
        breadcrumbIndex = $('li.sub-breadcrumb', '.primary-nav').index(secondaryNav);
        $("li.sub-breadcrumb:gt(" + (breadcrumbIndex - 1) + ")", '.primary-nav').removeClass('sub-breadcrumb');
        if (breadcrumbIndex === 0) {
          $('a.expand', e.currentTarget).fadeIn();
          this.showMainMenu(e, true);
          this.updateHomeSection();
          return;
        }
        $('a.expand', secondaryNav).fadeIn();
        this.removeNavPositioning($('li.active > ul.subnav > li'));
        this.collapseNavItem($('li.current-list > ul'));
        $('li.current-list').removeClass('active');
        $('li.current-list').parent().css('height', 'auto');
        $('li.open').removeClass('open');
        $('li.current-primary').removeClass('current-primary');
        $(secondaryNav).removeClass('sub-breadcrumb').addClass('current-primary');
        this.transitionInNav(primaryNav);
        $('li.active > ul.subnav > li a.expand').removeClass('open');
        $('li.active > ul.subnav > li').removeClass('current-list');
        return this.updateHomeSection();
      };

      HeaderNav.prototype.updateContainerLocation = function() {
        if (!$('body').hasClass('open-nav')) {
          return $('body > .container').each(function() {
            return $(this).css('top', $(this).position().top);
          });
        } else {
          return $('body > .container').attr('style', '');
        }
      };

      HeaderNav.prototype.transitionInNav = function(el) {
        return $('> li:not(.breadcrumb)', $(el)).addClass('current-primary').animate({
          top: 0,
          opacity: 1
        }, this.defaultTransitionSpeed);
      };

      HeaderNav.prototype.collapseNavItem = function(el, callback) {
        $(el).each(function() {
          var numListItems;
          numListItems = $('> li', this).length;
          return $(this).removeClass('auto-height').animate({
            height: 0
          }, 150 * numListItems);
        });
        return typeof callback === "function" ? callback() : void 0;
      };

      HeaderNav.prototype.transitionOutNav = function(navIndex, el) {
        $("> li:not(.breadcrumb):lt(" + navIndex + ")", el).animate({
          top: '-50px',
          opacity: 0
        }, this.defaultTransitionSpeed);
        $("> li:not(.breadcrumb):gt(" + navIndex + ")", el).animate({
          top: '+100px',
          opacity: 0
        }, this.defaultTransitionSpeed);
        return $(el).addClass('transitioned');
      };

      HeaderNav.prototype.expandSelectedNav = function(el, shouldAnimate) {
        var $activeSecondaryNav, animationSpeed, expandedHeight, numListItems;
        if (shouldAnimate == null) {
          shouldAnimate = true;
        }
        $activeSecondaryNav = $('> ul', $(el).parent());
        numListItems = $('> li', $activeSecondaryNav).length;
        expandedHeight = numListItems * $('> li', $activeSecondaryNav).outerHeight();
        console.log('$activeSecondaryNav', $activeSecondaryNav);
        animationSpeed = Math.max(500, numListItems * 150);
        $activeSecondaryNav.parent().addClass('active');
        if (shouldAnimate) {
          return $activeSecondaryNav.animate({
            height: expandedHeight
          }, animationSpeed);
        } else {
          return $activeSecondaryNav.css('height', expandedHeight);
        }
      };

      HeaderNav.prototype.transitionNavItemToBreadcrumb = function(el) {
        if (!$(el).hasClass('sub-breadcrumb')) {
          $('> a.expand', el).hide();
          return $(el).addClass('sub-breadcrumb').removeClass('current-primary');
        }
      };

      HeaderNav.prototype.openSelectedNav = function(el, parentList, shouldAnimate) {
        var animateSpeed, expandedHeight, listItemHeight, numListItems;
        if (shouldAnimate == null) {
          shouldAnimate = true;
        }
        $('li.current-list').parent().addClass('auto-height');
        numListItems = $('> ul > li.current-list > ul > li', el).length;
        listItemHeight = $('> ul > li.current-list > ul > li', el).outerHeight();
        expandedHeight = numListItems * listItemHeight;
        animateSpeed = Math.max(500, numListItems * 150);
        if (shouldAnimate) {
          $('> ul > li.current-list > ul', el).animate({
            height: expandedHeight
          }, animateSpeed);
        } else {
          $('> ul > li.current-list > ul', el).css('height', expandedHeight);
        }
        $('> li', parentList).addClass('current-primary');
        return this.collapseNavItem($('> li:not(.current-list) > ul', parentList));
      };

      HeaderNav.prototype.removeNavPositioning = function(el) {
        return $(el).animate({
          top: '0px',
          opacity: 1
        }, this.defaultTransitionSpeed);
      };

      HeaderNav.prototype.showMainMenu = function(e, keepSelectedOpen) {
        var _this = this;
        if (keepSelectedOpen == null) {
          keepSelectedOpen = false;
        }
        e.preventDefault;
        if ($('.sub-breadcrumb', this.$el).length === 0) {
          this.updateContainerLocation();
          return $('body').removeClass('open-nav');
        } else {
          $('.sub-breadcrumb > a.nav-link').each(function() {
            return $(this).html($(this).html().replace('^ ', ''));
          });
          $('.sub-breadcrumb', '.primary-nav').removeClass('sub-breadcrumb');
          $('> li.active a.expand', '.primary-nav').show().removeClass('open');
          $('> li.active > ul li.current-primary', '.primary-nav').removeClass('current-primary');
          this.removeNavPositioning($('li.active > ul > li', this.$el));
          if (!keepSelectedOpen) {
            this.collapseNavItem($('> li.active ul', '.primary-nav'), function() {
              _this.removeNavPositioning($('> li:not(.breadcrumb)', '.primary-nav'));
              return $('> li.active', '.primary-nav').removeClass('active').removeClass('open');
            });
          }
          if (keepSelectedOpen) {
            this.collapseNavItem($('> li.active > ul ul', '.primary-nav'), function() {
              return _this.removeNavPositioning($('> li:not(.breadcrumb)', '.primary-nav'));
            });
          }
          return $('li.open > a.expand').addClass('open');
        }
      };

      HeaderNav.prototype.updateHomeSection = function() {
        if ($('.sub-breadcrumb').length === 0) {
          return $('.primary.breadcrumb').html('Home');
        } else {
          return $('.primary.breadcrumb').html('<span class="white-up"></span>Main Menu');
        }
      };

      return HeaderNav;

    })();
    $.fn.headernav = function(args) {
      var _args, _public;
      _public = [];
      _args = arguments;
      return this.each(function() {
        if ($.inArray(_args[0], _public) !== -1) {
          return this.headerNav[_args[0]].apply($(this).data('header-nav'), Array.prototype.slice.call(_args, 1));
        } else {
          return this.headerNav = new HeaderNav(this, args);
        }
      });
    };
    $.fn.headernav.defaults = {
      defaultTransitionSpeed: 850,
      els: {
        breadcrumbs: 'li.sub-breadcrumb'
      }
    };
    return $(function() {
      return $('.header-nav').headernav();
    });
  })(jQuery, window, document);

  /*
  # Load data for the navigation
  loadData: ->
  
    unless $(@$el).data('json-file')?
      throw new Error('You must supply a json file to the header via the data-json-file attribute on the header-nav')
  
    $.getJSON String($(@$el).data 'json-file'), (data) =>
      @createAndPopulateDOM data
  
      @initBackbone()
  
      # Set the els
      $.each $.fn.headernav.defaults.els, (k, v) =>
        @$el[k] = $(v, @$el)
  
      @createClickHandlers()
  
      if $('li.current-page', @$el).length > 0
        @renderNavForCurrentPage()
  
      $(window).trigger("header-nav-loaded");
  
  
  
  
  createAndPopulateAboutNav: (data) ->
    $('.primary-nav').append "<li class='top-level-title'><span>#{data.title}</span></li>"
  
    for item in data.subNav
      @appendToDom item, 'about-nav'
  
  appendToDom: (item, navClass = '') ->
    # Set expand visibility based upon existence of a subnav
    if item.subNav?
      expandVisibility = ""
    else
      expandVisibility = "hidden"
  
    item.href = '#' unless item.href?
  
    navHTML = """
        <li data-nav-id="#{item.id}" class="#{navClass}">
          <a class='primary-nav-link nav-link' href='#{item.href}'><span class="nav-breadbrumb-icon"></span><span class="title">#{item.title}</span><span class="karat"></span></a>
          <a class='expand #{expandVisibility}'></a>
          <div style='clear: both'></div>
        </li>
        """
  
    # Append item to primary nav
    $('.primary-nav').append navHTML
  
    # If there is a subnav, add to DOM
    @appendSubNav item, 1 if item.subNav?
  
  
  # Populate the DOM
  # @param [JSON] data: JSON containing the navigation tree animation
  #
  createAndPopulateDOM: (data) ->
  
    # Add each item to the DOM
    for item in data.primaryNavigation
  
      if item.type? and item.type is 'topLevel'
        @createAndPopulateAboutNav item
      else
        @appendToDom item
  
  # Append Sub Nav to DOM
  # @param [Object] item: the nav item to append to
  # @param [int] level: the level of subnaviation
  #
  appendSubNav: (item, level) ->
  
    parentLI = $("li[data-nav-id='#{item.id}']")
    $(parentLI).append "<ul class='nav main level-#{level} subnav'></ul>"
  
    for subNavItem in item.subNav
  
      subNavItem.href = '#' unless subNavItem.href?
  
      if document.location.pathname is subNavItem.href
        currentPageClass = 'current-page'
      else
        currentPageClass = ''
  
      # Set expand visibility based upon exitence of a subnav
      if subNavItem.subNav?
        expandVisibility = ""
      else
        expandVisibility = "hidden"
  
      subNavItemHTML = """
        <li data-nav-id="#{subNavItem.id}" class="#{currentPageClass}">
          <a class='nav-link' href='#{subNavItem.href}'><span class="nav-breadbrumb-icon"></span><span class="title">#{subNavItem.title}</span><span class="karat"></span></a>
          <a class='expand #{expandVisibility}'></a>
          <div style='clear: both'></div>
        </li>
        """
  
      # Append the HTML
      $('> ul', parentLI).append subNavItemHTML
  
      # Recursively add subNav if exists on navigation item
      @appendSubNav subNavItem, level + 1 if subNavItem.subNav?
  */


}).call(this);
