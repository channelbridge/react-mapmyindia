# React MapmyIndia

### Simple React Component for the MapmyIndia API

#### Instructions

##### How to install
`npm install react-mapmyindia --save`

#### How to use 

Include the MapmyIndia script with your API KEY in the index.html
```html
<script src="https://apis.mapmyindia.com/advancedmaps/v1/{YOUR_API_KEY}/map_load?v=0.1"}></script>

```
```javascript
import MapmyIndia, {MapMarker} from 'react-mapmyindia'

class MyMap extends React.Component {
	 render () {
		 return (
		 	<MapmyIndia>
			 	<MapMarker position = {[12.34343,90.5655222]} popupContent = {"My-place"} />
			 <MapmyIndia>
		 )
	 }
}
```
#### Build from source
run `npm install && npm build` 

#### Knows issues

- Zoom does not work sometimes
- Rendering large number of markers may result in sluggish performance

##### Please contribute and help us make this better

