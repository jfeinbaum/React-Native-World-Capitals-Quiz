import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// ---- Types ----
export type TableColumn = {
  key: string;       // matches key in row data object
  title: string;      // header label
};

export type TableRow = Record<string, string | number>;

interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
}

// ---- Component ----
export const Table: React.FC<TableProps> = ({ columns, rows }) => {
  return (
    <ScrollView horizontal={false} style={{ width: '100%' }}>
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.headerRow}>
          {columns.map((col) => (
            <View
              key={col.key}
              style={[styles.cell, styles.headerCell]}
              pointerEvents="none"
            >
              <Text style={styles.headerText}>{col.title}</Text>
            </View>
          ))}
        </View>

        {/* Body */}
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[styles.row]}
          >
            {columns.map((col) => (
              <View
                key={col.key}
                style={styles.cell}
              >
                <Text style={styles.cellText} selectable={false}>
                  {String(row[col.key] ?? '')}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// ---- Styles ----
const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderWidth: 5,
    borderColor: '#000000',
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
    minWidth: 30,
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