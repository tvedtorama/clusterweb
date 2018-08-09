The world maps comes from a link on this page (topojson):
https://medium.com/@zimrick/how-to-create-pure-react-svg-maps-with-topojson-and-d3-geo-e4a6b6848a98

The 110m_lakes came from:
https://github.com/martynafford/natural-earth-geojson

This place also seems to support non-topjson maps.

## Topojson
Topojson are geometries joined together, instead of the duplicate borders of regular geojson.  They are quicker to load, but require a decoding for rendering.