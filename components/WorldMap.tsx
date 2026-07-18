import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import worldMapData from '../backend/world_map.json';

type Coordinate = [number, number];
type Ring = Coordinate[];
type Polygon = Ring[];
type CountryGeometry = Polygon[];
type WorldMapData = Record<string, CountryGeometry>;

type WorldMapProps = {
  highlightedCountries?: string[];
};

const MAP_DATA = worldMapData as unknown as WorldMapData;
const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 500;

function project([lon, lat]: Coordinate) {
  const x = ((lon + 180) / 360) * VIEWBOX_WIDTH;
  const y = ((90 - lat) / 180) * VIEWBOX_HEIGHT;

  return `${x} ${y}`;
}

function toPathData(polygon: Polygon) {
  return polygon
    .map((ring) => {
      if (ring.length === 0) {
        return '';
      }

      const [first, ...rest] = ring;
      return `M ${project(first)} ${rest.map((point) => `L ${project(point)}`).join(' ')} Z`;
    })
    .join(' ');
}

export function WorldMap({ highlightedCountries = [] }: WorldMapProps) {
  const highlightedSet = useMemo(
    () => new Set(highlightedCountries),
    [highlightedCountries],
  );

  return (
    <View style={styles.container}>
      <Svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} width="100%" height="100%">
        {Object.entries(MAP_DATA).flatMap(([countryName, polygons]) => {
          const fill = highlightedSet.has(countryName) ? '#3f915b' : '#f7f7f2';

          return polygons.map((polygon, index) => (
            <Path
              key={`${countryName}-${index}`}
              d={toPathData(polygon)}
              fill={fill}
              fillRule="evenodd"
              stroke="#111111"
              strokeWidth={0.8}
            />
          ));
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '70%',
    height: 220,
    backgroundColor: '#9fd6ea',
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 12,
  },
});