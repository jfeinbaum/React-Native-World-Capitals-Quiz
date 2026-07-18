import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

type TableProps = {
  headers: string[];
  rows: string[][];
  rowKeys?: string[];
};

export function Table({ headers, rows, rowKeys }: TableProps) {
  return (
    <ScrollView horizontal={false} style={{ width: '100%' }}>
      <View style={styles.table}>
        {headers.length === 2 && <View pointerEvents="none" style={styles.centerDivider} />}

        <View style={styles.headerRow}>
          {headers.map((header, colIndex) => (
            <View
              key={`${header}-${colIndex}`}
              style={[styles.cell, styles.headerCell]}
            >
              <Text style={styles.headerText}>{header}</Text>
            </View>
          ))}
        </View>

        {rows.map((row, rowIndex) => {
          const rowKey = rowKeys?.[rowIndex] ?? `row-${rowIndex}-${row.join('|')}`;

          return (
            <View key={rowKey} style={styles.row}>
              {headers.map((_, colIndex) => (
                <View
                  key={`${rowKey}-col-${colIndex}`}
                  style={styles.cell}
                >
                  <Text style={styles.cellText} selectable={false}>
                    {row[colIndex] ?? ''}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  table: {
    position: 'relative',
    width: '100%',
    borderWidth: 5,
    borderColor: '#000000',
  },
  centerDivider: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    marginLeft: -0.5,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderColor: '#000000',
    
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  cell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',

  },
  headerCell: {
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#333',
  },
  cellText: {
    fontSize: 12,
    color: '#ffffff',
  },
});