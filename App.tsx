import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Table } from './components/Table';

const API_URL = 'http://10.0.0.234:8000';



export default function App() {

  type CapitalInfo = {
    display_capital: string;
    allowed_capitals: string[];
  };
  type CountryData = Record<string, CapitalInfo>;

  type LearnedRow = {
    country: string;
    capital: string;
  };

  const [country, setCountry] = useState('');
  const [countryData, setCountryData] = useState<CountryData>({});
  const [learnedRows, setLearnedRows] = useState<LearnedRow[]>([]);

  const [answer, setAnswer] = useState('');
  const [inputEnabled, setInputEnabled] = useState(true);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    fetch(`${API_URL}/countries`)
      .then((res) => res.json())
      .then(setCountryData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (Object.keys(countryData).length > 0) {
      refreshButtonPressed();
    }
  }, [countryData]);


  function getRandomCountry(): string | undefined {
    const keys = Object.keys(countryData);
    return keys[Math.floor(Math.random() * keys.length)];
  }
  
  const headers = ['Country', 'Capital'];
  const rows = learnedRows.map((row) => [row.country, row.capital]);
  const rowKeys = learnedRows.map((row) => row.country);



  const refreshButtonPressed = () => {
    setCountry(getRandomCountry() || '');
    setAnswer('');
    setInputEnabled(true);
    inputRef.current?.focus();
  }

  const revealButtonPressed = () => {
    setAnswer('');
    setInputEnabled(false);
    if (!country) return;
    
    const capital = countryData[country].display_capital;
    setAnswer(capital);
    
  }

  const handleInput = (text: string) => {
    setAnswer(text);
    const info = countryData[country];
    const guessLower = text.trim().toLowerCase();
    const isCorrect = info.allowed_capitals.some(
      capital => capital.toLowerCase() === guessLower
    );
    if (isCorrect) {
      setLearnedRows((prev) => {
        if (prev.find((row) => row.country === country)) {
          return prev;
        }
        return prev.concat({ country, capital: info.display_capital });
      });
      refreshButtonPressed();
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.placeholder}>


        <Pressable style={styles.button} onPress={revealButtonPressed}>
          <Text style={styles.buttonText}>Reveal</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={refreshButtonPressed}>
          <Text style={styles.buttonText}>Skip</Text>
        </Pressable>
        

      </View>

      <View style={styles.placeholder}>
        <Text>{country}</Text>
      </View>
      
      <View style={styles.placeholder}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={answer}
          onChangeText={handleInput}
          autoCapitalize="words"
          editable={inputEnabled}
        />
      </View>

      <Table headers={headers} rows={rows} rowKeys={rowKeys} />
      

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#284553',
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
