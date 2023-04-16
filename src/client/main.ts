import Map from 'ol/Map'
import Feature from 'ol/Feature'
import { fromExtent } from 'ol/geom/Polygon'
import MVT from 'ol/format/MVT'
import VectorLayer from 'ol/layer/Vector'
import VectorTileLayer from 'ol/layer/VectorTile'
import VectorSource from 'ol/source/Vector'
import VectorTileSource from 'ol/source/VectorTile'
import { Stroke, Style } from 'ol/style'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'

const source = new VectorSource()

const map = new Map({
  target: 'map',
  layers: [
    new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url:'https://vectortileservices3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_Mountains_Parcels_VTL/VectorTileServer/tile/{z}/{y}/{x}.pbf',
        maxZoom: 14
      })
    })
  ],
  view: new View({
    center: fromLonLat([-118.805, 34.027]),
    zoom: 12
  })
})

new VectorLayer({
  map: map,
  source: source,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 4,
    }),
  }),
})

map.on('pointermove', function (event) {
  source.clear()

  map.forEachFeatureAtPixel(
    event.pixel,
    function (feature) {
      const geometry = feature.getGeometry()
      source.addFeature(
        new Feature(
          fromExtent(
            geometry!.getExtent()
          )
        )
      )
    }, {
      hitTolerance: 2,
    }
  );
})
