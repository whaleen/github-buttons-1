// Generated by CoffeeScript 1.8.0
(function() {
  var Anchor, Code, Config, Element, FlatObject, Form, Frame, FrameContent, Hash, PreviewAnchor, PreviewButton, PreviewFrame, QueryString, Snippet, UI, UIElement,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Config = {
    api: "https://api.github.com",
    anchorClass: "github-button",
    iconClass: "octicon",
    icon: "octicon-mark-github",
    scriptId: "github-bjs",
    styles: ["default", "mega"]
  };

  if (Config.script = document.getElementById(Config.scriptId)) {
    Config.url = Config.script.src.replace(/buttons.js$/, "");
  }

  FlatObject = (function() {
    var __toString;

    function FlatObject() {}

    FlatObject.flatten = function(obj) {
      var flatten, result;
      flatten = function(object, super_key) {
        var index, item, key, value, _i, _len;
        switch (__toString.call(object)) {
          case "[object Object]":
            for (key in object) {
              value = object[key];
              flatten(value, super_key ? "" + super_key + "." + key : key);
            }
            break;
          case "[object Array]":
            for (index = _i = 0, _len = object.length; _i < _len; index = ++_i) {
              item = object[index];
              flatten(item, super_key ? "" + super_key + "[" + index + "]" : "[" + index + "]");
            }
            break;
          default:
            result[super_key] = object;
        }
      };
      result = {};
      flatten(obj);
      return result;
    };

    FlatObject.expand = function(obj) {
      var flat_key, key, keys, match, namespace, sub_key, target, value, _i, _j, _len, _len1, _ref, _ref1;
      namespace = [];
      for (flat_key in obj) {
        value = obj[flat_key];
        keys = [];
        _ref = flat_key.split(".");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          match = key.match(/^(.*?)((?:\[[0-9]+\])*)$/);
          if (match[1]) {
            keys.push(match[1]);
          }
          if (match[2]) {
            _ref1 = match[2].replace(/^\[|\]$/g, "").split("][");
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              sub_key = _ref1[_j];
              keys.push(Number(sub_key));
            }
          }
        }
        target = namespace;
        key = 0;
        while (keys.length) {
          if (target[key] == null) {
            switch (__toString.call(keys[0])) {
              case "[object String]":
                target[key] = {};
                break;
              case "[object Number]":
                target[key] = [];
            }
          }
          target = target[key];
          key = keys.shift();
        }
        target[key] = value;
      }
      return namespace[0];
    };

    __toString = Object.prototype.toString;

    return FlatObject;

  })();

  QueryString = (function() {
    function QueryString() {}

    QueryString.stringify = function(obj) {
      var key, results, value;
      results = [];
      for (key in obj) {
        value = obj[key];
        if (value == null) {
          value = "";
        }
        results.push("" + key + "=" + value);
      }
      return results.join("&");
    };

    QueryString.parse = function(str) {
      var key, obj, pair, value, _i, _len, _ref, _ref1;
      obj = {};
      _ref = str.split("&");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        if (!(pair !== "")) {
          continue;
        }
        _ref1 = pair.split("="), key = _ref1[0], value = 2 <= _ref1.length ? __slice.call(_ref1, 1) : [];
        if (key !== "") {
          obj[key] = value.join("=");
        }
      }
      return obj;
    };

    return QueryString;

  })();

  Hash = (function() {
    function Hash() {}

    Hash.encode = function(data) {
      return "#" + encodeURIComponent(QueryString.stringify(FlatObject.flatten(data)));
    };

    Hash.decode = function(data) {
      if (data == null) {
        data = document.location.hash;
      }
      return FlatObject.expand(QueryString.parse(decodeURIComponent(data.replace(/^#/, ""))));
    };

    return Hash;

  })();

  Element = (function() {
    var addClass, addEventListener, hasClass, r_leading_and_trailing_whitespace, r_whitespace, removeClass, removeEventListener;

    function Element(tagName, callback) {
      this.element = document.createElement(tagName);
      if (callback) {
        callback(this.element);
      }
    }

    Element.prototype.on = function(event, func) {
      addEventListener(this.element, event, func);
    };

    Element.prototype.once = function(event, func) {
      var once;
      once = (function(_this) {
        return function() {
          removeEventListener(_this.element, event, once);
          func();
        };
      })(this);
      addEventListener(this.element, event, once);
    };

    Element.prototype.addClass = function(className) {
      if (!hasClass(this.element, className)) {
        addClass(this.element, className);
      }
    };

    Element.prototype.removeClass = function(className) {
      if (hasClass(this.element, className)) {
        removeClass(this.element, className);
      }
    };

    Element.prototype.hasClass = function(className) {
      return hasClass(this.element, className);
    };

    addEventListener = function(element, event, func) {
      if (element.addEventListener) {
        element.addEventListener("" + event, func);
      } else {
        element.attachEvent("on" + event, func);
      }
    };

    removeEventListener = function(element, event, func) {
      if (element.removeEventListener) {
        element.removeEventListener("" + event, func);
      } else {
        element.detachEvent("on" + event, func);
      }
    };

    r_whitespace = /[ \t\n\f\r]+/g;

    r_leading_and_trailing_whitespace = /^[ \t\n\f\r]+|[ \t\n\f\r]+$/g;

    addClass = function(element, className) {
      element.className += " " + className;
    };

    removeClass = function(element, className) {
      element.className = (" " + element.className + " ").replace(r_whitespace, " ").replace(" " + className + " ", "").replace(r_leading_and_trailing_whitespace, "");
    };

    hasClass = function(element, className) {
      return (" " + element.className + " ").replace(r_whitespace, " ").indexOf(" " + className + " ") >= 0;
    };

    return Element;

  })();

  Anchor = (function() {
    var filter_js;

    function Anchor() {}

    Anchor.parse = function(element) {
      return {
        href: filter_js(element.href),
        text: element.getAttribute("data-text") || element.textContent || element.innerText,
        data: {
          count: {
            api: (function() {
              var api;
              if (api = element.getAttribute("data-count-api")) {
                if ("/" !== api.charAt(0)) {
                  api = "/" + api;
                }
                return api;
              }
            })(),
            href: (function() {
              var href;
              if ((href = element.getAttribute("data-count-href")) && (href = filter_js(href))) {
                return href;
              } else {
                return filter_js(element.href);
              }
            })()
          },
          style: (function() {
            var i, style, _i, _len, _ref;
            if (style = element.getAttribute("data-style")) {
              _ref = Config.styles;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                i = _ref[_i];
                if (i === style) {
                  return style;
                }
              }
            }
            return Config.styles[0];
          })(),
          icon: (function() {
            var icon;
            if (icon = element.getAttribute("data-icon")) {
              return icon;
            }
          })()
        }
      };
    };

    filter_js = function(href) {
      if (!/^\s*javascript:/i.test(href)) {
        return href;
      }
    };

    return Anchor;

  })();

  Frame = (function(_super) {
    var isReady;

    __extends(Frame, _super);

    function Frame() {
      var callback, hash;
      hash = arguments[0], callback = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.hash = hash;
      this.callback = callback;
      Frame.__super__.constructor.call(this, "iframe", function(iframe) {
        var key, value, _ref, _ref1;
        _ref = {
          allowtransparency: true,
          scrolling: "no",
          frameBorder: 0
        };
        for (key in _ref) {
          value = _ref[key];
          iframe.setAttribute(key, value);
        }
        _ref1 = {
          border: "none",
          height: "0",
          width: "1px"
        };
        for (key in _ref1) {
          value = _ref1[key];
          iframe.style[key] = value;
        }
        if (callback[0]) {
          callback[0](iframe);
        }
      });
      this.once("load", (function(_this) {
        return function() {
          var script;
          script = _this.element.contentWindow.document.getElementsByTagName("script")[0];
          if (isReady(script)) {
            _this.reload();
          } else {
            _this.on.call({
              element: script
            }, "readystatechange", function(_, aborted) {
              if (aborted || isReady(script)) {
                _this.reload();
              }
            });
          }
        };
      })(this));
      this.element.contentWindow.document.open();
      this.element.contentWindow.document.write("<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"utf-8\">\n<title></title>\n<base target=\"_blank\"><!--[if lte IE 6]></base><![endif]-->\n<link rel=\"stylesheet\" href=\"" + Config.url + "assets/css/buttons.css\">\n<style>html{visibility:hidden;}</style>\n<script>document.location.hash = \"" + this.hash + "\";</script>\n</head>\n<body>\n<script src=\"" + Config.script.src + "\"></script>\n</body>\n</html>");
      this.element.contentWindow.document.close();
    }

    Frame.prototype.reload = function() {
      var body, contentDocument, html, style;
      contentDocument = this.element.contentWindow.document;
      html = contentDocument.documentElement;
      body = contentDocument.body;
      html.style.overflow = body.style.overflow = "visible";
      style = {
        height: "" + body.scrollHeight + "px",
        width: "" + body.scrollWidth + "px"
      };
      html.style.overflow = body.style.overflow = "";
      this.once("load", (function(_this) {
        return function() {
          var key, value;
          for (key in style) {
            value = style[key];
            _this.element.style[key] = value;
          }
          if (_this.callback[1]) {
            _this.callback[1](_this.element);
          }
        };
      })(this));
      this.element.src = "" + Config.url + "buttons.html" + this.hash;
    };

    isReady = function(element) {
      return !element.readyState || /loaded|complete/.test(element.readyState);
    };

    return Frame;

  })(Element);

  FrameContent = (function() {
    var Button, Count;

    function FrameContent(options) {
      document.body.className = options.data.style;
      document.getElementsByTagName("base")[0].href = options.href;
      new Button(options, function(buttonElement) {
        document.body.appendChild(buttonElement);
      });
      new Count(options, function(countElement) {
        document.body.appendChild(countElement);
      });
    }

    Button = (function(_super) {
      __extends(Button, _super);

      function Button(options, callback) {
        Button.__super__.constructor.call(this, "a", function(a) {
          a.className = "button";
          if (options.href) {
            a.href = options.href;
          }
          new Element("i", function(icon) {
            icon = document.createElement("i");
            icon.className = (function() {
              var classNames;
              classNames = [options.data.icon || Config.icon];
              if (Config.iconClass) {
                classNames.push(Config.iconClass);
              }
              return classNames.join(" ");
            })();
            a.appendChild(icon);
          });
          new Element("span", function(text) {
            if (options.text) {
              text.appendChild(document.createTextNode(" " + options.text + " "));
            }
            a.appendChild(text);
          });
          if (callback) {
            callback(a);
          }
        });
      }

      return Button;

    })(Element);

    Count = (function(_super) {
      __extends(Count, _super);

      function Count(options, callback) {
        var endpoint;
        if (options.data.count.api) {
          Count.__super__.constructor.call(this, "a", function(a) {
            a.className = "count";
            if (options.data.count.href) {
              a.href = options.data.count.href;
            }
            new Element("b", function(b) {
              a.appendChild(b);
            });
            new Element("i", function(i) {
              a.appendChild(i);
            });
            new Element("span", function(text) {
              a.appendChild(text);
              window.callback = function(json) {
                var data;
                window.callback = null;
                if (json.meta.status === 200) {
                  data = FlatObject.flatten(json.data)[options.data.count.api.split("#").slice(1).join("#")];
                  if (Object.prototype.toString.call(data) === "[object Number]") {
                    data = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }
                  text.appendChild(document.createTextNode(" " + data + " "));
                  if (callback) {
                    callback(a);
                  }
                }
              };
            });
          });
          endpoint = (function() {
            var query, url;
            url = options.data.count.api.split("#")[0];
            query = QueryString.parse(url.split("?").slice(1).join("?"));
            query.callback = "callback";
            return "" + (url.split("?")[0]) + "?" + (QueryString.stringify(query));
          })();
          new Element("script", function(script) {
            var head;
            script.async = true;
            script.src = "" + Config.api + endpoint;
            head = document.getElementsByTagName("head")[0];
            head.insertBefore(script, head.firstChild);
          });
        }
      }

      return Count;

    })(Element);

    return FrameContent;

  })();


  /*
   * Main
   */

  UIElement = (function(_super) {
    __extends(UIElement, _super);

    function UIElement(element) {
      this.element = element;
    }

    return UIElement;

  })(Element);

  Form = (function(_super) {
    __extends(Form, _super);

    function Form(element, callback) {
      var onchange, _i, _len, _ref;
      this.element = element;
      if (callback) {
        onchange = (function(_this) {
          return function() {
            callback(_this.serialize());
          };
        })(this);
        _ref = this.element.elements;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          this.on.call({
            element: element
          }, "change", onchange);
          if (element.type === "text") {
            this.on.call({
              element: element
            }, "input", onchange);
          }
        }
      }
    }

    Form.prototype.serialize = function() {
      var data, node, _i, _len, _ref;
      data = {};
      _ref = this.element.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (node.name) {
          switch (node.type) {
            case "radio":
            case "checkbox":
              if (node.checked) {
                data[node.name] = node.value;
              }
              break;
            default:
              data[node.name] = node.value;
          }
        }
      }
      return data;
    };

    Form.prototype.parse = function() {
      return Form.parse(this.serialize());
    };

    Form.parse = function(options) {
      var config, repo, type, user;
      type = options.type, user = options.user, repo = options.repo;
      config = {
        className: "github-button",
        href: (function() {
          switch (type) {
            case "follow":
              return "https://github.com/" + user;
            case "watch":
            case "star":
            case "fork":
              return "https://github.com/" + user + "/" + repo;
            case "issue":
              return "https://github.com/" + user + "/" + repo + "/issues";
            case "download":
              return "https://github.com/" + user + "/" + repo + "/archive/master.zip";
            default:
              return "https://github.com/";
          }
        })(),
        text: (function() {
          switch (type) {
            case "follow":
              return "Follow @" + user;
            default:
              return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
          }
        })(),
        data: {
          icon: (function() {
            switch (type) {
              case "watch":
                return "octicon-eye";
              case "star":
                return "octicon-star";
              case "fork":
                return "octicon-git-branch";
              case "issue":
                return "octicon-issue-opened";
              case "download":
                return "octicon-cloud-download";
              default:
                return "octicon-mark-github";
            }
          })()
        }
      };
      if (options["large-button"] != null) {
        config.data.style = "mega";
      }
      if (options["show-count"] != null) {
        switch (type) {
          case "follow":
            config.data["count-href"] = "/" + user + "/followers";
            config.data["count-api"] = "/users/" + user + "#followers";
            break;
          case "watch":
            config.data["count-href"] = "/" + user + "/" + repo + "/watchers";
            config.data["count-api"] = "/repos/" + user + "/" + repo + "#subscribers_count";
            break;
          case "star":
            config.data["count-href"] = "/" + user + "/" + repo + "/stargazers";
            config.data["count-api"] = "/repos/" + user + "/" + repo + "#stargazers_count";
            break;
          case "fork":
            config.data["count-href"] = "/" + user + "/" + repo + "/network";
            config.data["count-api"] = "/repos/" + user + "/" + repo + "#forks_count";
            break;
          case "issue":
            config.data["count-api"] = "/repos/" + user + "/" + repo + "#open_issues_count";
        }
      }
      if ((options["standard-icon"] != null) || config.data.icon === "octicon-mark-github") {
        delete config.data.icon;
      }
      return config;
    };

    return Form;

  })(Element);

  Frame = (function(_super) {
    __extends(Frame, _super);

    function Frame(element) {
      this.element = element;
      this.on("load", (function(_this) {
        return function() {
          var a, _i, _len, _ref;
          _ref = _this.element.contentWindow.document.getElementsByTagName("a");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            a = _ref[_i];
            _this.on.call({
              element: a
            }, "click", function(event) {
              event.preventDefault();
              return false;
            });
          }
          _this.on.call({
            element: _this.element.contentWindow.document.body
          }, "click", function() {
            _this.element.parentNode.click();
          });
        };
      })(this));
    }

    return Frame;

  })(Element);

  PreviewAnchor = (function(_super) {
    __extends(PreviewAnchor, _super);

    function PreviewAnchor(_arg, callback) {
      var data, href, text;
      href = _arg.href, text = _arg.text, data = _arg.data;
      PreviewAnchor.__super__.constructor.call(this, "a", function(a) {
        var name, value;
        a.className = Config.anchorClass;
        a.href = href;
        a.appendChild(document.createTextNode("" + text));
        for (name in data) {
          value = data[name];
          a.setAttribute("data-" + name, value);
        }
        if (callback) {
          callback(a);
        }
      });
    }

    return PreviewAnchor;

  })(Element);

  PreviewFrame = (function(_super) {
    __extends(PreviewFrame, _super);

    function PreviewFrame(element) {
      this.element = element;
      this.on("load", (function(_this) {
        return function() {
          var body, contentDocument, html, key, style, value;
          contentDocument = _this.element.contentWindow.document;
          html = contentDocument.documentElement;
          body = contentDocument.body;
          html.style.overflow = body.style.overflow = "visible";
          style = {
            height: "" + body.scrollHeight + "px",
            width: "" + body.scrollWidth + "px"
          };
          html.style.overflow = body.style.overflow = "";
          for (key in style) {
            value = style[key];
            _this.element.style[key] = value;
          }
        };
      })(this));
    }

    PreviewFrame.prototype.load = function(config) {
      var key, style, value;
      this.element.parentNode.style.height = "" + ((config.data.style === "mega" ? 28 : 20) + 2) + "px";
      style = {
        height: "0",
        width: "1px"
      };
      for (key in style) {
        value = style[key];
        this.element.style[key] = value;
      }
      this.element.src = "buttons.html" + (Hash.encode(config));
      this.element.contentWindow.document.location.reload();
    };

    return PreviewFrame;

  })(Element);

  PreviewButton = (function(_super) {
    __extends(PreviewButton, _super);

    function PreviewButton(element, ui) {
      this.element = element;
      this.ui = ui;
      this.on("click", (function(_this) {
        return function() {
          event.preventDefault();
          _this.preview();
          return false;
        };
      })(this));
    }

    PreviewButton.prototype.preview = function(config, no_count) {
      if (config == null) {
        config = this.ui.form.parse();
      }
      if (no_count == null) {
        no_count = false;
      }
      new PreviewAnchor(config, (function(_this) {
        return function(a) {
          _this.ui.code.element.value = "<!-- Place this tag where you want the button to render. -->\n" + a.outerHTML;
          if (no_count) {
            a.removeAttribute("data-count-api");
          }
          _this.ui.preview_frame.load(Anchor.parse(a));
          a = null;
        };
      })(this));
    };

    return PreviewButton;

  })(Element);

  Code = (function(_super) {
    __extends(Code, _super);

    function Code(element) {
      this.element = element;
      this.on("focus", (function(_this) {
        return function() {
          _this.element.select();
        };
      })(this));
      this.on("click", (function(_this) {
        return function() {
          _this.element.select();
        };
      })(this));
      this.on("mouseup", function() {
        event.preventDefault();
        return false;
      });
    }

    return Code;

  })(Element);

  Snippet = (function(_super) {
    __extends(Snippet, _super);

    function Snippet() {
      Snippet.__super__.constructor.apply(this, arguments);
      this.element.value = "<!-- Place this tag right after the last button or just before your close body tag. -->\n<script async defer id=\"github-bjs\" src=\"https://buttons.github.io/buttons.js\"></script>";
    }

    return Snippet;

  })(Code);

  UI = (function() {
    function UI() {
      var iframe, _i, _len, _ref;
      _ref = document.getElementsByTagName("iframe");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        iframe = _ref[_i];
        if (iframe.parentNode.id === "preview") {
          this.preview_frame = new PreviewFrame(iframe);
        } else {
          new Frame(iframe);
        }
      }
      this.content = new UIElement(document.getElementById("content"));
      this.form = new Form(document.getElementById("button-config"), (function(_this) {
        return function(options) {
          var name, _j, _k, _len1, _len2, _ref1, _ref2;
          if (options.type) {
            _ref1 = ["repo", "standard-icon"];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              name = _ref1[_j];
              _this.form.element.elements[name].disabled = options.type === "follow";
            }
            _ref2 = ["show-count"];
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              name = _ref2[_k];
              _this.form.element.elements[name].disabled = options.type === "download";
            }
            if ((options["show-count"] != null) && options.type !== "download") {
              _this.preview_button.removeClass("hidden");
            } else {
              _this.preview_button.addClass("hidden");
            }
            if (!((!options.user || /^[a-z0-9][a-z0-9-]*$/i.test(options.user)) && (options.type === "follow" || !options.repo || (/^[\w.-]+$/.test(options.repo) && !/^\.\.?$/.test(options.repo))))) {
              _this.user_repo.addClass("has-error");
            } else {
              _this.user_repo.removeClass("has-error");
              if (options.user === "" || (options.type !== "follow" && options.repo === "")) {
                _this.user_repo.addClass("has-warning");
              } else {
                _this.user_repo.removeClass("has-warning");
              }
            }
            if ((_this.user_repo.hasClass("has-error")) || (_this.user_repo.hasClass("has-warning"))) {
              options.user = "ntkme";
              options.repo = "github-buttons";
              _this.preview_button.addClass("hidden");
              _this.preview_button.preview(Form.parse(options));
            } else {
              _this.preview_button.preview(Form.parse(options), true);
            }
            _this.content.removeClass("hidden");
          }
        };
      })(this));
      this.user_repo = new UIElement(document.getElementById("user-repo"));
      this.preview_button = new PreviewButton(document.getElementById("preview-button"), this);
      this.code = new Code(document.getElementById("code"));
      this.snippet = new Snippet(document.getElementById("snippet"));
    }

    return UI;

  })();

  new UI();

  this.onbeforeunload = function() {};

}).call(this);
