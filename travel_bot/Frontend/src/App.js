import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import IconPlus from './components/Plus';
import IconSend from './components/Send';
import IconSearch from './components/Search';
import { checkWeather } from './jquery';
import ChatMessage from './components/ChatMessage';
import backgroundImage from './image/image5.jpg';

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseClick = () => {
    setIsMenuOpen(false);
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


  const sendMessageToServer = async (endpoint, data) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
  
    const newMessage = { user: 'me', message: input };
  
    // Update the chatLog state with the new user message
    setChatLog((prevChatLog) => [...prevChatLog, newMessage]);
    setInput('');
  
    try {

      console.log('Sending message to server:', input);
      const response = await sendMessageToServer('http://localhost:3001/api/sendMessage', {
        message: input,
      });
  
      if (!response) {
        throw new Error('Failed to send message');
      }
  
      const botResponse = response.message;
  
      // Use the previous chatLog state instead of the current state
      setChatLog((prevChatLog) => [...prevChatLog, { user: 'bot', message: botResponse }]);
    } catch (error) {
      console.log(error);
    }
  };
  

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
            <div className="favorite-places">
              {favoritePlaces.map((place, index) => (
                <div key={index} className="favorite-place">
                  <span className="city-name">{place.city}</span>
                  <span className="temperature">{place.temperature}&deg;C</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
        <div className="chatbox">
        <div className="chat-log">
        {chatLog.map((message, index) => (
  <ChatMessage key={index} message={message.message} /> // Extract 'message' property from 'message' object
))}

        </div>
          <div className="input-place-container">
            <div className="input-place-main">
              <textarea
                ref={textareaRef}
                className="input-place"
                placeholder="Type your message here"
                rows="1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ resize: 'none' }}
              ></textarea>
              <div className="icon-send-container">
                <button type="submit" onClick={handleSendMessage}>
                  <IconSend width={30} height={30} />
                </button>
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