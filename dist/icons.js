(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Bacon, propsOrStateProperty;

Bacon = (global || window).Bacon;

if (typeof module !== "undefined" && module !== null) {
  module.exports = Bacon;
}

Bacon.BaconMixin = {
  isEqual: function(a, b) {
    var i, key, keys, len;
    if (a === b) {
      return true;
    }
    if (!((a != null) && (b != null))) {
      return false;
    }
    keys = Object.keys(a);
    if (keys.length !== (Object.keys(b)).length) {
      return false;
    }
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      if (a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  },
  propsProperty: function(propName) {
    return propsOrStateProperty(this, 'allProps', 'props', propName);
  },
  stateProperty: function(stateName) {
    return propsOrStateProperty(this, 'allState', 'state', stateName);
  },
  eventStream: function(eventName) {
    var bacon, bus, buses;
    bacon = this._bacon || (this._bacon = {});
    buses = bacon['buses.events'] = bacon['buses.events'] || {};
    bus = buses[eventName];
    if (!bus) {
      bus = buses[eventName] = new Bacon.Bus;
      this[eventName] = function(event) {
        return bus.push(event);
      };
    }
    return bus;
  },
  plug: function(stream, stateKey) {
    var bacon, unsubscribe, unsubscribers;
    unsubscribe = void 0;
    bacon = this._bacon || (this._bacon = {});
    unsubscribers = bacon.unsubscribers = bacon.unsubscribers || [];
    if (stateKey != null) {
      unsubscribe = stream.onValue((function(_this) {
        return function(partialState) {
          return _this.setState(partialState);
        };
      })(this));
    } else {
      unsubscribe = stream.onValue((function(_this) {
        return function(value) {
          var partialState;
          partialState = {};
          partialState[stateKey] = value;
          return _this.setState(partialState);
        };
      })(this));
    }
    unsubscribers.push(unsubscribe);
    return unsubscribe;
  },
  componentDidUpdate: function() {
    var allPropsBus, allStateBus, bacon;
    bacon = this._bacon;
    if (bacon) {
      allPropsBus = bacon['buses.allProps'];
      allPropsBus && allPropsBus.push(this.props);
      allStateBus = bacon['buses.allState'];
      allStateBus && allStateBus.push(this.state);
    }
  },
  componentWillUnmount: function() {
    var allPropsBus, allStateBus, bacon, eventBuses, eventName, i, len, ref, unsubscribe;
    bacon = this._bacon;
    if (bacon) {
      allPropsBus = bacon['buses.allProps'];
      allPropsBus && allPropsBus.end();
      allStateBus = bacon['buses.allState'];
      allStateBus && allStateBus.end();
      eventBuses = bacon['buses.events'];
      if (eventBuses) {
        for (eventName in eventBuses) {
          eventBuses[eventName].end();
        }
      }
      ref = bacon.unsubscribers || [];
      for (i = 0, len = ref.length; i < len; i++) {
        unsubscribe = ref[i];
        unsubscribe();
      }
    }
  }
};

propsOrStateProperty = function(component, allPropsOrStateKey, groupKey, filterKey) {
  var allPropertyKey, bacon, bus, filteredPropertyKey, groupedPropertiesKey, property, wholePropsOrStateProperty;
  bacon = component._bacon || (component._bacon = {});
  allPropertyKey = 'properties.' + allPropsOrStateKey;
  groupedPropertiesKey = 'properties.' + groupKey;
  property = bacon[allPropertyKey];
  if (!property) {
    bus = bacon['buses.' + allPropsOrStateKey] = new Bacon.Bus;
    property = bacon[allPropertyKey] = bus.toProperty(component[groupKey]).skipDuplicates(this.isEqual);
  }
  if (filterKey == null) {
    wholePropsOrStateProperty = property;
    filteredPropertyKey = groupedPropertiesKey + '.' + filterKey;
    property = bacon[filteredPropertyKey];
    if (!property) {
      property = bacon[filteredPropertyKey] = wholePropsOrStateProperty.filter(function(x) {
        return x;
      }).map(function(propsOrState) {
        return propsOrState[filterKey];
      }).skipDuplicates(this.isEqual).toProperty();
    }
  }
  return property;
};



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
var Aui, React, exports, ref;

ref = global || window, React = ref.React, Aui = ref.Aui;

exports = module.exports = {
  React: React,
  Aui: Aui,
  Bacon: require('./bacon.cjsx')
};



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./bacon.cjsx":1}],3:[function(require,module,exports){
var Aui, Bacon, Page, React, ref;

ref = require('./deps.cjsx'), Aui = ref.Aui, Bacon = ref.Bacon, React = ref.React;

Page = React.createClass({displayName: "Page",
  getInitialState: function() {
    return {
      icon: ''
    };
  },
  onClick: function(event) {
    return event.target.select();
  },
  onChange: function(event) {
    return this.setState({
      icon: event.target.value
    });
  },
  render: function() {
    return React.createElement(Aui, null, React.createElement("div", {
      "ui": true,
      "page": true,
      "grid": true
    }, React.createElement("div", {
      "ui": true,
      "inverted": true,
      "segment": true,
      "column": true
    }, React.createElement("form", {
      "ui": true,
      "form": true,
      "onSubmit": (function(event) {
        return event.preventDefault();
      })
    }, React.createElement("div", {
      "ui": true,
      "two": true,
      "column": true,
      "grid": true
    }, React.createElement("div", {
      "column": true
    }, React.createElement("img", {
      "src": "https://static.f-list.net/images/avatar/" + this.state.icon + ".png?" + (Date.now())
    }), React.createElement("input", {
      "ui": true,
      "input": true,
      "value": "[icon]" + this.state.icon + "[/icon]",
      "onChange": (function() {}),
      "onClick": this.onClick
    })), React.createElement("div", {
      "column": true
    }, React.createElement("img", {
      "src": "https://static.f-list.net/images/eicon/" + this.state.icon + ".gif?" + (Date.now())
    }), React.createElement("input", {
      "ui": true,
      "inverted": true,
      "input": true,
      "value": "[eicon]" + this.state.icon + "[/eicon]",
      "onChange": (function() {}),
      "onClick": this.onClick
    }))), React.createElement("br", null), React.createElement("div", {
      "ui": true,
      "field": true
    }, React.createElement("input", {
      "id": "icon",
      "ui": true,
      "inverted": true,
      "input": true,
      "onKeyUp": this.onChange,
      "onClick": this.onClick,
      "placeholder": "Icon Name..."
    }))))));
  }
});

React.render(React.createElement(Page, null), document.body);


},{"./deps.cjsx":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcbm9kZV9tb2R1bGVzXFxpY29uc1xcc3JjXFxiYWNvbi5janN4IiwiQzpcXG5vZGVfbW9kdWxlc1xcaWNvbnNcXHNyY1xcZGVwcy5janN4IiwiQzpcXG5vZGVfbW9kdWxlc1xcaWNvbnNcXHNyY1xcaWNvbnMuY2pzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxJQUFBOztBQUFDLFFBQVMsQ0FBQSxNQUFBLElBQVUsTUFBVixFQUFUOzs7RUFDRCxNQUFNLENBQUUsT0FBUixHQUFrQjs7O0FBQ2xCLEtBQUssQ0FBQyxVQUFOLEdBQ0U7RUFBQSxPQUFBLEVBQVMsU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNQLFFBQUE7SUFBQSxJQUFjLENBQUEsS0FBSyxDQUFuQjtBQUFBLGFBQU8sS0FBUDs7SUFDQSxJQUFBLENBQUEsQ0FBaUIsV0FBQSxJQUFPLFdBQXhCLENBQUE7QUFBQSxhQUFPLE1BQVA7O0lBQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxJQUFQLENBQVksQ0FBWjtJQUNQLElBQWEsSUFBSSxDQUFDLE1BQUwsS0FBaUIsQ0FBQyxNQUFNLENBQUMsSUFBUCxDQUFZLENBQVosQ0FBRCxDQUFlLENBQUMsTUFBOUM7QUFBQSxhQUFPLE1BQVA7O0FBQ0EsU0FBQSxzQ0FBQTs7VUFBK0IsQ0FBRSxDQUFBLEdBQUEsQ0FBRixLQUFZLENBQUUsQ0FBQSxHQUFBO0FBQTdDLGVBQU87O0FBQVA7V0FDQTtFQU5PLENBQVQ7RUFPQSxhQUFBLEVBQWUsU0FBQyxRQUFEO1dBQ2Isb0JBQUEsQ0FBcUIsSUFBckIsRUFBd0IsVUFBeEIsRUFBb0MsT0FBcEMsRUFBNkMsUUFBN0M7RUFEYSxDQVBmO0VBU0EsYUFBQSxFQUFlLFNBQUMsU0FBRDtXQUNiLG9CQUFBLENBQXFCLElBQXJCLEVBQXdCLFVBQXhCLEVBQW9DLE9BQXBDLEVBQTZDLFNBQTdDO0VBRGEsQ0FUZjtFQVdBLFdBQUEsRUFBYSxTQUFDLFNBQUQ7QUFDWCxRQUFBO0lBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxXQUFELElBQUMsQ0FBQSxTQUFXO0lBQ3BCLEtBQUEsR0FBUSxLQUFNLENBQUEsY0FBQSxDQUFOLEdBQXdCLEtBQU0sQ0FBQSxjQUFBLENBQU4sSUFBeUI7SUFDekQsR0FBQSxHQUFNLEtBQU0sQ0FBQSxTQUFBO0lBQ1osSUFBRyxDQUFDLEdBQUo7TUFDRSxHQUFBLEdBQU0sS0FBTSxDQUFBLFNBQUEsQ0FBTixHQUFtQixJQUFLLEtBQUssQ0FBQztNQUNwQyxJQUFFLENBQUEsU0FBQSxDQUFGLEdBQWUsU0FBQyxLQUFEO2VBQVcsR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFUO01BQVgsRUFGakI7O1dBR0E7RUFQVyxDQVhiO0VBbUJBLElBQUEsRUFBTSxTQUFDLE1BQUQsRUFBUyxRQUFUO0FBQ0osUUFBQTtJQUFBLFdBQUEsR0FBYztJQUNkLEtBQUEsR0FBUSxJQUFDLENBQUEsV0FBRCxJQUFDLENBQUEsU0FBVztJQUNwQixhQUFBLEdBQWdCLEtBQUssQ0FBQyxhQUFOLEdBQXNCLEtBQUssQ0FBQyxhQUFOLElBQXVCO0lBQzdELElBQUcsZ0JBQUg7TUFDRSxXQUFBLEdBQWMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsWUFBRDtpQkFBa0IsS0FBQyxDQUFBLFFBQUQsQ0FBVSxZQUFWO1FBQWxCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmLEVBRGhCO0tBQUEsTUFBQTtNQUdFLFdBQUEsR0FBYyxNQUFNLENBQUMsT0FBUCxDQUFlLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO0FBQzNCLGNBQUE7VUFBQSxZQUFBLEdBQWU7VUFDZixZQUFhLENBQUEsUUFBQSxDQUFiLEdBQXlCO2lCQUN6QixLQUFDLENBQUEsUUFBRCxDQUFVLFlBQVY7UUFIMkI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWYsRUFIaEI7O0lBT0EsYUFBYSxDQUFDLElBQWQsQ0FBbUIsV0FBbkI7V0FDQTtFQVpJLENBbkJOO0VBZ0NBLGtCQUFBLEVBQW9CLFNBQUE7QUFDbEIsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFDLENBQUE7SUFDVCxJQUFHLEtBQUg7TUFDRSxXQUFBLEdBQWMsS0FBTSxDQUFBLGdCQUFBO01BQ3BCLFdBQUEsSUFBZ0IsV0FBVyxDQUFDLElBQVosQ0FBaUIsSUFBQyxDQUFBLEtBQWxCO01BQ2hCLFdBQUEsR0FBYyxLQUFNLENBQUEsZ0JBQUE7TUFDcEIsV0FBQSxJQUFnQixXQUFXLENBQUMsSUFBWixDQUFpQixJQUFDLENBQUEsS0FBbEIsRUFKbEI7O0VBRmtCLENBaENwQjtFQXdDQSxvQkFBQSxFQUFzQixTQUFBO0FBQ3BCLFFBQUE7SUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBO0lBQ1QsSUFBRyxLQUFIO01BQ0UsV0FBQSxHQUFjLEtBQU0sQ0FBQSxnQkFBQTtNQUNwQixXQUFBLElBQWdCLFdBQVcsQ0FBQyxHQUFaLENBQUE7TUFDaEIsV0FBQSxHQUFjLEtBQU0sQ0FBQSxnQkFBQTtNQUNwQixXQUFBLElBQWdCLFdBQVcsQ0FBQyxHQUFaLENBQUE7TUFDaEIsVUFBQSxHQUFhLEtBQU0sQ0FBQSxjQUFBO01BQ25CLElBQUcsVUFBSDtBQUNFLGFBQUEsdUJBQUE7VUFDRSxVQUFXLENBQUEsU0FBQSxDQUFVLENBQUMsR0FBdEIsQ0FBQTtBQURGLFNBREY7O0FBR0E7QUFBQSxXQUFBLHFDQUFBOztRQUFBLFdBQUEsQ0FBQTtBQUFBLE9BVEY7O0VBRm9CLENBeEN0Qjs7O0FBc0RGLG9CQUFBLEdBQXVCLFNBQUMsU0FBRCxFQUFZLGtCQUFaLEVBQWdDLFFBQWhDLEVBQTBDLFNBQTFDO0FBQ3JCLE1BQUE7RUFBQSxLQUFBLEdBQVEsU0FBUyxDQUFDLFdBQVYsU0FBUyxDQUFDLFNBQVc7RUFDN0IsY0FBQSxHQUFpQixhQUFBLEdBQWdCO0VBQ2pDLG9CQUFBLEdBQXVCLGFBQUEsR0FBZ0I7RUFDdkMsUUFBQSxHQUFXLEtBQU0sQ0FBQSxjQUFBO0VBQ2pCLElBQUcsQ0FBQyxRQUFKO0lBQ0UsR0FBQSxHQUFNLEtBQU0sQ0FBQSxRQUFBLEdBQVcsa0JBQVgsQ0FBTixHQUF1QyxJQUFJLEtBQUssQ0FBQztJQUN2RCxRQUFBLEdBQVcsS0FBTSxDQUFBLGNBQUEsQ0FBTixHQUF3QixHQUNqQyxDQUFDLFVBRGdDLENBQ3JCLFNBQVUsQ0FBQSxRQUFBLENBRFcsQ0FFakMsQ0FBQyxjQUZnQyxDQUVqQixJQUFDLENBQUEsT0FGZ0IsRUFGckM7O0VBS0EsSUFBTyxpQkFBUDtJQUNFLHlCQUFBLEdBQTRCO0lBQzVCLG1CQUFBLEdBQXNCLG9CQUFBLEdBQXVCLEdBQXZCLEdBQTZCO0lBQ25ELFFBQUEsR0FBVyxLQUFNLENBQUEsbUJBQUE7SUFDakIsSUFBRyxDQUFDLFFBQUo7TUFDRSxRQUFBLEdBQVcsS0FBTSxDQUFBLG1CQUFBLENBQU4sR0FBNkIseUJBQ3RDLENBQUMsTUFEcUMsQ0FDOUIsU0FBQyxDQUFEO2VBQU87TUFBUCxDQUQ4QixDQUV0QyxDQUFDLEdBRnFDLENBRWpDLFNBQUMsWUFBRDtlQUFrQixZQUFhLENBQUEsU0FBQTtNQUEvQixDQUZpQyxDQUd0QyxDQUFDLGNBSHFDLENBR3RCLElBQUMsQ0FBQSxPQUhxQixDQUl0QyxDQUFDLFVBSnFDLENBQUEsRUFEMUM7S0FKRjs7U0FVQTtBQXBCcUI7Ozs7Ozs7O0FDdkR2QixJQUFBOztBQUFBLE1BQWUsTUFBQSxJQUFVLE1BQXpCLEVBQUMsWUFBQSxLQUFELEVBQVEsVUFBQTs7QUFDUixPQUFBLEdBQVUsTUFBTSxDQUFDLE9BQVAsR0FBaUI7RUFDekIsT0FBQSxLQUR5QjtFQUV6QixLQUFBLEdBRnlCO0VBR3pCLEtBQUEsRUFBTyxPQUFBLENBQVEsY0FBUixDQUhrQjs7Ozs7Ozs7QUNIM0IsSUFBQTs7QUFBQSxNQUFzQixPQUFBLENBQVEsYUFBUixDQUF0QixFQUFDLFVBQUEsR0FBRCxFQUFNLFlBQUEsS0FBTixFQUFhLFlBQUE7O0FBRWIsSUFBQSxHQUFPLEtBQUssQ0FBQyxXQUFOLENBQ0w7RUFBQSxlQUFBLEVBQWlCLFNBQUE7V0FBRztNQUFBLElBQUEsRUFBTSxFQUFOOztFQUFILENBQWpCO0VBQ0EsT0FBQSxFQUFTLFNBQUMsS0FBRDtXQUNQLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBYixDQUFBO0VBRE8sQ0FEVDtFQUdBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7V0FDUixJQUFDLENBQUEsUUFBRCxDQUFVO01BQUEsSUFBQSxFQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBbkI7S0FBVjtFQURRLENBSFY7RUFLQSxNQUFBLEVBQVEsU0FBQTtXQUNOLEtBQUssQ0FBQyxhQUFOLENBQW9CLEdBQXBCLEVBQXlCLElBQXpCLEVBQ0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7TUFBQyxJQUFBLEVBQU0sSUFBUDtNQUFhLE1BQUEsRUFBUSxJQUFyQjtNQUEyQixNQUFBLEVBQVEsSUFBbkM7S0FBM0IsRUFDRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFwQixFQUEyQjtNQUFDLElBQUEsRUFBTSxJQUFQO01BQWEsVUFBQSxFQUFZLElBQXpCO01BQStCLFNBQUEsRUFBVyxJQUExQztNQUFnRCxRQUFBLEVBQVUsSUFBMUQ7S0FBM0IsRUFDRSxLQUFLLENBQUMsYUFBTixDQUFvQixNQUFwQixFQUE0QjtNQUFDLElBQUEsRUFBTSxJQUFQO01BQWEsTUFBQSxFQUFRLElBQXJCO01BQTJCLFVBQUEsRUFBWSxDQUFDLFNBQUMsS0FBRDtlQUFXLEtBQUssQ0FBQyxjQUFOLENBQUE7TUFBWCxDQUFELENBQXZDO0tBQTVCLEVBQ0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7TUFBQyxJQUFBLEVBQU0sSUFBUDtNQUFhLEtBQUEsRUFBTyxJQUFwQjtNQUEwQixRQUFBLEVBQVUsSUFBcEM7TUFBMEMsTUFBQSxFQUFRLElBQWxEO0tBQTNCLEVBQ0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7TUFBQyxRQUFBLEVBQVUsSUFBWDtLQUEzQixFQUNFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCLEVBQTJCO01BQUMsS0FBQSxFQUFRLDBDQUFBLEdBQTJDLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBbEQsR0FBdUQsT0FBdkQsR0FBNkQsQ0FBQyxJQUFJLENBQUMsR0FBTCxDQUFBLENBQUQsQ0FBdEU7S0FBM0IsQ0FERixFQUVFLEtBQUssQ0FBQyxhQUFOLENBQW9CLE9BQXBCLEVBQTZCO01BQUMsSUFBQSxFQUFNLElBQVA7TUFBYSxPQUFBLEVBQVMsSUFBdEI7TUFBNEIsT0FBQSxFQUFVLFFBQUEsR0FBUyxJQUFDLENBQUEsS0FBSyxDQUFDLElBQWhCLEdBQXFCLFNBQTNEO01BQXNFLFVBQUEsRUFBWSxDQUFDLFNBQUEsR0FBQSxDQUFELENBQWxGO01BQXdGLFNBQUEsRUFBWSxJQUFDLENBQUEsT0FBckc7S0FBN0IsQ0FGRixDQURGLEVBS0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7TUFBQyxRQUFBLEVBQVUsSUFBWDtLQUEzQixFQUNFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCLEVBQTJCO01BQUMsS0FBQSxFQUFRLHlDQUFBLEdBQTBDLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBakQsR0FBc0QsT0FBdEQsR0FBNEQsQ0FBQyxJQUFJLENBQUMsR0FBTCxDQUFBLENBQUQsQ0FBckU7S0FBM0IsQ0FERixFQUVFLEtBQUssQ0FBQyxhQUFOLENBQW9CLE9BQXBCLEVBQTZCO01BQUMsSUFBQSxFQUFNLElBQVA7TUFBYSxVQUFBLEVBQVksSUFBekI7TUFBK0IsT0FBQSxFQUFTLElBQXhDO01BQThDLE9BQUEsRUFBVSxTQUFBLEdBQVUsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFqQixHQUFzQixVQUE5RTtNQUEwRixVQUFBLEVBQVksQ0FBQyxTQUFBLEdBQUEsQ0FBRCxDQUF0RztNQUE0RyxTQUFBLEVBQVksSUFBQyxDQUFBLE9BQXpIO0tBQTdCLENBRkYsQ0FMRixDQURGLEVBV0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsQ0FYRixFQVlFLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCLEVBQTJCO01BQUMsSUFBQSxFQUFNLElBQVA7TUFBYSxPQUFBLEVBQVMsSUFBdEI7S0FBM0IsRUFDRSxLQUFLLENBQUMsYUFBTixDQUFvQixPQUFwQixFQUE2QjtNQUFDLElBQUEsRUFBTSxNQUFQO01BQWUsSUFBQSxFQUFNLElBQXJCO01BQTJCLFVBQUEsRUFBWSxJQUF2QztNQUE2QyxPQUFBLEVBQVMsSUFBdEQ7TUFBNEQsU0FBQSxFQUFZLElBQUMsQ0FBQSxRQUF6RTtNQUFvRixTQUFBLEVBQVksSUFBQyxDQUFBLE9BQWpHO01BQTJHLGFBQUEsRUFBZSxjQUExSDtLQUE3QixDQURGLENBWkYsQ0FERixDQURGLENBREY7RUFETSxDQUxSO0NBREs7O0FBOEJQLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsQ0FBYixFQUE4QyxRQUFRLENBQUMsSUFBdkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwie0JhY29ufSA9IGdsb2JhbCBvciB3aW5kb3dcbm1vZHVsZT8uZXhwb3J0cyA9IEJhY29uXG5CYWNvbi5CYWNvbk1peGluID1cbiAgaXNFcXVhbDogKGEsIGIpIC0+XG4gICAgcmV0dXJuIHllcyBpZiBhIGlzIGJcbiAgICByZXR1cm4gbm8gdW5sZXNzIGE/IGFuZCBiP1xuICAgIGtleXMgPSBPYmplY3Qua2V5cyBhXG4gICAgcmV0dXJuIG5vIGlmIGtleXMubGVuZ3RoIGlzbnQgKE9iamVjdC5rZXlzIGIpLmxlbmd0aFxuICAgIHJldHVybiBubyBmb3Iga2V5IGluIGtleXMgd2hlbiBhW2tleV0gaXNudCBiW2tleV1cbiAgICB5ZXNcbiAgcHJvcHNQcm9wZXJ0eTogKHByb3BOYW1lKSAtPlxuICAgIHByb3BzT3JTdGF0ZVByb3BlcnR5IEAsICdhbGxQcm9wcycsICdwcm9wcycsIHByb3BOYW1lXG4gIHN0YXRlUHJvcGVydHk6IChzdGF0ZU5hbWUpIC0+XG4gICAgcHJvcHNPclN0YXRlUHJvcGVydHkgQCwgJ2FsbFN0YXRlJywgJ3N0YXRlJywgc3RhdGVOYW1lXG4gIGV2ZW50U3RyZWFtOiAoZXZlbnROYW1lKSAtPlxuICAgIGJhY29uID0gQF9iYWNvbiBvcj0ge31cbiAgICBidXNlcyA9IGJhY29uWydidXNlcy5ldmVudHMnXSA9IGJhY29uWydidXNlcy5ldmVudHMnXSBvciB7fVxuICAgIGJ1cyA9IGJ1c2VzW2V2ZW50TmFtZV1cbiAgICBpZiAhYnVzXG4gICAgICBidXMgPSBidXNlc1tldmVudE5hbWVdID0gbmV3IChCYWNvbi5CdXMpXG4gICAgICBAW2V2ZW50TmFtZV0gPSAoZXZlbnQpIC0+IGJ1cy5wdXNoIGV2ZW50XG4gICAgYnVzXG4gIHBsdWc6IChzdHJlYW0sIHN0YXRlS2V5KSAtPlxuICAgIHVuc3Vic2NyaWJlID0gdW5kZWZpbmVkXG4gICAgYmFjb24gPSBAX2JhY29uIG9yPSB7fVxuICAgIHVuc3Vic2NyaWJlcnMgPSBiYWNvbi51bnN1YnNjcmliZXJzID0gYmFjb24udW5zdWJzY3JpYmVycyBvciBbXVxuICAgIGlmIHN0YXRlS2V5P1xuICAgICAgdW5zdWJzY3JpYmUgPSBzdHJlYW0ub25WYWx1ZSAocGFydGlhbFN0YXRlKSA9PiBAc2V0U3RhdGUgcGFydGlhbFN0YXRlXG4gICAgZWxzZVxuICAgICAgdW5zdWJzY3JpYmUgPSBzdHJlYW0ub25WYWx1ZSAodmFsdWUpID0+XG4gICAgICAgIHBhcnRpYWxTdGF0ZSA9IHt9XG4gICAgICAgIHBhcnRpYWxTdGF0ZVtzdGF0ZUtleV0gPSB2YWx1ZVxuICAgICAgICBAc2V0U3RhdGUgcGFydGlhbFN0YXRlXG4gICAgdW5zdWJzY3JpYmVycy5wdXNoIHVuc3Vic2NyaWJlXG4gICAgdW5zdWJzY3JpYmVcbiAgY29tcG9uZW50RGlkVXBkYXRlOiAtPlxuICAgIGJhY29uID0gQF9iYWNvblxuICAgIGlmIGJhY29uXG4gICAgICBhbGxQcm9wc0J1cyA9IGJhY29uWydidXNlcy5hbGxQcm9wcyddXG4gICAgICBhbGxQcm9wc0J1cyBhbmQgYWxsUHJvcHNCdXMucHVzaCBAcHJvcHNcbiAgICAgIGFsbFN0YXRlQnVzID0gYmFjb25bJ2J1c2VzLmFsbFN0YXRlJ11cbiAgICAgIGFsbFN0YXRlQnVzIGFuZCBhbGxTdGF0ZUJ1cy5wdXNoIEBzdGF0ZVxuICAgIHJldHVyblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogLT5cbiAgICBiYWNvbiA9IEBfYmFjb25cbiAgICBpZiBiYWNvblxuICAgICAgYWxsUHJvcHNCdXMgPSBiYWNvblsnYnVzZXMuYWxsUHJvcHMnXVxuICAgICAgYWxsUHJvcHNCdXMgYW5kIGFsbFByb3BzQnVzLmVuZCgpXG4gICAgICBhbGxTdGF0ZUJ1cyA9IGJhY29uWydidXNlcy5hbGxTdGF0ZSddXG4gICAgICBhbGxTdGF0ZUJ1cyBhbmQgYWxsU3RhdGVCdXMuZW5kKClcbiAgICAgIGV2ZW50QnVzZXMgPSBiYWNvblsnYnVzZXMuZXZlbnRzJ11cbiAgICAgIGlmIGV2ZW50QnVzZXNcbiAgICAgICAgZm9yIGV2ZW50TmFtZSBvZiBldmVudEJ1c2VzXG4gICAgICAgICAgZXZlbnRCdXNlc1tldmVudE5hbWVdLmVuZCgpXG4gICAgICB1bnN1YnNjcmliZSgpIGZvciB1bnN1YnNjcmliZSBpbiBiYWNvbi51bnN1YnNjcmliZXJzIG9yIFtdXG4gICAgICByZXR1cm5cblxucHJvcHNPclN0YXRlUHJvcGVydHkgPSAoY29tcG9uZW50LCBhbGxQcm9wc09yU3RhdGVLZXksIGdyb3VwS2V5LCBmaWx0ZXJLZXkpIC0+XG4gIGJhY29uID0gY29tcG9uZW50Ll9iYWNvbiBvcj0ge31cbiAgYWxsUHJvcGVydHlLZXkgPSAncHJvcGVydGllcy4nICsgYWxsUHJvcHNPclN0YXRlS2V5XG4gIGdyb3VwZWRQcm9wZXJ0aWVzS2V5ID0gJ3Byb3BlcnRpZXMuJyArIGdyb3VwS2V5XG4gIHByb3BlcnR5ID0gYmFjb25bYWxsUHJvcGVydHlLZXldXG4gIGlmICFwcm9wZXJ0eVxuICAgIGJ1cyA9IGJhY29uWydidXNlcy4nICsgYWxsUHJvcHNPclN0YXRlS2V5XSA9IG5ldyBCYWNvbi5CdXNcbiAgICBwcm9wZXJ0eSA9IGJhY29uW2FsbFByb3BlcnR5S2V5XSA9IGJ1c1xuICAgICAgLnRvUHJvcGVydHkgY29tcG9uZW50W2dyb3VwS2V5XVxuICAgICAgLnNraXBEdXBsaWNhdGVzIEBpc0VxdWFsXG4gIHVubGVzcyBmaWx0ZXJLZXk/XG4gICAgd2hvbGVQcm9wc09yU3RhdGVQcm9wZXJ0eSA9IHByb3BlcnR5XG4gICAgZmlsdGVyZWRQcm9wZXJ0eUtleSA9IGdyb3VwZWRQcm9wZXJ0aWVzS2V5ICsgJy4nICsgZmlsdGVyS2V5XG4gICAgcHJvcGVydHkgPSBiYWNvbltmaWx0ZXJlZFByb3BlcnR5S2V5XVxuICAgIGlmICFwcm9wZXJ0eVxuICAgICAgcHJvcGVydHkgPSBiYWNvbltmaWx0ZXJlZFByb3BlcnR5S2V5XSA9IHdob2xlUHJvcHNPclN0YXRlUHJvcGVydHlcbiAgICAgICAgLmZpbHRlciAoeCkgLT4geFxuICAgICAgICAubWFwIChwcm9wc09yU3RhdGUpIC0+IHByb3BzT3JTdGF0ZVtmaWx0ZXJLZXldXG4gICAgICAgIC5za2lwRHVwbGljYXRlcyBAaXNFcXVhbFxuICAgICAgICAudG9Qcm9wZXJ0eSgpXG4gIHByb3BlcnR5XG4iLCJcbiMgbnBtIGluc3RhbGwgYXVpQGxhdGVzdCByZWFjdC1iYWNvbkBsYXRlc3RcbntSZWFjdCwgQXVpfSA9IGdsb2JhbCBvciB3aW5kb3dcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgUmVhY3RcbiAgQXVpXG4gIEJhY29uOiByZXF1aXJlICcuL2JhY29uLmNqc3gnXG59XG4iLCJ7QXVpLCBCYWNvbiwgUmVhY3R9ID0gcmVxdWlyZSAnLi9kZXBzLmNqc3gnXG5cblBhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICBnZXRJbml0aWFsU3RhdGU6IC0+IGljb246ICcnXG4gIG9uQ2xpY2s6IChldmVudCkgLT5cbiAgICBldmVudC50YXJnZXQuc2VsZWN0KClcbiAgb25DaGFuZ2U6IChldmVudCkgLT5cbiAgICBAc2V0U3RhdGUgaWNvbjogZXZlbnQudGFyZ2V0LnZhbHVlXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEF1aSwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1widWlcIjogdHJ1ZSwgXCJwYWdlXCI6IHRydWUsIFwiZ3JpZFwiOiB0cnVlfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJ1aVwiOiB0cnVlLCBcImludmVydGVkXCI6IHRydWUsIFwic2VnbWVudFwiOiB0cnVlLCBcImNvbHVtblwiOiB0cnVlfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiLCB7XCJ1aVwiOiB0cnVlLCBcImZvcm1cIjogdHJ1ZSwgXCJvblN1Ym1pdFwiOiAoKGV2ZW50KSAtPiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKX0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcInVpXCI6IHRydWUsIFwidHdvXCI6IHRydWUsIFwiY29sdW1uXCI6IHRydWUsIFwiZ3JpZFwiOiB0cnVlfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjb2x1bW5cIjogdHJ1ZX0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7XCJzcmNcIjogKFwiaHR0cHM6Ly9zdGF0aWMuZi1saXN0Lm5ldC9pbWFnZXMvYXZhdGFyLyN7QHN0YXRlLmljb259LnBuZz8je0RhdGUubm93KCl9XCIpfSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcInVpXCI6IHRydWUsIFwiaW5wdXRcIjogdHJ1ZSwgXCJ2YWx1ZVwiOiAoXCJbaWNvbl0je0BzdGF0ZS5pY29ufVsvaWNvbl1cIiksIFwib25DaGFuZ2VcIjogKC0+KSwgXCJvbkNsaWNrXCI6IChAb25DbGljayl9KVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNvbHVtblwiOiB0cnVlfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtcInNyY1wiOiAoXCJodHRwczovL3N0YXRpYy5mLWxpc3QubmV0L2ltYWdlcy9laWNvbi8je0BzdGF0ZS5pY29ufS5naWY/I3tEYXRlLm5vdygpfVwiKX0pLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XCJ1aVwiOiB0cnVlLCBcImludmVydGVkXCI6IHRydWUsIFwiaW5wdXRcIjogdHJ1ZSwgXCJ2YWx1ZVwiOiAoXCJbZWljb25dI3tAc3RhdGUuaWNvbn1bL2VpY29uXVwiKSwgXCJvbkNoYW5nZVwiOiAoLT4pLCBcIm9uQ2xpY2tcIjogKEBvbkNsaWNrKX0pXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcInVpXCI6IHRydWUsIFwiZmllbGRcIjogdHJ1ZX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XCJpZFwiOiBcImljb25cIiwgXCJ1aVwiOiB0cnVlLCBcImludmVydGVkXCI6IHRydWUsIFwiaW5wdXRcIjogdHJ1ZSwgXCJvbktleVVwXCI6IChAb25DaGFuZ2UpLCBcIm9uQ2xpY2tcIjogKEBvbkNsaWNrKSwgXCJwbGFjZWhvbGRlclwiOiBcIkljb24gTmFtZS4uLlwifSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cblJlYWN0LnJlbmRlciBSZWFjdC5jcmVhdGVFbGVtZW50KFBhZ2UsIG51bGwpLCBkb2N1bWVudC5ib2R5XG4iXX0=
