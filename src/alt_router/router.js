'use strict';"use strict";
var core_1 = require('angular2/core');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var async_1 = require('angular2/src/facade/async');
var collection_2 = require('angular2/src/facade/collection');
var exceptions_1 = require('angular2/src/facade/exceptions');
var recognize_1 = require('./recognize');
var link_1 = require('./link');
var segments_1 = require('./segments');
var lifecycle_reflector_1 = require('./lifecycle_reflector');
var constants_1 = require('./constants');
var RouterOutletMap = (function () {
    function RouterOutletMap() {
        /** @internal */
        this._outlets = {};
    }
    RouterOutletMap.prototype.registerOutlet = function (name, outlet) { this._outlets[name] = outlet; };
    return RouterOutletMap;
}());
exports.RouterOutletMap = RouterOutletMap;
var Router = (function () {
    function Router(_rootComponent, _rootComponentType, _componentResolver, _urlSerializer, _routerOutletMap, _location) {
        this._rootComponent = _rootComponent;
        this._rootComponentType = _rootComponentType;
        this._componentResolver = _componentResolver;
        this._urlSerializer = _urlSerializer;
        this._routerOutletMap = _routerOutletMap;
        this._location = _location;
        this._changes = new async_1.EventEmitter();
        this._setUpLocationChangeListener();
        this.navigateByUrl(this._location.path());
    }
    Object.defineProperty(Router.prototype, "urlTree", {
        get: function () { return this._urlTree; },
        enumerable: true,
        configurable: true
    });
    Router.prototype.navigateByUrl = function (url) {
        return this._navigate(this._urlSerializer.parse(url));
    };
    Router.prototype.navigate = function (changes, segment) {
        return this._navigate(this.createUrlTree(changes, segment));
    };
    Router.prototype.dispose = function () { async_1.ObservableWrapper.dispose(this._locationSubscription); };
    Router.prototype._setUpLocationChangeListener = function () {
        var _this = this;
        this._locationSubscription = this._location.subscribe(function (change) { _this._navigate(_this._urlSerializer.parse(change['url'])); });
    };
    Router.prototype._navigate = function (url) {
        var _this = this;
        this._urlTree = url;
        return recognize_1.recognize(this._componentResolver, this._rootComponentType, url)
            .then(function (currTree) {
            return new _LoadSegments(currTree, _this._prevTree)
                .load(_this._routerOutletMap, _this._rootComponent)
                .then(function (updated) {
                if (updated) {
                    _this._prevTree = currTree;
                    _this._location.go(_this._urlSerializer.serialize(_this._urlTree));
                    _this._changes.emit(null);
                }
            });
        });
    };
    Router.prototype.createUrlTree = function (changes, segment) {
        if (lang_1.isPresent(this._prevTree)) {
            var s = lang_1.isPresent(segment) ? segment : this._prevTree.root;
            return link_1.link(s, this._prevTree, this.urlTree, changes);
        }
        else {
            return null;
        }
    };
    Router.prototype.serializeUrl = function (url) { return this._urlSerializer.serialize(url); };
    Object.defineProperty(Router.prototype, "changes", {
        get: function () { return this._changes; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "routeTree", {
        get: function () { return this._prevTree; },
        enumerable: true,
        configurable: true
    });
    return Router;
}());
exports.Router = Router;
var _LoadSegments = (function () {
    function _LoadSegments(currTree, prevTree) {
        this.currTree = currTree;
        this.prevTree = prevTree;
        this.deactivations = [];
        this.performMutation = true;
    }
    _LoadSegments.prototype.load = function (parentOutletMap, rootComponent) {
        var _this = this;
        var prevRoot = lang_1.isPresent(this.prevTree) ? segments_1.rootNode(this.prevTree) : null;
        var currRoot = segments_1.rootNode(this.currTree);
        return this.canDeactivate(currRoot, prevRoot, parentOutletMap, rootComponent)
            .then(function (res) {
            _this.performMutation = true;
            if (res) {
                _this.loadChildSegments(currRoot, prevRoot, parentOutletMap, [rootComponent]);
            }
            return res;
        });
    };
    _LoadSegments.prototype.canDeactivate = function (currRoot, prevRoot, outletMap, rootComponent) {
        var _this = this;
        this.performMutation = false;
        this.loadChildSegments(currRoot, prevRoot, outletMap, [rootComponent]);
        var allPaths = async_1.PromiseWrapper.all(this.deactivations.map(function (r) { return _this.checkCanDeactivatePath(r); }));
        return allPaths.then(function (values) { return values.filter(function (v) { return v; }).length === values.length; });
    };
    _LoadSegments.prototype.checkCanDeactivatePath = function (path) {
        var _this = this;
        var curr = async_1.PromiseWrapper.resolve(true);
        var _loop_1 = function(p) {
            curr = curr.then(function (_) {
                if (lifecycle_reflector_1.hasLifecycleHook("routerCanDeactivate", p)) {
                    return p.routerCanDeactivate(_this.prevTree, _this.currTree);
                }
                else {
                    return _;
                }
            });
        };
        for (var _i = 0, _a = collection_1.ListWrapper.reversed(path); _i < _a.length; _i++) {
            var p = _a[_i];
            _loop_1(p);
        }
        return curr;
    };
    _LoadSegments.prototype.loadChildSegments = function (currNode, prevNode, outletMap, components) {
        var _this = this;
        var prevChildren = lang_1.isPresent(prevNode) ?
            prevNode.children.reduce(function (m, c) {
                m[c.value.outlet] = c;
                return m;
            }, {}) :
            {};
        currNode.children.forEach(function (c) {
            _this.loadSegments(c, prevChildren[c.value.outlet], outletMap, components);
            collection_2.StringMapWrapper.delete(prevChildren, c.value.outlet);
        });
        collection_2.StringMapWrapper.forEach(prevChildren, function (v, k) { return _this.unloadOutlet(outletMap._outlets[k], components); });
    };
    _LoadSegments.prototype.loadSegments = function (currNode, prevNode, parentOutletMap, components) {
        var curr = currNode.value;
        var prev = lang_1.isPresent(prevNode) ? prevNode.value : null;
        var outlet = this.getOutlet(parentOutletMap, currNode.value);
        if (segments_1.equalSegments(curr, prev)) {
            this.loadChildSegments(currNode, prevNode, outlet.outletMap, components.concat([outlet.loadedComponent]));
        }
        else {
            this.unloadOutlet(outlet, components);
            if (this.performMutation) {
                var outletMap = new RouterOutletMap();
                var loadedComponent = this.loadNewSegment(outletMap, curr, prev, outlet);
                this.loadChildSegments(currNode, prevNode, outletMap, components.concat([loadedComponent]));
            }
        }
    };
    _LoadSegments.prototype.loadNewSegment = function (outletMap, curr, prev, outlet) {
        var resolved = core_1.ReflectiveInjector.resolve([core_1.provide(RouterOutletMap, { useValue: outletMap }), core_1.provide(segments_1.RouteSegment, { useValue: curr })]);
        var ref = outlet.load(segments_1.routeSegmentComponentFactory(curr), resolved, outletMap);
        if (lifecycle_reflector_1.hasLifecycleHook("routerOnActivate", ref.instance)) {
            ref.instance.routerOnActivate(curr, prev, this.currTree, this.prevTree);
        }
        return ref.instance;
    };
    _LoadSegments.prototype.getOutlet = function (outletMap, segment) {
        var outlet = outletMap._outlets[segment.outlet];
        if (lang_1.isBlank(outlet)) {
            if (segment.outlet == constants_1.DEFAULT_OUTLET_NAME) {
                throw new exceptions_1.BaseException("Cannot find default outlet");
            }
            else {
                throw new exceptions_1.BaseException("Cannot find the outlet " + segment.outlet);
            }
        }
        return outlet;
    };
    _LoadSegments.prototype.unloadOutlet = function (outlet, components) {
        var _this = this;
        if (lang_1.isPresent(outlet) && outlet.isLoaded) {
            collection_2.StringMapWrapper.forEach(outlet.outletMap._outlets, function (v, k) { return _this.unloadOutlet(v, components); });
            if (this.performMutation) {
                outlet.unload();
            }
            else {
                this.deactivations.push(components.concat([outlet.loadedComponent]));
            }
        }
    };
    return _LoadSegments;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1yYVNvSjVYeC50bXAvYW5ndWxhcjIvc3JjL2FsdF9yb3V0ZXIvcm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBcUUsZUFBZSxDQUFDLENBQUE7QUFFckYscUJBQXVDLDBCQUEwQixDQUFDLENBQUE7QUFDbEUsMkJBQTBCLGdDQUFnQyxDQUFDLENBQUE7QUFDM0Qsc0JBS08sMkJBQTJCLENBQUMsQ0FBQTtBQUNuQywyQkFBK0IsZ0NBQWdDLENBQUMsQ0FBQTtBQUNoRSwyQkFBNEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUc3RCwwQkFBd0IsYUFBYSxDQUFDLENBQUE7QUFFdEMscUJBQW1CLFFBQVEsQ0FBQyxDQUFBO0FBRTVCLHlCQVNPLFlBQVksQ0FBQyxDQUFBO0FBQ3BCLG9DQUErQix1QkFBdUIsQ0FBQyxDQUFBO0FBQ3ZELDBCQUFrQyxhQUFhLENBQUMsQ0FBQTtBQUVoRDtJQUFBO1FBQ0UsZ0JBQWdCO1FBQ2hCLGFBQVEsR0FBbUMsRUFBRSxDQUFDO0lBRWhELENBQUM7SUFEQyx3Q0FBYyxHQUFkLFVBQWUsSUFBWSxFQUFFLE1BQW9CLElBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVGLHNCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSx1QkFBZSxrQkFJM0IsQ0FBQTtBQUVEO0lBTUUsZ0JBQW9CLGNBQXNCLEVBQVUsa0JBQXdCLEVBQ3hELGtCQUFxQyxFQUNyQyxjQUFtQyxFQUNuQyxnQkFBaUMsRUFBVSxTQUFtQjtRQUg5RCxtQkFBYyxHQUFkLGNBQWMsQ0FBUTtRQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBTTtRQUN4RCx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3JDLG1CQUFjLEdBQWQsY0FBYyxDQUFxQjtRQUNuQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWlCO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUwxRSxhQUFRLEdBQXVCLElBQUksb0JBQVksRUFBUSxDQUFDO1FBTTlELElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxzQkFBSSwyQkFBTzthQUFYLGNBQWtDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFekQsOEJBQWEsR0FBYixVQUFjLEdBQVc7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQseUJBQVEsR0FBUixVQUFTLE9BQWMsRUFBRSxPQUFzQjtRQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCx3QkFBTyxHQUFQLGNBQWtCLHlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEUsNkNBQTRCLEdBQXBDO1FBQUEsaUJBR0M7UUFGQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQ2pELFVBQUMsTUFBTSxJQUFPLEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFTywwQkFBUyxHQUFqQixVQUFrQixHQUFxQjtRQUF2QyxpQkFjQztRQWJDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxxQkFBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDO2FBQ2xFLElBQUksQ0FBQyxVQUFBLFFBQVE7WUFDWixNQUFNLENBQUMsSUFBSSxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUksQ0FBQyxTQUFTLENBQUM7aUJBQzdDLElBQUksQ0FBQyxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsS0FBSSxDQUFDLGNBQWMsQ0FBQztpQkFDaEQsSUFBSSxDQUFDLFVBQUEsT0FBTztnQkFDWCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNaLEtBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO29CQUMxQixLQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDaEUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNCLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVELDhCQUFhLEdBQWIsVUFBYyxPQUFjLEVBQUUsT0FBc0I7UUFDbEQsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxHQUFHLGdCQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQzNELE1BQU0sQ0FBQyxXQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFFRCw2QkFBWSxHQUFaLFVBQWEsR0FBcUIsSUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTFGLHNCQUFJLDJCQUFPO2FBQVgsY0FBa0MsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUV6RCxzQkFBSSw2QkFBUzthQUFiLGNBQXNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDaEUsYUFBQztBQUFELENBQUMsQUE3REQsSUE2REM7QUE3RFksY0FBTSxTQTZEbEIsQ0FBQTtBQUdEO0lBSUUsdUJBQW9CLFFBQTRCLEVBQVUsUUFBNEI7UUFBbEUsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUg5RSxrQkFBYSxHQUFlLEVBQUUsQ0FBQztRQUMvQixvQkFBZSxHQUFZLElBQUksQ0FBQztJQUVpRCxDQUFDO0lBRTFGLDRCQUFJLEdBQUosVUFBSyxlQUFnQyxFQUFFLGFBQXFCO1FBQTVELGlCQVlDO1FBWEMsSUFBSSxRQUFRLEdBQUcsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsbUJBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3pFLElBQUksUUFBUSxHQUFHLG1CQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLGFBQWEsQ0FBQzthQUN4RSxJQUFJLENBQUMsVUFBQSxHQUFHO1lBQ1AsS0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixLQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQy9FLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBRU8scUNBQWEsR0FBckIsVUFBc0IsUUFBZ0MsRUFBRSxRQUFnQyxFQUNsRSxTQUEwQixFQUFFLGFBQXFCO1FBRHZFLGlCQU9DO1FBTEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDN0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUV2RSxJQUFJLFFBQVEsR0FBRyxzQkFBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDLENBQUM7UUFDL0YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFpQixJQUFLLE9BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLE1BQU0sRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO0lBQzlGLENBQUM7SUFFTyw4Q0FBc0IsR0FBOUIsVUFBK0IsSUFBYztRQUE3QyxpQkFZQztRQVhDLElBQUksSUFBSSxHQUFHLHNCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDO1lBQ0UsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDO2dCQUNoQixFQUFFLENBQUMsQ0FBQyxzQ0FBZ0IsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9DLE1BQU0sQ0FBaUIsQ0FBRSxDQUFDLG1CQUFtQixDQUFDLEtBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RSxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDOztRQVBMLEdBQUcsQ0FBQyxDQUFVLFVBQTBCLEVBQTFCLEtBQUEsd0JBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQTFCLGNBQTBCLEVBQTFCLElBQTBCLENBQUM7WUFBcEMsSUFBSSxDQUFDLFNBQUE7O1NBUVQ7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLHlDQUFpQixHQUF6QixVQUEwQixRQUFnQyxFQUFFLFFBQWdDLEVBQ2xFLFNBQTBCLEVBQUUsVUFBb0I7UUFEMUUsaUJBa0JDO1FBaEJDLElBQUksWUFBWSxHQUFHLGdCQUFTLENBQUMsUUFBUSxDQUFDO1lBQ2YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQ3BCLFVBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxFQUNELEVBQUUsQ0FBQztZQUNQLEVBQUUsQ0FBQztRQUUxQixRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7WUFDekIsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzFFLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILDZCQUFnQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQ1osVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxFQUFwRCxDQUFvRCxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVELG9DQUFZLEdBQVosVUFBYSxRQUFnQyxFQUFFLFFBQWdDLEVBQ2xFLGVBQWdDLEVBQUUsVUFBb0I7UUFDakUsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUMxQixJQUFJLElBQUksR0FBRyxnQkFBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ3ZELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU3RCxFQUFFLENBQUMsQ0FBQyx3QkFBYSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFDcEMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDdEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksU0FBUyxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7Z0JBQ3RDLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3pFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlGLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVPLHNDQUFjLEdBQXRCLFVBQXVCLFNBQTBCLEVBQUUsSUFBa0IsRUFBRSxJQUFrQixFQUNsRSxNQUFvQjtRQUN6QyxJQUFJLFFBQVEsR0FBRyx5QkFBa0IsQ0FBQyxPQUFPLENBQ3JDLENBQUMsY0FBTyxDQUFDLGVBQWUsRUFBRSxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUMsQ0FBQyxFQUFFLGNBQU8sQ0FBQyx1QkFBWSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hHLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUNBQTRCLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9FLEVBQUUsQ0FBQyxDQUFDLHNDQUFnQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUN0QixDQUFDO0lBRU8saUNBQVMsR0FBakIsVUFBa0IsU0FBMEIsRUFBRSxPQUFxQjtRQUNqRSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRCxFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksK0JBQW1CLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLElBQUksMEJBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBQ3hELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixNQUFNLElBQUksMEJBQWEsQ0FBQyw0QkFBMEIsT0FBTyxDQUFDLE1BQVEsQ0FBQyxDQUFDO1lBQ3RFLENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU8sb0NBQVksR0FBcEIsVUFBcUIsTUFBb0IsRUFBRSxVQUFvQjtRQUEvRCxpQkFVQztRQVRDLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDekMsNkJBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUN6QixVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQyxDQUFDO1lBQ3JFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQXBIRCxJQW9IQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7T25Jbml0LCBwcm92aWRlLCBSZWZsZWN0aXZlSW5qZWN0b3IsIENvbXBvbmVudFJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Um91dGVyT3V0bGV0fSBmcm9tICcuL2RpcmVjdGl2ZXMvcm91dGVyX291dGxldCc7XG5pbXBvcnQge1R5cGUsIGlzQmxhbmssIGlzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1xuICBFdmVudEVtaXR0ZXIsXG4gIE9ic2VydmFibGUsXG4gIFByb21pc2VXcmFwcGVyLFxuICBPYnNlcnZhYmxlV3JhcHBlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7Um91dGVyVXJsU2VyaWFsaXplcn0gZnJvbSAnLi9yb3V0ZXJfdXJsX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtDYW5EZWFjdGl2YXRlfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtyZWNvZ25pemV9IGZyb20gJy4vcmVjb2duaXplJztcbmltcG9ydCB7TG9jYXRpb259IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2NvbW1vbic7XG5pbXBvcnQge2xpbmt9IGZyb20gJy4vbGluayc7XG5cbmltcG9ydCB7XG4gIGVxdWFsU2VnbWVudHMsXG4gIHJvdXRlU2VnbWVudENvbXBvbmVudEZhY3RvcnksXG4gIFJvdXRlU2VnbWVudCxcbiAgVHJlZSxcbiAgcm9vdE5vZGUsXG4gIFRyZWVOb2RlLFxuICBVcmxTZWdtZW50LFxuICBzZXJpYWxpemVSb3V0ZVNlZ21lbnRUcmVlXG59IGZyb20gJy4vc2VnbWVudHMnO1xuaW1wb3J0IHtoYXNMaWZlY3ljbGVIb29rfSBmcm9tICcuL2xpZmVjeWNsZV9yZWZsZWN0b3InO1xuaW1wb3J0IHtERUZBVUxUX09VVExFVF9OQU1FfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXJPdXRsZXRNYXAge1xuICAvKiogQGludGVybmFsICovXG4gIF9vdXRsZXRzOiB7W25hbWU6IHN0cmluZ106IFJvdXRlck91dGxldH0gPSB7fTtcbiAgcmVnaXN0ZXJPdXRsZXQobmFtZTogc3RyaW5nLCBvdXRsZXQ6IFJvdXRlck91dGxldCk6IHZvaWQgeyB0aGlzLl9vdXRsZXRzW25hbWVdID0gb3V0bGV0OyB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICBwcml2YXRlIF9wcmV2VHJlZTogVHJlZTxSb3V0ZVNlZ21lbnQ+O1xuICBwcml2YXRlIF91cmxUcmVlOiBUcmVlPFVybFNlZ21lbnQ+O1xuICBwcml2YXRlIF9sb2NhdGlvblN1YnNjcmlwdGlvbjogYW55O1xuICBwcml2YXRlIF9jaGFuZ2VzOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm9vdENvbXBvbmVudDogT2JqZWN0LCBwcml2YXRlIF9yb290Q29tcG9uZW50VHlwZTogVHlwZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY29tcG9uZW50UmVzb2x2ZXI6IENvbXBvbmVudFJlc29sdmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF91cmxTZXJpYWxpemVyOiBSb3V0ZXJVcmxTZXJpYWxpemVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9yb3V0ZXJPdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCwgcHJpdmF0ZSBfbG9jYXRpb246IExvY2F0aW9uKSB7XG4gICAgdGhpcy5fc2V0VXBMb2NhdGlvbkNoYW5nZUxpc3RlbmVyKCk7XG4gICAgdGhpcy5uYXZpZ2F0ZUJ5VXJsKHRoaXMuX2xvY2F0aW9uLnBhdGgoKSk7XG4gIH1cblxuICBnZXQgdXJsVHJlZSgpOiBUcmVlPFVybFNlZ21lbnQ+IHsgcmV0dXJuIHRoaXMuX3VybFRyZWU7IH1cblxuICBuYXZpZ2F0ZUJ5VXJsKHVybDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX25hdmlnYXRlKHRoaXMuX3VybFNlcmlhbGl6ZXIucGFyc2UodXJsKSk7XG4gIH1cblxuICBuYXZpZ2F0ZShjaGFuZ2VzOiBhbnlbXSwgc2VnbWVudD86IFJvdXRlU2VnbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9uYXZpZ2F0ZSh0aGlzLmNyZWF0ZVVybFRyZWUoY2hhbmdlcywgc2VnbWVudCkpO1xuICB9XG5cbiAgZGlzcG9zZSgpOiB2b2lkIHsgT2JzZXJ2YWJsZVdyYXBwZXIuZGlzcG9zZSh0aGlzLl9sb2NhdGlvblN1YnNjcmlwdGlvbik7IH1cblxuICBwcml2YXRlIF9zZXRVcExvY2F0aW9uQ2hhbmdlTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgdGhpcy5fbG9jYXRpb25TdWJzY3JpcHRpb24gPSB0aGlzLl9sb2NhdGlvbi5zdWJzY3JpYmUoXG4gICAgICAgIChjaGFuZ2UpID0+IHsgdGhpcy5fbmF2aWdhdGUodGhpcy5fdXJsU2VyaWFsaXplci5wYXJzZShjaGFuZ2VbJ3VybCddKSk7IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfbmF2aWdhdGUodXJsOiBUcmVlPFVybFNlZ21lbnQ+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5fdXJsVHJlZSA9IHVybDtcbiAgICByZXR1cm4gcmVjb2duaXplKHRoaXMuX2NvbXBvbmVudFJlc29sdmVyLCB0aGlzLl9yb290Q29tcG9uZW50VHlwZSwgdXJsKVxuICAgICAgICAudGhlbihjdXJyVHJlZSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBfTG9hZFNlZ21lbnRzKGN1cnJUcmVlLCB0aGlzLl9wcmV2VHJlZSlcbiAgICAgICAgICAgICAgLmxvYWQodGhpcy5fcm91dGVyT3V0bGV0TWFwLCB0aGlzLl9yb290Q29tcG9uZW50KVxuICAgICAgICAgICAgICAudGhlbih1cGRhdGVkID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fcHJldlRyZWUgPSBjdXJyVHJlZTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2xvY2F0aW9uLmdvKHRoaXMuX3VybFNlcmlhbGl6ZXIuc2VyaWFsaXplKHRoaXMuX3VybFRyZWUpKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZXMuZW1pdChudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZVVybFRyZWUoY2hhbmdlczogYW55W10sIHNlZ21lbnQ/OiBSb3V0ZVNlZ21lbnQpOiBUcmVlPFVybFNlZ21lbnQ+IHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX3ByZXZUcmVlKSkge1xuICAgICAgbGV0IHMgPSBpc1ByZXNlbnQoc2VnbWVudCkgPyBzZWdtZW50IDogdGhpcy5fcHJldlRyZWUucm9vdDtcbiAgICAgIHJldHVybiBsaW5rKHMsIHRoaXMuX3ByZXZUcmVlLCB0aGlzLnVybFRyZWUsIGNoYW5nZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzZXJpYWxpemVVcmwodXJsOiBUcmVlPFVybFNlZ21lbnQ+KTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3VybFNlcmlhbGl6ZXIuc2VyaWFsaXplKHVybCk7IH1cblxuICBnZXQgY2hhbmdlcygpOiBPYnNlcnZhYmxlPHZvaWQ+IHsgcmV0dXJuIHRoaXMuX2NoYW5nZXM7IH1cblxuICBnZXQgcm91dGVUcmVlKCk6IFRyZWU8Um91dGVTZWdtZW50PiB7IHJldHVybiB0aGlzLl9wcmV2VHJlZTsgfVxufVxuXG5cbmNsYXNzIF9Mb2FkU2VnbWVudHMge1xuICBwcml2YXRlIGRlYWN0aXZhdGlvbnM6IE9iamVjdFtdW10gPSBbXTtcbiAgcHJpdmF0ZSBwZXJmb3JtTXV0YXRpb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY3VyclRyZWU6IFRyZWU8Um91dGVTZWdtZW50PiwgcHJpdmF0ZSBwcmV2VHJlZTogVHJlZTxSb3V0ZVNlZ21lbnQ+KSB7fVxuXG4gIGxvYWQocGFyZW50T3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXAsIHJvb3RDb21wb25lbnQ6IE9iamVjdCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGxldCBwcmV2Um9vdCA9IGlzUHJlc2VudCh0aGlzLnByZXZUcmVlKSA/IHJvb3ROb2RlKHRoaXMucHJldlRyZWUpIDogbnVsbDtcbiAgICBsZXQgY3VyclJvb3QgPSByb290Tm9kZSh0aGlzLmN1cnJUcmVlKTtcblxuICAgIHJldHVybiB0aGlzLmNhbkRlYWN0aXZhdGUoY3VyclJvb3QsIHByZXZSb290LCBwYXJlbnRPdXRsZXRNYXAsIHJvb3RDb21wb25lbnQpXG4gICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgdGhpcy5wZXJmb3JtTXV0YXRpb24gPSB0cnVlO1xuICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZENoaWxkU2VnbWVudHMoY3VyclJvb3QsIHByZXZSb290LCBwYXJlbnRPdXRsZXRNYXAsIFtyb290Q29tcG9uZW50XSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5EZWFjdGl2YXRlKGN1cnJSb290OiBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+LCBwcmV2Um9vdDogVHJlZU5vZGU8Um91dGVTZWdtZW50PixcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLCByb290Q29tcG9uZW50OiBPYmplY3QpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0aGlzLnBlcmZvcm1NdXRhdGlvbiA9IGZhbHNlO1xuICAgIHRoaXMubG9hZENoaWxkU2VnbWVudHMoY3VyclJvb3QsIHByZXZSb290LCBvdXRsZXRNYXAsIFtyb290Q29tcG9uZW50XSk7XG5cbiAgICBsZXQgYWxsUGF0aHMgPSBQcm9taXNlV3JhcHBlci5hbGwodGhpcy5kZWFjdGl2YXRpb25zLm1hcChyID0+IHRoaXMuY2hlY2tDYW5EZWFjdGl2YXRlUGF0aChyKSkpO1xuICAgIHJldHVybiBhbGxQYXRocy50aGVuKCh2YWx1ZXM6IGJvb2xlYW5bXSkgPT4gdmFsdWVzLmZpbHRlcih2ID0+IHYpLmxlbmd0aCA9PT0gdmFsdWVzLmxlbmd0aCk7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrQ2FuRGVhY3RpdmF0ZVBhdGgocGF0aDogT2JqZWN0W10pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBsZXQgY3VyciA9IFByb21pc2VXcmFwcGVyLnJlc29sdmUodHJ1ZSk7XG4gICAgZm9yIChsZXQgcCBvZiBMaXN0V3JhcHBlci5yZXZlcnNlZChwYXRoKSkge1xuICAgICAgY3VyciA9IGN1cnIudGhlbihfID0+IHtcbiAgICAgICAgaWYgKGhhc0xpZmVjeWNsZUhvb2soXCJyb3V0ZXJDYW5EZWFjdGl2YXRlXCIsIHApKSB7XG4gICAgICAgICAgcmV0dXJuICg8Q2FuRGVhY3RpdmF0ZT5wKS5yb3V0ZXJDYW5EZWFjdGl2YXRlKHRoaXMucHJldlRyZWUsIHRoaXMuY3VyclRyZWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBfO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnI7XG4gIH1cblxuICBwcml2YXRlIGxvYWRDaGlsZFNlZ21lbnRzKGN1cnJOb2RlOiBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+LCBwcmV2Tm9kZTogVHJlZU5vZGU8Um91dGVTZWdtZW50PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCwgY29tcG9uZW50czogT2JqZWN0W10pOiB2b2lkIHtcbiAgICBsZXQgcHJldkNoaWxkcmVuID0gaXNQcmVzZW50KHByZXZOb2RlKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2Tm9kZS5jaGlsZHJlbi5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG0sIGMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1bYy52YWx1ZS5vdXRsZXRdID0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge30pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9O1xuXG4gICAgY3Vyck5vZGUuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgIHRoaXMubG9hZFNlZ21lbnRzKGMsIHByZXZDaGlsZHJlbltjLnZhbHVlLm91dGxldF0sIG91dGxldE1hcCwgY29tcG9uZW50cyk7XG4gICAgICBTdHJpbmdNYXBXcmFwcGVyLmRlbGV0ZShwcmV2Q2hpbGRyZW4sIGMudmFsdWUub3V0bGV0KTtcbiAgICB9KTtcblxuICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChwcmV2Q2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2LCBrKSA9PiB0aGlzLnVubG9hZE91dGxldChvdXRsZXRNYXAuX291dGxldHNba10sIGNvbXBvbmVudHMpKTtcbiAgfVxuXG4gIGxvYWRTZWdtZW50cyhjdXJyTm9kZTogVHJlZU5vZGU8Um91dGVTZWdtZW50PiwgcHJldk5vZGU6IFRyZWVOb2RlPFJvdXRlU2VnbWVudD4sXG4gICAgICAgICAgICAgICBwYXJlbnRPdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCwgY29tcG9uZW50czogT2JqZWN0W10pOiB2b2lkIHtcbiAgICBsZXQgY3VyciA9IGN1cnJOb2RlLnZhbHVlO1xuICAgIGxldCBwcmV2ID0gaXNQcmVzZW50KHByZXZOb2RlKSA/IHByZXZOb2RlLnZhbHVlIDogbnVsbDtcbiAgICBsZXQgb3V0bGV0ID0gdGhpcy5nZXRPdXRsZXQocGFyZW50T3V0bGV0TWFwLCBjdXJyTm9kZS52YWx1ZSk7XG5cbiAgICBpZiAoZXF1YWxTZWdtZW50cyhjdXJyLCBwcmV2KSkge1xuICAgICAgdGhpcy5sb2FkQ2hpbGRTZWdtZW50cyhjdXJyTm9kZSwgcHJldk5vZGUsIG91dGxldC5vdXRsZXRNYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuY29uY2F0KFtvdXRsZXQubG9hZGVkQ29tcG9uZW50XSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVubG9hZE91dGxldChvdXRsZXQsIGNvbXBvbmVudHMpO1xuICAgICAgaWYgKHRoaXMucGVyZm9ybU11dGF0aW9uKSB7XG4gICAgICAgIGxldCBvdXRsZXRNYXAgPSBuZXcgUm91dGVyT3V0bGV0TWFwKCk7XG4gICAgICAgIGxldCBsb2FkZWRDb21wb25lbnQgPSB0aGlzLmxvYWROZXdTZWdtZW50KG91dGxldE1hcCwgY3VyciwgcHJldiwgb3V0bGV0KTtcbiAgICAgICAgdGhpcy5sb2FkQ2hpbGRTZWdtZW50cyhjdXJyTm9kZSwgcHJldk5vZGUsIG91dGxldE1hcCwgY29tcG9uZW50cy5jb25jYXQoW2xvYWRlZENvbXBvbmVudF0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxvYWROZXdTZWdtZW50KG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLCBjdXJyOiBSb3V0ZVNlZ21lbnQsIHByZXY6IFJvdXRlU2VnbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6IFJvdXRlck91dGxldCk6IE9iamVjdCB7XG4gICAgbGV0IHJlc29sdmVkID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUoXG4gICAgICAgIFtwcm92aWRlKFJvdXRlck91dGxldE1hcCwge3VzZVZhbHVlOiBvdXRsZXRNYXB9KSwgcHJvdmlkZShSb3V0ZVNlZ21lbnQsIHt1c2VWYWx1ZTogY3Vycn0pXSk7XG4gICAgbGV0IHJlZiA9IG91dGxldC5sb2FkKHJvdXRlU2VnbWVudENvbXBvbmVudEZhY3RvcnkoY3VyciksIHJlc29sdmVkLCBvdXRsZXRNYXApO1xuICAgIGlmIChoYXNMaWZlY3ljbGVIb29rKFwicm91dGVyT25BY3RpdmF0ZVwiLCByZWYuaW5zdGFuY2UpKSB7XG4gICAgICByZWYuaW5zdGFuY2Uucm91dGVyT25BY3RpdmF0ZShjdXJyLCBwcmV2LCB0aGlzLmN1cnJUcmVlLCB0aGlzLnByZXZUcmVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0T3V0bGV0KG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLCBzZWdtZW50OiBSb3V0ZVNlZ21lbnQpOiBSb3V0ZXJPdXRsZXQge1xuICAgIGxldCBvdXRsZXQgPSBvdXRsZXRNYXAuX291dGxldHNbc2VnbWVudC5vdXRsZXRdO1xuICAgIGlmIChpc0JsYW5rKG91dGxldCkpIHtcbiAgICAgIGlmIChzZWdtZW50Lm91dGxldCA9PSBERUZBVUxUX09VVExFVF9OQU1FKSB7XG4gICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBDYW5ub3QgZmluZCBkZWZhdWx0IG91dGxldGApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYENhbm5vdCBmaW5kIHRoZSBvdXRsZXQgJHtzZWdtZW50Lm91dGxldH1gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dGxldDtcbiAgfVxuXG4gIHByaXZhdGUgdW5sb2FkT3V0bGV0KG91dGxldDogUm91dGVyT3V0bGV0LCBjb21wb25lbnRzOiBPYmplY3RbXSk6IHZvaWQge1xuICAgIGlmIChpc1ByZXNlbnQob3V0bGV0KSAmJiBvdXRsZXQuaXNMb2FkZWQpIHtcbiAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChvdXRsZXQub3V0bGV0TWFwLl9vdXRsZXRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2LCBrKSA9PiB0aGlzLnVubG9hZE91dGxldCh2LCBjb21wb25lbnRzKSk7XG4gICAgICBpZiAodGhpcy5wZXJmb3JtTXV0YXRpb24pIHtcbiAgICAgICAgb3V0bGV0LnVubG9hZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRpb25zLnB1c2goY29tcG9uZW50cy5jb25jYXQoW291dGxldC5sb2FkZWRDb21wb25lbnRdKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59Il19