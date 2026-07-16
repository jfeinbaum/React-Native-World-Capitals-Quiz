import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Table, TableColumn, TableRow } from './components/Table';

const API_URL = 'http://10.0.0.234:8000';



export default function App() {
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState<Record<string, string>>({});
  const [guess, setGuess] = useState('');
  const [statusBarText, setStatusBarText] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/countries`)
      .then((res) => res.json())
      .then(setCountries)
      .catch(console.error);
  }, []);


  function getRandomCountry(): string | undefined {
    const keys = Object.keys(countries);

    if (keys.length === 0) {
      return undefined;
    }

    return keys[Math.floor(Math.random() * keys.length)];
  }
  
  const columns: TableColumn[] = [
  { key: 'name', title: 'Country' },
  { key: 'capital', title: 'Capital' },
];

  const rows: TableRow[] = Object.entries(countries).map(([name, capital]) => ({
    name,
    capital,
  }));

  const handleInput = (text: string) => {
    setGuess(text);
  };

  const refreshButtonPressed = () => {
    setCountry(getRandomCountry() || '');
    setGuess('');
    setStatusBarText('')
  }

  const submitGuess = () => {
    const guessLower = guess.trim().toLowerCase();
    const capital = countries[country]?.toLowerCase();

    if (guessLower === capital) {
      setStatusBarText('Correct!');
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.placeholder}>
        <Pressable style={styles.button} onPress={() => submitGuess()}>
          <Text style={styles.buttonText}>▶</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={refreshButtonPressed}>
          <Text style={styles.buttonText}>↺</Text>
        </Pressable>
        
        <Text style={styles.statusText}>
          {statusBarText}
        </Text>

      </View>

      <View style={styles.placeholder}>
        <Text>{country}</Text>
      </View>
      
      <View style={styles.placeholder}>
        <TextInput
          style={styles.input}
          value={guess}
          onChangeText={handleInput}
          autoCapitalize="words"
        />
      </View>

      <Table columns={columns} rows={rows} />
      

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222425',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  placeholder: {
    height: 50,
    width: "70%",
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    margin: 5,
    padding: 5,
    flexDirection: 'row',   
  },
  button: {
    backgroundColor: '#000000',
    padding: 3,
    marginRight: 20,
    borderRadius: 5,
    minWidth: 30,
    minHeight: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusText: {
    color: '#069a17',
    fontWeight: 'bold'
  },

  input: {
    flex: 1,
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
});
