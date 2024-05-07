import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Mood from './Components/Moodpage';
import Language from './Components/Language';
import ContentSelection from './Components/ContentSelection';
import Login from './Components/Login';
import Upload from './Components/Upload';
import Navbar from './Components/NavBar';
import Signup from './Components/Signup';
import HomePage from './Components/Home';


const App = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(''); 
  const [filteredData, setFilteredData] = useState([]);

  console.log(filteredData)
  
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/get');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to filter and sort data based on selected options
  const filterAndSortData = async (mood, language) => {
    const data = await fetchData();
    if (!data) {
      return [];
    }

    // Filter data based on selected options
    const filteredData = data.filter(item => item.Mood === mood && item.Language === language);

    // Sort filtered data based on mood and language
    filteredData.sort((a, b) => {
      if (a.Mood < b.Mood) return -1;
      if (a.Mood > b.Mood) return 1;
      // If mood is same, then sort based on language
      if (a.Language < b.Language) return -1;
      if (a.Language > b.Language) return 1;
      return 0;
    });

    return filteredData;
  };

  useEffect(() => {
    if (selectedMood && selectedLanguage) {
      filterAndSortData(selectedMood, selectedLanguage)
        .then(filteredData => {
          setFilteredData(filteredData);
        })
        .catch(error => console.error('Error filtering and sorting data:', error));
    }
  }, [selectedMood, selectedLanguage]);

  const handleMoodNext = (mood) => {
    setSelectedMood((prevMood) => {
      console.log("New Mood:", mood);
      return mood;
    });
  };

  const handleLanguageNext = (language) => {
    setSelectedLanguage((prevLanguage) => {
      console.log("New Language:", language);
      return language;
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/navbar" />} />
        <Route path="/moodpage" element={<Mood onNext={handleMoodNext} />} />
        <Route path="/language" element={<Language onNext={handleLanguageNext} />} />
        <Route path="/content" element={<ContentSelection selectedMood={selectedMood} selectedLanguage={selectedLanguage} filteredData={filteredData}/>} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/login" element={<Login />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
