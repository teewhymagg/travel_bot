import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import IconPlus from './components/Plus'; // React component plus icon
import IconSend from './components/Send'; // React component send icon
import IconSearch from './components/Search'; // React component search icon
import { checkWeather } from './jquery' // Importing function for implementing weather API
import ChatMessage from './components/ChatMessage';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Using React hook for implementing menu popup state
  const textareaRef = useRef(null);

  // Variable for opening menu
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Variable to handle the close of menu
  const handleCloseClick = () => {
    setIsMenuOpen(false);
  };

  // Implementing scrollbar
  const handleTextareaChange = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Defining cityName variable to store user's input
  const [cityName, setCityName] = useState('');
  
  //
  const [favoritePlaces, setFavoritePlaces] = useState([]);



  const handleSearchClick = async () => {
    try {
      const temperature = await checkWeather(cityName); // Call the checkWeather function with the entered city name and get the temperature
  
      const newFavoritePlace = {
        city: cityName,
        temperature: temperature,
      };
  
      setFavoritePlaces([...favoritePlaces, newFavoritePlace]); // Add the newFavoritePlace to the favoritePlaces array
  
      setCityName(''); // Clear the cityName input field after adding the favorite place
      setIsPlusOpen(false); // Close the plus popup window
    } catch (error) {
      console.log(error); // Handle any errors that occur during the API request
    }
  };
  

  // Adding the place, when plus is clicked
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const handlePlusClick = () => {
    setIsPlusOpen(!isPlusOpen);
  };

  // Variable to close popup menu 
  const handleClosePlusClick = () => {
    setIsPlusOpen(false);
  };

  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([{
    user: "bot",
    message: "How can I help?"
  }, {
    user: "me",
    message: "I want to use bot"
  }]);
 
  async function handleSubmit(e) {
    e.preventDefault();
    setChatLog([...chatLog, { user: "me", message: `${input}`}])
    setInput('')
  }
  
  return (
    <div className={`App ${isMenuOpen ? 'active' : ''}`}>
      <header className="header">
        <div className="burger-menu" onClick={handleMenuClick}>
          &#9776;
        </div>
        <h1 className="header-title">Travel the World</h1>
        <div className="icon-plus-container" onClick={handlePlusClick}>
          <IconPlus width={25} height={20} />
        </div>
      </header>
      <div className="chatbox-main">
        <aside className='sidemenu'>
          <div className='sidemenu-header-button' onClick={handlePlusClick}>
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
              <ChatMessage key={index} message = {message} />
            ))}
          </div>
          <div className="input-place-container">
            <div className="input-place-main">
              <textarea
                ref={textareaRef}
                className="input-place"
                placeholder="Type your message here"
                rows="1"
                onChange={handleTextareaChange}
                style={{resize:"none"}}>
                </textarea>
              <div className='icon-send-container'>
                <form onSubmit={handleSubmit} value={input} onChange={(e) => setInput(e.target.value)}>
                  <IconSend width={30} height={30}/>
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
            <input className= "plus-popup-input" 
              type="text" 
              placeholder='Enter city name'
              value={cityName} // Bind the input value to the cityName state
              onChange={(e) => setCityName(e.target.value)}
            />
            <button className='plus-popup-button' onClick={handleSearchClick}>
              <IconSearch />
            </button>
            <button className='plus-popup-close-button' onClick={handleClosePlusClick}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
