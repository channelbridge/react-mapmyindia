/* global MapmyIndia L */


import _ from 'lodash'
import PropTypes from 'prop-types'
import React, {Component} from 'react';


class Map extends Component {

    constructor(props) {
        super(props)
        this.map = null
        this.state = {
            hasMapBeenMounted: false,
        }
        this.markers = []

    }

    componentDidMount() {
        this.initializeMap()
        this.setState(prevState => ({
            hasMapBeenMounted: true,
        }))

    }


    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.children, this.props.children)) {
            this.removeMarkers() //Only re-render markers if positions change
        }
    }


    pushMarkerToStack = (marker) => {
        this.markers.push(marker)
    }

    removeMarkers = () => {
        let length = this.markers.length
        for (let i = 0; i < length; i++) {
            this.map.removeLayer(this.markers[i])
        }
        this.markers = [] //clean up markers stack
    }

    initializeMap = () => {
        let {center, zoomControl, hybrid, location} = this.props
        this.map = new MapmyIndia.Map(this.mapNode, {
            center,
            zoomControl,
            hybrid,
            location,
        });
    }

    focusMap = (pos) => {
        this.map.setView(pos,this.map.zoom)
    }

    componentDidUpdate() {
        this.fitMarkersIntoBounds() //once all markers are rendered fit markers into bounds
    }


    fitMarkersIntoBounds = () => {
        if (_.isEmpty(this.positions)) return false
        let validLatList = this.positions.map(position => position[0])
        let validLongList = this.positions.map(position => position[1])
        let southWestBound = new L.LatLng(_.max(validLatList), _.max(validLongList))
        let northEastBound = new L.LatLng(_.min(validLatList), _.min(validLongList))
        this.map.fitBounds(L.latLngBounds(southWestBound, northEastBound))
    }


    renderChildren() {
        this.positions = []     //Needs refact
        let {children} = this.props
        if (!children || !this.map) return
        return React.Children.map(children, (c, index) => {
            let {position} = c.props
            this.positions.push(position)
            return React.cloneElement(c, {
                mapInstance: this.map,
                adjustMap: this.focusMap,
                pushMarkerToStack: this.pushMarkerToStack,
            })
        })
    }


    render() {
        let {height, width} = this.props
        let {hasMapBeenMounted} = this.state
        return (
            <div id="mmi-mount-node"
                 ref={node => this.mapNode = node}
                 style={{width: width || '800px', height: height || '400px'}}>
                {/*Map is mounted to this point and markers are rendered as children of the map*/}
                {hasMapBeenMounted && this.renderChildren()}
            </div>
        );
    }
}


class MapMarker extends React.Component {

    componentDidMount() {
        this.renderMarker()
    }


    componentDidUpdate(prevProps) {
        if (_.isEqual(prevProps.position, this.props.position)) return false //Render new Marker only if positions have changed
        this.renderMarker()
    }


    renderMarker = () => {
        let {mapInstance, position, title} = this.props
        this.addMarker(position, title, mapInstance)

    }

    addMarker = (position, title, mapInstance, draggable = false) => {
        let {popupContent, adjustMap} = this.props
        let mk = L.marker(position, {title, draggable})
        mk.bindPopup(popupContent)
        mk.on("click", function (e) {
            mk.openPopup()
        })
        mapInstance.addLayer(mk)
        adjustMap(mk.getLatLng())
        this.props.pushMarkerToStack(mk)
    }


    render() {
        return null
    }

}


Map.defaultProps = {
    center: [12.971599, 77.594563],
    zoomControl: true,
    hybrid: false,
    location: false,
    zoom: 12,
    height: '500px', //Accepts Percentages also
    width: '500px'
}

Map.propTypes = {
    center: PropTypes.array,
    zoomControl: PropTypes.bool,
    location: PropTypes.bool,
    height: PropTypes.string,
    width: PropTypes.string,
    zoom: PropTypes.number,
    hybrid: PropTypes.bool

}

MapMarker.propTypes = {
    position: PropTypes.array.isRequired,
    popupContent: PropTypes.string, //Can pass custom mark up as documented by map my india
}


export default Map;
export {MapMarker}
