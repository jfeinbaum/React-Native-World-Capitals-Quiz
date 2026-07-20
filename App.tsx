import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { Table } from './components/Table';
import { WorldMap } from './components/WorldMap';

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
    time: number;
  };

  const [country, setCountry] = useState('');
  const [countryData, setCountryData] = useState<CountryData>({});
  const [learnedRows, setLearnedRows] = useState<LearnedRow[]>([]);
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [inputEnabled, setInputEnabled] = useState(true);

  const inputRef = useRef<TextInput>(null);
  const lastTimestamp = useRef(performance.now());


  useEffect(() => {
    fetch(`${API_URL}/countries_data`)
      .then((res) => res.json())
      .then((data) => setCountryData(data.countries))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (Object.keys(countryData).length > 0) {
      refreshButtonPressed();
    }
  }, [countryData]);


  function getRandomCountry(): string | undefined {
    const keys = Object.keys(countryData).filter(
      (key) => !learnedRows.find((row) => row.country === key) && key !== country
    );
    return keys[Math.floor(Math.random() * keys.length)];
  }
  
  const headers = ['Country', 'Capital', 'Time'];
  const rows = learnedRows.map((row) => [row.country, row.capital, String(row.time)]);
  const rowKeys = learnedRows.map((row) => row.country);



  const refreshButtonPressed = () => {
    const newCountry = getRandomCountry() || '';
    setCountry(newCountry);
    setAnswer('');
    setInputEnabled(true);
    inputRef.current?.focus();
  }

  const highlightCountry = (countryName: string) => {
    setHighlightedCountries((previous) => {
      if (previous.includes(countryName)) {
        return previous;
      }

      return previous.concat(countryName);
    });
  }

  const revealButtonPressed = () => {
    setAnswer('');
    setInputEnabled(false);
    if (!country) return;
    
    const capital = countryData[country].display_capital;
    setAnswer(capital);
    
  }

  const updateCountryTime = (countryName: string, elapsedTime: number) => {
    fetch(`${API_URL}/update_time/${countryName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ time: elapsedTime })
    }).catch(console.error);
  };

  const handleInput = (text: string) => {
    setAnswer(text);
    if (!country) {
      return;
    }

    const info = countryData[country];
    if (!info) {
      return;
    }

    const guessLower = text.trim().toLowerCase();
    const isCorrect = info.allowed_capitals.some(
      capital => capital.toLowerCase() === guessLower
    );
    if (isCorrect) {


      const now = performance.now();
      const elapsedTime = Number(((now - lastTimestamp.current) / 1000).toFixed(3));
    
      lastTimestamp.current = now;


      highlightCountry(country);
      setLearnedRows((prev) => {
        if (prev.find((row) => row.country === country)) {
          return prev;
        }
        const newRow = { country, capital: info.display_capital, time: elapsedTime };
        return prev.concat(newRow);
      });

      refreshButtonPressed();
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        
        <View style={styles.placeholder}>


          <Pressable style={styles.button} onPress={revealButtonPressed}>
            <Text style={styles.buttonText}>Reveal</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={refreshButtonPressed}>
            <Text style={styles.buttonText}>Skip</Text>
          </Pressable>

          <Text>{learnedRows.length}/{Object.keys(countryData).length}</Text>
          

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

        <WorldMap highlightedCountries={highlightedCountries} />

        <Table headers={headers} rows={rows} rowKeys={rowKeys} />
        

        <StatusBar style="auto" />
      </View>
    </ScrollView>
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

  input: {
    flex: 1,
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
});
