The interactive research map uses country outlines in a 600 × 290 equirectangular SVG viewBox.
Its base geometry was extracted from the existing `public/research/intelligence-global-snapshot.svg`;
snapshot colours and percentage values are discarded. Colours always use the selected report's API data.

India, Pakistan, and China use Natural Earth **5.1.1 India point-of-view** geometry so Kashmir is
depicted according to India's boundary convention. All three adjoining outlines come from the same
dataset, avoiding overlapping country hit areas. This is a chosen cartographic point of view,
rather than a representation of administrative control.

Source: https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_0_countries_ind.zip

Natural Earth describes its boundary conventions and country-specific datasets here:
https://www.naturalearthdata.com/about/disputed-boundaries-policy/

To regenerate those three outlines, download the source ZIP and run:

```sh
python3 scripts/update-india-map-boundaries.py /path/to/ne_10m_admin_0_countries_ind.zip
```

The script projects and simplifies the supplied geometry for this map's display scale. It does not
alter other country outlines, country names, report values, or the colour scale.
