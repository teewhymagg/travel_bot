import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import IconPlus from './Plus';
import IconSend from './Send';
import IconSearch from './Search';
import { checkWeather } from './jquery'

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textareaRef = useRef(null);

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

 

  const [cityName, setCityName] = useState('');

  const handleSearchClick = async () => {
    try {
      await checkWeather(cityName); // Call the checkWeather function with the entered city name
    } catch (error) {
      console.log(error); // Handle any errors that occur during the API request
    }
  };


  // Adding the place, when plus is clicked
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const handlePlusClick = () => {
    setIsPlusOpen(!isPlusOpen);
  };

  const handleClosePlusClick = () => {
    setIsPlusOpen(false);
  };

  
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
          <div className='sidemenu-header-button'>
            <span>+</span>
            New place
          </div>
        </aside>
        <div className="chatbox">
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
                <IconSend width={30} height={30} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Favourite places</h2>
            <p>This is the content of the popup window.</p>
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
