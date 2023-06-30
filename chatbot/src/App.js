import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import IconPlus from './components/Plus';
import IconSend from './components/Send';
import IconSearch from './components/Search';
import { checkWeather } from './jquery';
import ChatMessage from './components/ChatMessage';
import backgroundImage from './image/image5.jpg';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001'); // server URL

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textareaRef = useRef(null);
  const [cityName, setCityName] = useState('');
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { user: 'bot', message: 'How can I help?' },
    { user: 'me', message: 'I want to use bot' },
  ]);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseClick = () => {
    setIsMenuOpen(false);
  };

  const handleTextareaChange = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSearchClick = async () => {
    try {
      const temperature = await checkWeather(cityName);
      const newFavoritePlace = {
        city: cityName,
        temperature: temperature,
      };
      setFavoritePlaces([...favoritePlaces, newFavoritePlace]);
      setCityName('');
      setIsPlusOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlusClick = () => {
    setIsPlusOpen(!isPlusOpen);
  };

  const handleClosePlusClick = () => {
    setIsPlusOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = input.trim();
  
    if (message) {
      setChatLog([...chatLog, { user: 'me', message }]);
      setInput('');
  
      try {
        // Make the API request to your backend server
        const response = await axios.post('/api/chat', { message });
  
        // Handle the API response
        const botResponse = response.data.botResponse;
        setChatLog([...chatLog, { user: 'bot', message: botResponse }]);
        console.log('Bot Response:', botResponse);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    // Clear the input value
    setInput('');
  
    // Reset the placeholder text
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.value = '';
      textareaRef.current.placeholder = 'Type your message here';
    }
  };
  
  useEffect(() => {
    // Function to handle new messages from the server
    const handleNewMessage = (data) => {
      console.log('Received response:', data);
      setChatLog((chatLog) => [...chatLog, { user: 'bot', message: data.message }]);
    };
  
    // Add the event listener when the component mounts
    socket.on('response', handleNewMessage);
  
    // Remove the event listener when the component unmounts
    return () => {
      socket.off('response', handleNewMessage);
    };
  }, []); // Empty dependency array - this effect only runs on mount and unmount
  

  return (
    <div className={`App ${isMenuOpen ? 'active' : ''}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <header className="header">
        <div className="burger-menu" onClick={handleMenuClick}>
          &#9776;
        </div>
        <h1 className="header-title">Visit Bayern</h1>
        <div className="icon-plus-container" onClick={handlePlusClick}>
          <IconPlus width={25} height={20} />
        </div>
      </header>
      <div className="chatbox-main">
        <aside className="sidemenu">
          <div className="sidemenu-header-button" onClick={handlePlusClick}>
            <span>+</span>
            New place
          </div>
          <div className="sidemenu-content">
            <h2>Favourite places</h2>
            <div className="favourite-place1">
              {favoritePlaces.map((place, index) => (
                <div key={index} className="favorite-place1">
                  <span className="city-name1">{place.city}</span>
                  <span className="temperature1">{place.temperature}&deg;C</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
        <div className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} isBot={message.user === 'bot'} />
          ))}
        </div>
          <div className="input-place-container">
            <div className="input-place-main">
              <textarea
                ref={textareaRef}
                className="input-place"
                placeholder="Type your message here"
                rows="1"
                onChange={(e) => setInput(e.target.value)}
                style={{ resize: 'none' }}
              ></textarea>
              <div className="icon-send-container">
                <form onSubmit={handleSubmit}>
                  <button type="submit">
                    <IconSend width={30} height={30} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Favourite places</h2>
            <div className="favorite-places">
              {favoritePlaces.map((place, index) => (
                <div key={index} className="favorite-place">
                  <span className="city-name">{place.city}</span>
                  <span className="temperature">{place.temperature}&deg;C</span>
                </div>
              ))}
            </div>
            <button className="close-button" onClick={handleCloseClick}>
              X
            </button>
          </div>
        </div>
      )}
      {isPlusOpen && (
        <div className="plus-popup">
          <div className="plus-popup-content">
            <input
              className="plus-popup-input"
              type="text"
              placeholder="Enter city name"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <button className="plus-popup-button" onClick={handleSearchClick}>
              <IconSearch />
            </button>
            <button className="plus-popup-close-button" onClick={handleClosePlusClick}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;


