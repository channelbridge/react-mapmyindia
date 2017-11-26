'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MapMarker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global MapmyIndia L */

var Map = function (_Component) {
    _inherits(Map, _Component);

    function Map(props) {
        _classCallCheck(this, Map);

        var _this = _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this, props));

        _this.pushMarkerToStack = function (marker) {
            _this.markers.push(marker);
        };

        _this.removeMarkers = function () {
            var length = _this.markers.length;
            for (var i = 0; i < length; i++) {
                _this.map.removeLayer(_this.markers[i]);
            }
            _this.markers = []; //clean up markers stack
        };

        _this.initializeMap = function () {
            var _this$props = _this.props,
                center = _this$props.center,
                zoomControl = _this$props.zoomControl,
                hybrid = _this$props.hybrid,
                location = _this$props.location;

            _this.map = new MapmyIndia.Map(_this.mapNode, {
                center: center,
                zoomControl: zoomControl,
                hybrid: hybrid,
                location: location
            });
        };

        _this.focusMap = function (pos) {
            _this.map.setView(pos);
        };

        _this.fitMarkersIntoBounds = function () {
            if (_lodash2.default.isEmpty(_this.positions)) return false;
            var validLatList = _this.positions.map(function (position) {
                return position[0];
            });
            var validLongList = _this.positions.map(function (position) {
                return position[1];
            });
            var southWestBound = new L.LatLng(_lodash2.default.max(validLatList), _lodash2.default.max(validLongList));
            var northEastBound = new L.LatLng(_lodash2.default.min(validLatList), _lodash2.default.min(validLongList));
            _this.map.fitBounds(L.latLngBounds(southWestBound, northEastBound));
        };

        _this.map = null;
        _this.state = {
            hasMapBeenMounted: false
        };
        _this.markers = [];

        return _this;
    }

    _createClass(Map, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.initializeMap();
            this.setState(function (prevState) {
                return {
                    hasMapBeenMounted: true
                };
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!_lodash2.default.isEqual(nextProps.children, this.props.children)) {
                this.removeMarkers(); //Only re-render markers if positions change
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.fitMarkersIntoBounds(); //once all markers are rendered fit markers into bounds
        }
    }, {
        key: 'renderChildren',
        value: function renderChildren() {
            var _this2 = this;

            this.positions = []; //Needs refact
            var children = this.props.children;

            if (!children || !this.map) return;
            return _react2.default.Children.map(children, function (c, index) {
                var position = c.props.position;

                _this2.positions.push(position);
                return _react2.default.cloneElement(c, {
                    mapInstance: _this2.map,
                    adjustMap: _this2.focusMap,
                    pushMarkerToStack: _this2.pushMarkerToStack
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props = this.props,
                height = _props.height,
                width = _props.width;
            var hasMapBeenMounted = this.state.hasMapBeenMounted;

            return _react2.default.createElement(
                'div',
                { id: 'mmi-mount-node',
                    ref: function ref(node) {
                        return _this3.mapNode = node;
                    },
                    style: { width: width || '800px', height: height || '400px' } },
                hasMapBeenMounted && this.renderChildren()
            );
        }
    }]);

    return Map;
}(_react.Component);

var MapMarker = function (_React$Component) {
    _inherits(MapMarker, _React$Component);

    function MapMarker() {
        var _ref;

        var _temp, _this4, _ret;

        _classCallCheck(this, MapMarker);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this4 = _possibleConstructorReturn(this, (_ref = MapMarker.__proto__ || Object.getPrototypeOf(MapMarker)).call.apply(_ref, [this].concat(args))), _this4), _this4.renderMarker = function () {
            var _this4$props = _this4.props,
                mapInstance = _this4$props.mapInstance,
                position = _this4$props.position,
                title = _this4$props.title;

            _this4.addMarker(position, title, mapInstance);
        }, _this4.addMarker = function (position, title, mapInstance) {
            var draggable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
            var _this4$props2 = _this4.props,
                popupContent = _this4$props2.popupContent,
                adjustMap = _this4$props2.adjustMap;

            var mk = L.marker(position, { title: title, draggable: draggable });
            mk.bindPopup(popupContent);
            mk.on("click", function (e) {
                mk.openPopup();
            });
            mapInstance.addLayer(mk);
            adjustMap(mk.getLatLng());
            _this4.props.pushMarkerToStack(mk);
        }, _temp), _possibleConstructorReturn(_this4, _ret);
    }

    _createClass(MapMarker, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.renderMarker();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (_lodash2.default.isEqual(prevProps.position, this.props.position)) return false; //Render new Marker only if positions have changed
            this.renderMarker();
        }
    }, {
        key: 'render',
        value: function render() {
            return null;
        }
    }]);

    return MapMarker;
}(_react2.default.Component);

Map.defaultProps = {
    center: [12.971599, 77.594563],
    zoomControl: true,
    hybrid: false,
    location: false,
    zoom: 12,
    height: '500px', //Accepts Percentages also
    width: '500px'
};

Map.propTypes = {
    center: _propTypes2.default.array,
    zoomControl: _propTypes2.default.bool,
    location: _propTypes2.default.bool,
    height: _propTypes2.default.string,
    width: _propTypes2.default.string,
    zoom: _propTypes2.default.number,
    hybrid: _propTypes2.default.bool

};

MapMarker.propTypes = {
    position: _propTypes2.default.array.isRequired,
    popupContent: _propTypes2.default.string //Can pass custom mark up as documented by map my india
};

exports.default = Map;
exports.MapMarker = MapMarker;