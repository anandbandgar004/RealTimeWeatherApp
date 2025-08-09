
const API_KEY = 'a8fa9faacf94b81436aea4437c4fa6d5';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Global variables
let currentUnit = 'celsius';
let weatherData = null;
let currentMusicFile = '';
let currentBackgroundAnimation = '';

// Voice Search Variables
let isVoiceSearchActive = false;
let speechRecognition = null;
let voiceSearchTimeout = null;

// Weather Tips System Variables
let weatherTipsEnabled = true;
let currentWeatherTips = [];
let tipsShownForCurrentWeather = false;
let toastQueue = [];

// Voice Search Configuration
const voiceSearchConfig = {
    language: 'en-US',
    continuous: false,
    interimResults: true,
    maxAlternatives: 1,
    timeout: 10000 
};

// Weather icon mapping
const weatherIcons = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};


const weatherMusicMapping = {
    
    byIcon: {
        '01d': 'sunny.mp3',    
        '01n': 'sunny.mp3',    
        '02d': 'cloudy.mp3',   
        '02n': 'cloudy.mp3',   
        '03d': 'cloudy.mp3',   
        '03n': 'cloudy.mp3',   
        '04d': 'cloudy.mp3',   
        '04n': 'cloudy.mp3',   
        '09d': 'rainy.mp3',    
        '09n': 'rainy.mp3',    
        '10d': 'rainy.mp3',    
        '10n': 'rainy.mp3',    
        '11d': 'storm.mp3',    
        '11n': 'storm.mp3',    
        '13d': 'snowy.mp3',    
        '13n': 'snowy.mp3',    
        '50d': 'cloudy.mp3',   
        '50n': 'cloudy.mp3'    
    },
    
    
    byMain: {
        'Clear': 'sunny.mp3',
        'Clouds': 'cloudy.mp3',
        'Rain': 'rainy.mp3',
        'Drizzle': 'rainy.mp3',
        'Thunderstorm': 'storm.mp3',
        'Snow': 'snowy.mp3',
        'Mist': 'cloudy.mp3',
        'Smoke': 'cloudy.mp3',
        'Haze': 'cloudy.mp3',
        'Dust': 'cloudy.mp3',
        'Fog': 'cloudy.mp3',
        'Sand': 'cloudy.mp3',
        'Ash': 'cloudy.mp3',
        'Squall': 'storm.mp3',
        'Tornado': 'storm.mp3'
    }
};

// Background animation mapping
const backgroundAnimationMapping = {
    
    byIcon: {
        '01d': 'sunny',      
        '01n': 'cloudy',     
        '02d': 'sunny',      
        '02n': 'cloudy',     
        '03d': 'cloudy',     
        '03n': 'cloudy',     
        '04d': 'cloudy',     
        '04n': 'cloudy',     
        '09d': 'rainy',      
        '09n': 'rainy',      
        '10d': 'rainy',      
        '10n': 'rainy',      
        '11d': 'stormy',     
        '11n': 'stormy',     
        '13d': 'snowy',      
        '13n': 'snowy',      
        '50d': 'cloudy',     
        '50n': 'cloudy'      
    },
    
    
    byMain: {
        'Clear': 'sunny',
        'Clouds': 'cloudy',
        'Rain': 'rainy',
        'Drizzle': 'rainy',
        'Thunderstorm': 'stormy',
        'Snow': 'snowy',
        'Mist': 'cloudy',
        'Smoke': 'cloudy',
        'Haze': 'cloudy',
        'Dust': 'cloudy',
        'Fog': 'cloudy',
        'Sand': 'cloudy',
        'Ash': 'cloudy',
        'Squall': 'stormy',
        'Tornado': 'stormy'
    }
};

// Weather Tips Database
const weatherTipsDatabase = {
    sunny: {
        icon: 'fas fa-sun',
        title: '☀️ Sunny Day Tips',
        message: 'Perfect weather for outdoor activities! Here are some sunny day suggestions.',
        tips: [
            '🧴 Apply SPF 30+ sunscreen before going outside',
            '💧 Drink water regularly to stay hydrated',
            '👕 Wear light-colored, loose-fitting clothes',
            '🕶️ Don\'t forget sunglasses for UV protection',
            '🌳 Seek shade during peak sun hours (10am-4pm)',
            '🏃‍♂️ Great day for hiking, biking, or sports',
            '🧢 Wear a hat to protect your head and face',
            '🏖️ Perfect beach or pool weather!'
        ],
        toastTips: [
            { title: 'UV Protection', message: 'Don\'t forget sunscreen! UV levels are high today.' },
            { title: 'Stay Hydrated', message: 'Perfect day to carry a water bottle with you.' },
            { title: 'Outdoor Fun', message: 'Great weather for outdoor activities!' }
        ]
    },
    hot: {
        icon: 'fas fa-thermometer-three-quarters',
        title: '🌡️ Hot Weather Tips',
        message: 'It\'s getting hot out there! Here\'s how to stay cool and safe.',
        tips: [
            '❄️ Stay in air-conditioned areas when possible',
            '💦 Drink cold water frequently, avoid alcohol',
            '🧊 Use cooling towels or take cool showers',
            '⏰ Avoid outdoor activities during midday',
            '👶 Check on elderly relatives and pets',
            '🚗 Never leave anyone in a parked car',
            '🧴 Use cooling gels or sprays',
            '🥗 Eat light, fresh foods instead of heavy meals'
        ],
        toastTips: [
            { title: 'Heat Warning', message: 'Temperature is high - limit outdoor activities.' },
            { title: 'Cool Down', message: 'Find air conditioning and stay hydrated.' },
            { title: 'Pet Safety', message: 'Keep pets indoors and provide fresh water.' }
        ]
    },
    rainy: {
        icon: 'fas fa-cloud-rain',
        title: '🌧️ Rainy Day Tips',
        message: 'Rainy weather calls for some cozy indoor plans and safety precautions!',
        tips: [
            '☂️ Carry an umbrella or wear a raincoat',
            '👢 Wear waterproof shoes with good grip',
            '🚗 Drive slowly and increase following distance',
            '⚡ Avoid using electronics during thunderstorms',
            '🏠 Great day for indoor activities like reading',
            '☕ Perfect weather for hot drinks and cozy blankets',
            '🧥 Keep a change of dry clothes handy',
            '📱 Check for flood warnings in your area'
        ],
        toastTips: [
            { title: 'Rain Alert', message: 'Grab an umbrella - it\'s raining outside!' },
            { title: 'Drive Safe', message: 'Wet roads ahead - drive carefully.' },
            { title: 'Indoor Fun', message: 'Perfect day for indoor activities.' }
        ]
    },
    cold: {
        icon: 'fas fa-snowflake',
        title: '🥶 Cold Weather Tips',
        message: 'Bundle up! Here are some tips to stay warm and safe in cold weather.',
        tips: [
            '🧥 Dress in layers - it\'s more effective than one thick layer',
            '🧤 Don\'t forget gloves, hat, and scarf',
            '👢 Wear insulated, waterproof boots',
            '🏠 Keep your home heated adequately (68°F/20°C+)',
            '🚗 Keep emergency supplies in your car',
            '❄️ Watch for ice on walkways and roads',
            '☕ Hot drinks help maintain body temperature',
            '🔥 Check heating systems and carbon monoxide detectors'
        ],
        toastTips: [
            { title: 'Bundle Up', message: 'It\'s cold outside - dress warmly!' },
            { title: 'Ice Warning', message: 'Watch for slippery surfaces.' },
            { title: 'Stay Warm', message: 'Perfect day for hot cocoa and warm clothes.' }
        ]
    },
    snowy: {
        icon: 'fas fa-snowflake',
        title: '❄️ Snowy Weather Tips',
        message: 'Snow day! Here\'s how to stay safe and have fun in the snow.',
        tips: [
            '⛄ Great day to build a snowman or have snowball fights!',
            '🧥 Wear waterproof clothing and layers',
            '🚗 Avoid driving unless absolutely necessary',
            '🧹 Clear snow from car exhaust pipe before starting',
            '🥾 Wear shoes with good traction',
            '🏠 Keep walkways and driveways clear',
            '📱 Keep phone charged in case of emergencies',
            '❄️ Perfect for winter sports like skiing or sledding!'
        ],
        toastTips: [
            { title: 'Snow Alert', message: 'It\'s snowing! Perfect for winter activities.' },
            { title: 'Travel Warning', message: 'Roads may be slippery - drive carefully.' },
            { title: 'Winter Fun', message: 'Time for snowmen and hot chocolate!' }
        ]
    },
    windy: {
        icon: 'fas fa-wind',
        title: '💨 Windy Weather Tips',
        message: 'It\'s breezy out there! Here are some windy weather suggestions.',
        tips: [
            '🪁 Perfect day for flying kites!',
            '🌂 Be careful with umbrellas - they might flip inside out',
            '🚗 Grip your steering wheel firmly when driving',
            '🏠 Secure loose outdoor items (furniture, decorations)',
            '🌳 Stay away from large trees that might fall',
            '👕 Wear layers as wind makes it feel colder',
            '🏃‍♀️ Great natural resistance for outdoor workouts',
            '📱 Check for wind advisories in your area'
        ],
        toastTips: [
            { title: 'Windy Conditions', message: 'Secure loose items - it\'s windy outside!' },
            { title: 'Kite Weather', message: 'Perfect conditions for flying kites!' },
            { title: 'Stay Safe', message: 'Avoid large trees and secure outdoor items.' }
        ]
    },
    stormy: {
        icon: 'fas fa-bolt',
        title: '⛈️ Storm Safety Tips',
        message: 'Severe weather detected! Please follow these important safety guidelines.',
        tips: [
            '🏠 Stay indoors and avoid windows',
            '⚡ Unplug electrical devices to prevent damage',
            '📱 Keep phone charged for emergency communications',
            '🚗 Don\'t drive through flooded roads',
            '🌳 Stay away from trees and power lines',
            '📻 Monitor local weather alerts and warnings',
            '💧 Have emergency water and food supplies ready',
            '🔦 Keep flashlights and batteries accessible'
        ],
        toastTips: [
            { title: 'Storm Warning', message: 'Severe weather - stay indoors and stay safe!' },
            { title: 'Power Safety', message: 'Unplug electronics to prevent storm damage.' },
            { title: 'Emergency Ready', message: 'Keep emergency supplies handy.' }
        ]
    },
    foggy: {
        icon: 'fas fa-smog',
        title: '🌫️ Foggy Weather Tips',
        message: 'Limited visibility ahead! Here\'s how to navigate foggy conditions safely.',
        tips: [
            '🚗 Use fog lights or low beam headlights',
            '🐌 Drive slower and increase following distance',
            '👀 Use road markings and taillights as guides',
            '📻 Listen to traffic reports for road conditions',
            '🚶‍♂️ Wear bright or reflective clothing when walking',
            '⏰ Allow extra time for your commute',
            '🔊 Use your horn to alert other drivers',
            '🏠 Consider delaying non-essential trips'
        ],
        toastTips: [
            { title: 'Fog Warning', message: 'Low visibility - drive carefully!' },
            { title: 'Safety First', message: 'Use headlights and drive slowly.' },
            { title: 'Extra Time', message: 'Allow extra time for travel today.' }
        ]
    }
};

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const loadingSpinner = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const weatherInfo = document.getElementById('weather-info');
const errorText = document.getElementById('error-text');

// Temperature elements
const temperatureEl = document.getElementById('temperature');
const feelsLikeEl = document.getElementById('feels-like');
const celsiusBtn = document.getElementById('celsius-btn');
const fahrenheitBtn = document.getElementById('fahrenheit-btn');

// Weather detail elements
const cityNameEl = document.getElementById('city-name');
const weatherDescEl = document.getElementById('weather-description');
const dateTimeEl = document.getElementById('date-time');
const mainWeatherIcon = document.getElementById('main-weather-icon');

// Weather stats elements
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const pressureEl = document.getElementById('pressure');
const visibilityEl = document.getElementById('visibility');
const cloudinessEl = document.getElementById('cloudiness');
const sunriseEl = document.getElementById('sunrise');
const sunsetEl = document.getElementById('sunset');

// Music elements
const bgMusic = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle');
const musicStatus = document.getElementById('music-status');

// Background animation elements
const weatherBackground = document.getElementById('weather-background');
const sunnyBg = document.getElementById('sunny-bg');
const rainyBg = document.getElementById('rainy-bg');
const snowyBg = document.getElementById('snowy-bg');
const cloudyBg = document.getElementById('cloudy-bg');
const stormyBg = document.getElementById('stormy-bg');

// Voice Search Elements
const voiceSearchBtn = document.getElementById('voice-search-btn');
const voiceStatus = document.getElementById('voice-status');
const voiceStatusText = document.getElementById('voice-status-text');
const micIcon = document.getElementById('mic-icon');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Weather App initialized');
    
    // Initialize voice search
    initializeVoiceSearch();
    
    // Initialize geolocation support check
    initializeGeolocation();
    
    // Initialize weather tips system
    initializeWeatherTips();
    
    // Set up tips toggle button
    updateTipsToggleUI();
    
    // Load default city weather (London)
    getWeatherByCity('London');
    
    // Add enter key listener for search input
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });
    
    // Add specific event listener for location button
    if (locationBtn) {
        locationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📍 Location button clicked');
            getCurrentLocation();
        });
    }
});

// Initialize Weather Tips System
function initializeWeatherTips() {
    console.log('🔮 Weather tips system initialized');
    
    // Load user preference for weather tips
    const tipsPreference = localStorage.getItem('weatherTipsEnabled');
    if (tipsPreference !== null) {
        weatherTipsEnabled = tipsPreference === 'true';
        updateTipsToggleUI();
    }
    
    // Set up automatic toast rotation for demo
    if (weatherTipsEnabled) {
        setTimeout(() => {
            if (!tipsShownForCurrentWeather && weatherData) {
                showQuickToastTip();
            }
        }, 3000); 
    }
}

// Initialize Geolocation Support
function initializeGeolocation() {
    if (navigator.geolocation) {
        console.log('✅ Geolocation is supported');
        
        
        if ('permissions' in navigator) {
            navigator.permissions.query({name: 'geolocation'}).then(function(permission) {
                console.log('📍 Geolocation permission status:', permission.state);
                
                if (permission.state === 'denied') {
                    locationBtn.disabled = true;
                    locationBtn.title = 'Location permission denied. Please enable in browser settings.';
                    locationBtn.style.opacity = '0.6';
                }
            }).catch(function(error) {
                console.log('⚠️ Could not check geolocation permission:', error);
            });
        }
    } else {
        console.error('❌ Geolocation is not supported');
        locationBtn.disabled = true;
        locationBtn.title = 'Geolocation not supported in this browser';
        locationBtn.style.opacity = '0.6';
    }
}


function getCurrentLocation() {
    console.log('📍 getCurrentLocation() called');
    
    if (!navigator.geolocation) {
        console.error('❌ Geolocation not supported');
        showError('Geolocation is not supported by this browser');
        return;
    }
    
    console.log('📍 Starting geolocation request...');
    showLoading();
    showVoiceStatus('Getting your location...', 'processing');
    
    
    locationBtn.disabled = true;
    locationBtn.style.opacity = '0.6';
    
    const options = {
        enableHighAccuracy: true,
        timeout: 15000,        
        maximumAge: 300000     
    };
    
    console.log('📍 Geolocation options:', options);
    
    navigator.geolocation.getCurrentPosition(
        // Success callback
        async function(position) {
            console.log('✅ Location obtained successfully:', position);
            const { latitude, longitude } = position.coords;
            console.log(`📍 Coordinates: ${latitude}, ${longitude}`);
            
            try {
                hideVoiceStatus();
                
                const weatherUrl = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
                console.log('🌐 Fetching weather from:', weatherUrl);
                
                const response = await fetch(weatherUrl);
                console.log('📡 Weather API response status:', response.status);
                
                if (!response.ok) {
                    const errorData = await response.text();
                    console.error('❌ Weather API error:', response.status, errorData);
                    throw new Error(`Weather API error: ${response.status}`);
                }
                
                weatherData = await response.json();
                console.log('📍 Location weather data received:', weatherData);
                
                displayWeather(weatherData);
                
            } catch (error) {
                console.error('❌ Error fetching location weather:', error);
                showError(`Failed to get weather for current location: ${error.message}`);
                hideVoiceStatus();
            } finally {
                
                locationBtn.disabled = false;
                locationBtn.style.opacity = '1';
            }
        },
        
        
        function(error) {
            console.error('❌ Geolocation error:', error);
            hideVoiceStatus();
            
            let errorMessage = 'Failed to get current location';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please enable location permissions in your browser settings and try again.';
                    console.error('❌ Permission denied for geolocation');
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable. Please check your internet connection and try again.';
                    console.error('❌ Position unavailable');
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out. Please try again.';
                    console.error('❌ Geolocation timeout');
                    break;
                default:
                    errorMessage = `Location error: ${error.message}`;
                    console.error('❌ Unknown geolocation error:', error);
            }
            
            showError(errorMessage);
            
            // Re-enable location button
            locationBtn.disabled = false;
            locationBtn.style.opacity = '1';
        },
        
        // Options
        options
    );
}


function initializeVoiceSearch() {
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognition = new SpeechRecognition();
        
        // Configure speech recognition
        speechRecognition.continuous = voiceSearchConfig.continuous;
        speechRecognition.interimResults = voiceSearchConfig.interimResults;
        speechRecognition.lang = voiceSearchConfig.language;
        speechRecognition.maxAlternatives = voiceSearchConfig.maxAlternatives;
        
        // Event listeners
        speechRecognition.onstart = handleVoiceStart;
        speechRecognition.onresult = handleVoiceResult;
        speechRecognition.onerror = handleVoiceError;
        speechRecognition.onend = handleVoiceEnd;
        
        console.log('🎤 Voice search initialized successfully');
    } else {
        // Browser doesn't support voice recognition
        voiceSearchBtn.classList.add('disabled');
        voiceSearchBtn.title = 'Voice search not supported in this browser';
        console.warn('🚫 Voice search not supported in this browser');
    }
}

// Toggle Voice Search
function toggleVoiceSearch() {
    if (!speechRecognition) {
        showVoiceStatus('Voice search not supported in this browser', 'error');
        return;
    }
    
    if (isVoiceSearchActive) {
        stopVoiceSearch();
    } else {
        startVoiceSearch();
    }
}

// Start Voice Search
function startVoiceSearch() {
    try {
        console.log('🎤 Starting voice search...');
        
        // Clear any existing input
        cityInput.value = '';
        cityInput.classList.add('voice-input');
        
        // Update UI
        isVoiceSearchActive = true;
        voiceSearchBtn.classList.add('listening');
        micIcon.classList.add('listening');
        showVoiceStatus('Listening... Say a city name', 'listening');
        
        // Start recognition
        speechRecognition.start();
        
        
        voiceSearchTimeout = setTimeout(() => {
            if (isVoiceSearchActive) {
                console.log('⏰ Voice search timeout');
                stopVoiceSearch();
                showVoiceStatus('Voice search timed out. Please try again.', 'error');
            }
        }, voiceSearchConfig.timeout);
        
    } catch (error) {
        console.error('❌ Error starting voice search:', error);
        handleVoiceError({ error: 'not-allowed' });
    }
}

// Stop Voice Search
function stopVoiceSearch() {
    console.log('🛑 Stopping voice search...');
    
    if (speechRecognition && isVoiceSearchActive) {
        speechRecognition.stop();
    }
    
    
    if (voiceSearchTimeout) {
        clearTimeout(voiceSearchTimeout);
        voiceSearchTimeout = null;
    }
    
    
    isVoiceSearchActive = false;
    voiceSearchBtn.classList.remove('listening', 'processing');
    micIcon.classList.remove('listening', 'processing');
    cityInput.classList.remove('voice-input');
    hideVoiceStatus();
}


function handleVoiceStart() {
    console.log('🎤 Voice recognition started');
    showVoiceStatus('Listening... Speak clearly', 'listening');
}

// Handle Voice Search Results
function handleVoiceResult(event) {
    const results = event.results;
    let transcript = '';
    let isFinal = false;
    
    // Get the most recent result
    for (let i = event.resultIndex; i < results.length; i++) {
        transcript += results[i][0].transcript;
        if (results[i].isFinal) {
            isFinal = true;
        }
    }
    
    console.log('🎤 Voice input:', transcript, 'Final:', isFinal);
    
    // Update input field with interim results
    cityInput.value = transcript.trim();
    
    if (isFinal) {
        // Process the final result
        processFinalVoiceResult(transcript.trim());
    } else {
        // Show interim results
        showVoiceStatus(`Heard: "${transcript.trim()}"`, 'processing');
    }
}

// Process Final Voice Result
function processFinalVoiceResult(transcript) {
    console.log('✅ Processing final voice result:', transcript);
    
    // Update UI to processing state
    voiceSearchBtn.classList.remove('listening');
    voiceSearchBtn.classList.add('processing');
    micIcon.classList.remove('listening');
    micIcon.classList.add('processing');
    showVoiceStatus(`Processing: "${transcript}"`, 'processing');
    
    // Clean up the transcript
    const cityName = cleanVoiceInput(transcript);
    
    if (cityName && cityName.length > 0) {
        cityInput.value = cityName;
        
        // Delay to show processing state
        setTimeout(() => {
            stopVoiceSearch();
            
            // Automatically search for the city
            console.log('🔍 Auto-searching for:', cityName);
            getWeatherByCity(cityName);
        }, 1000);
    } else {
        showVoiceStatus('Could not understand. Please try again.', 'error');
        setTimeout(() => {
            stopVoiceSearch();
        }, 2000);
    }
}


function cleanVoiceInput(transcript) {
    
    let cleaned = transcript.toLowerCase().trim();
    
    
    const prefixesToRemove = [
        'weather for',
        'weather in',
        'show weather for',
        'search for',
        'find weather for',
        'get weather for',
        'what\'s the weather in',
        'how\'s the weather in',
        'tell me the weather for'
    ];
    
    prefixesToRemove.forEach(prefix => {
        if (cleaned.startsWith(prefix)) {
            cleaned = cleaned.substring(prefix.length).trim();
        }
    });
    
    
    cleaned = cleaned.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    console.log('🧹 Cleaned voice input:', transcript, '→', cleaned);
    return cleaned;
}


function handleVoiceError(event) {
    console.error('❌ Voice recognition error:', event.error);
    
    let errorMessage = 'Voice search error occurred';
    
    switch (event.error) {
        case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
        case 'audio-capture':
            errorMessage = 'Microphone not available. Check permissions.';
            break;
        case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please enable it.';
            break;
        case 'network':
            errorMessage = 'Network error. Check your connection.';
            break;
        case 'service-not-allowed':
            errorMessage = 'Voice service not available.';
            break;
        case 'aborted':
            errorMessage = 'Voice search was cancelled.';
            break;
        default:
            errorMessage = `Voice error: ${event.error}`;
    }
    
    showVoiceStatus(errorMessage, 'error');
    
    setTimeout(() => {
        stopVoiceSearch();
    }, 3000);
}


function handleVoiceEnd() {
    console.log('🏁 Voice recognition ended');
    
    if (isVoiceSearchActive) {
        
        setTimeout(() => {
            if (isVoiceSearchActive && !voiceSearchTimeout) {
                console.log('🔄 Restarting voice recognition...');
                try {
                    speechRecognition.start();
                } catch (error) {
                    console.error('❌ Error restarting voice recognition:', error);
                    stopVoiceSearch();
                }
            }
        }, 100);
    }
}

// Show Voice Status
function showVoiceStatus(message, type = 'listening') {
    voiceStatusText.textContent = message;
    voiceStatus.className = `voice-status ${type}`;
    voiceStatus.style.display = 'block';
    
    console.log('💬 Voice status:', message, `(${type})`);
}

// Hide Voice Status
function hideVoiceStatus() {
    voiceStatus.style.display = 'none';
    voiceStatus.className = 'voice-status';
}

// Toggle Weather Tips On/Off
function toggleWeatherTips() {
    weatherTipsEnabled = !weatherTipsEnabled;
    localStorage.setItem('weatherTipsEnabled', weatherTipsEnabled.toString());
    updateTipsToggleUI();
    
    if (weatherTipsEnabled) {
        showToast('Tips Enabled', 'Weather tips are now turned on! 💡', 'fas fa-lightbulb', 'sunny');
    } else {
        showToast('Tips Disabled', 'Weather tips are now turned off.', 'fas fa-lightbulb-slash', 'default');
        // Close any open popups
        closeWeatherPopup();
        // Clear any existing toasts
        clearAllToasts();
    }
}

// Update Tips Toggle Button UI
function updateTipsToggleUI() {
    const toggleBtn = document.getElementById('tips-toggle-btn');
    const statusSpan = document.getElementById('tips-status');
    
    if (weatherTipsEnabled) {
        toggleBtn.classList.remove('disabled');
        statusSpan.textContent = 'ON';
        toggleBtn.style.borderColor = '#3498db';
        toggleBtn.style.color = '#3498db';
    } else {
        toggleBtn.classList.add('disabled');
        statusSpan.textContent = 'OFF';
    }
}

// Analyze Weather and Show Appropriate Tips
function analyzeWeatherAndShowTips(weatherData) {
    if (!weatherTipsEnabled || tipsShownForCurrentWeather) return;
    
    console.log('🔍 Analyzing weather for tips...', weatherData);
    
    const weather = weatherData.weather[0];
    const temp = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const visibility = weatherData.visibility / 1000; 
    
    let weatherCondition = determineWeatherCondition(weather, temp, windSpeed, humidity, visibility);
    
    console.log('📊 Weather condition determined:', weatherCondition);
    
    // Set current tips
    currentWeatherTips = weatherTipsDatabase[weatherCondition];
    
    if (currentWeatherTips) {
        // Show main popup after a short delay
        setTimeout(() => {
            showWeatherPopup(currentWeatherTips);
        }, 2000);
        
        // Show toast tips periodically
        setTimeout(() => {
            showRandomToastTip(weatherCondition);
        }, 8000);
        
        tipsShownForCurrentWeather = true;
    }
}

// Determine Weather Condition for Tips
function determineWeatherCondition(weather, temp, windSpeed, humidity, visibility) {
    const weatherMain = weather.main.toLowerCase();
    const weatherDesc = weather.description.toLowerCase();
    const iconCode = weather.icon;
    
    // Check for extreme conditions first
    if (temp >= 35) return 'hot';
    if (temp <= 0) return 'cold';
    if (windSpeed >= 10) return 'windy';
    if (visibility < 1) return 'foggy';
    
    // Check weather conditions
    if (weatherMain.includes('storm') || weatherMain.includes('thunder')) {
        return 'stormy';
    }
    
    if (weatherMain.includes('snow') || weatherDesc.includes('snow')) {
        return 'snowy';
    }
    
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
        return 'rainy';
    }
    
    if (weatherMain.includes('clear') || weatherDesc.includes('clear')) {
        if (temp >= 25) return 'sunny';
        return 'cold';
    }
    
    if (weatherMain.includes('cloud')) {
        return temp >= 20 ? 'sunny' : 'cold';
    }
    
    if (weatherMain.includes('mist') || weatherMain.includes('fog') || weatherMain.includes('haze')) {
        return 'foggy';
    }
    
    // Default to sunny for pleasant weather
    return temp >= 15 ? 'sunny' : 'cold';
}

// Show Weather Popup
function showWeatherPopup(tips) {
    const overlay = document.getElementById('popup-overlay');
    const popup = document.getElementById('weather-popup');
    const popupIcon = document.getElementById('popup-weather-icon');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const tipsList = document.getElementById('popup-tips-list');
    
    // Set popup content
    popupIcon.className = tips.icon;
    popupTitle.textContent = tips.title;
    popupMessage.textContent = tips.message;
    
    // Clear and populate tips list
    tipsList.innerHTML = '';
    const randomTips = getRandomTips(tips.tips, 4); 
    randomTips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });
    
    // Show popup
    overlay.classList.add('show');
    
    console.log('💡 Weather popup displayed');
}

// Close Weather Popup
function closeWeatherPopup() {
    const overlay = document.getElementById('popup-overlay');
    overlay.classList.remove('show');
    console.log('❌ Weather popup closed');
}

// Show More Tips
function showMoreTips() {
    if (!currentWeatherTips) return;
    
    const tipsList = document.getElementById('popup-tips-list');
    const allTips = currentWeatherTips.tips;
    const moreTips = getRandomTips(allTips, 6); 
    
    // Update tips list with animation
    tipsList.style.opacity = '0.5';
    setTimeout(() => {
        tipsList.innerHTML = '';
        moreTips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
        tipsList.style.opacity = '1';
    }, 200);
    
    console.log('📋 More tips displayed');
}

// Show Toast Notification
function showToast(title, message, iconClass = 'fas fa-info-circle', type = 'default', duration = 5000) {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `weather-toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="toast-content">
            <h4 class="toast-title">${title}</h4>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add click to close functionality
    toast.addEventListener('click', () => closeToast(toast.querySelector('.toast-close')));
    
    container.appendChild(toast);
    
    
    setTimeout(() => {
        if (toast.parentNode) {
            closeToast(toast.querySelector('.toast-close'));
        }
    }, duration);
    
    console.log('🔔 Toast notification shown:', title);
}


function closeToast(closeBtn) {
    const toast = closeBtn.closest('.weather-toast');
    toast.style.animation = 'toastSlideOut 0.4s ease forwards';
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 400);
}


function clearAllToasts() {
    const container = document.getElementById('toast-container');
    container.innerHTML = '';
}

// Show Random Toast Tip
function showRandomToastTip(weatherCondition) {
    if (!weatherTipsEnabled || !weatherTipsDatabase[weatherCondition]) return;
    
    const tips = weatherTipsDatabase[weatherCondition].toastTips;
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    showToast(
        randomTip.title, 
        randomTip.message, 
        weatherTipsDatabase[weatherCondition].icon, 
        weatherCondition,
        4000
    );
}


function showQuickToastTip() {
    const demoTips = [
        { title: 'Weather Tips', message: 'Enable weather tips for smart suggestions! 💡', icon: 'fas fa-lightbulb', type: 'sunny' },
        { title: 'Voice Search', message: 'Try using voice search by clicking the microphone! 🎤', icon: 'fas fa-microphone', type: 'rainy' },
        { title: 'Location Services', message: 'Use current location for instant weather! 📍', icon: 'fas fa-location-dot', type: 'windy' }
    ];
    
    const randomTip = demoTips[Math.floor(Math.random() * demoTips.length)];
    showToast(randomTip.title, randomTip.message, randomTip.icon, randomTip.type, 4000);
}


function getRandomTips(tipsArray, count) {
    const shuffled = [...tipsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, tipsArray.length));
}


function resetWeatherTips() {
    tipsShownForCurrentWeather = false;
    currentWeatherTips = [];
    console.log('🔄 Weather tips reset for new search');
}

// Main function to get weather by user input
function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name or use voice search');
        return;
    }
    
    // Stop voice search if active
    if (isVoiceSearchActive) {
        stopVoiceSearch();
    }
    
    getWeatherByCity(city);
}

// Get weather data by city name
async function getWeatherByCity(city) {
    showLoading();
    
    try {
        // First get coordinates for the city
        const geoResponse = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`);
        
        if (!geoResponse.ok) {
            throw new Error('Failed to fetch location data');
        }
        
        const geoData = await geoResponse.json();
        
        if (geoData.length === 0) {
            throw new Error('City not found. Please check the spelling and try again.');
        }
        
        const { lat, lon } = geoData[0];
        
        // Get weather data using coordinates
        const weatherResponse = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        weatherData = await weatherResponse.json();
        console.log('🌤️ Weather data received for', city + ':', weatherData);
        displayWeather(weatherData);
        
    } catch (error) {
        console.error('❌ Error fetching weather:', error);
        showError(error.message);
    }
}

// Display weather information
function displayWeather(data) {
    hideLoading();
    hideError();
    
    
    resetWeatherTips();
    

    cityInput.value = data.name;
    
    
    const weatherInfo = data.weather[0];
    const iconCode = weatherInfo.icon;
    const weatherMain = weatherInfo.main;
    const weatherDescription = weatherInfo.description.toLowerCase();
    
    console.log('🔍 Weather Details:');
    console.log('   Icon Code:', iconCode);
    console.log('   Main Category:', weatherMain);
    console.log('   Description:', weatherDescription);
    
    
    cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    weatherDescEl.textContent = weatherInfo.description;
    
    
    const iconClass = weatherIcons[iconCode] || 'fas fa-sun';
    mainWeatherIcon.className = iconClass;
    

    updateTemperatureDisplay(data);
    
    
    humidityEl.textContent = `${data.main.humidity}%`;
    windSpeedEl.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressureEl.textContent = `${data.main.pressure} hPa`;
    visibilityEl.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    cloudinessEl.textContent = `${data.clouds.all}%`;
    
    
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    sunriseEl.textContent = formatTime(sunrise);
    sunsetEl.textContent = formatTime(sunset);
    
    
    const now = new Date();
    dateTimeEl.textContent = formatDateTime(now);
    
    
    selectAndPlayMusic(iconCode, weatherMain, weatherDescription);
    
    
    changeBackgroundAnimation(iconCode, weatherMain, weatherDescription);
    
    
    analyzeWeatherAndShowTips(data);
    
    
    document.getElementById('weather-info').style.display = 'block';
}

// Enhanced music selection function
function selectAndPlayMusic(iconCode, weatherMain, weatherDescription) {
    let selectedMusic = 'default.mp3';
    let selectionMethod = 'default';
    

    if (weatherMusicMapping.byIcon[iconCode]) {
        selectedMusic = weatherMusicMapping.byIcon[iconCode];
        selectionMethod = 'icon';
    }
    
    else if (weatherMusicMapping.byMain[weatherMain]) {
        selectedMusic = weatherMusicMapping.byMain[weatherMain];
        selectionMethod = 'main category';
    }
    
    console.log('🎵 Music Selection:');
    console.log('   Selected File:', selectedMusic);
    console.log('   Selection Method:', selectionMethod);
    console.log('   Previous Music:', currentMusicFile);
    
    
    if (selectedMusic !== currentMusicFile) {
        console.log('🔄 Changing music from', currentMusicFile, 'to', selectedMusic);
        playWeatherMusic(selectedMusic);
        currentMusicFile = selectedMusic;
    } else {
        console.log('🎶 Music unchanged, keeping:', selectedMusic);
        
        updateMusicUI();
    }
}


function changeBackgroundAnimation(iconCode, weatherMain, weatherDescription) {
    let selectedAnimation = 'cloudy';
    let selectionMethod = 'default';
    
    
    if (backgroundAnimationMapping.byIcon[iconCode]) {
        selectedAnimation = backgroundAnimationMapping.byIcon[iconCode];
        selectionMethod = 'icon';
    }
    
    else if (backgroundAnimationMapping.byMain[weatherMain]) {
        selectedAnimation = backgroundAnimationMapping.byMain[weatherMain];
        selectionMethod = 'main category';
    }
    
    console.log('🎬 Background Animation Selection:');
    console.log('   Selected Animation:', selectedAnimation);
    console.log('   Selection Method:', selectionMethod);
    console.log('   Previous Animation:', currentBackgroundAnimation);
    
    
    if (selectedAnimation !== currentBackgroundAnimation) {
        console.log('🔄 Changing background from', currentBackgroundAnimation, 'to', selectedAnimation);
        setBackgroundAnimation(selectedAnimation);
        currentBackgroundAnimation = selectedAnimation;
    } else {
        console.log('🎨 Background unchanged, keeping:', selectedAnimation);
    }
}


function setBackgroundAnimation(animationType) {
    
    sunnyBg.classList.remove('active');
    rainyBg.classList.remove('active');
    snowyBg.classList.remove('active');
    cloudyBg.classList.remove('active');
    stormyBg.classList.remove('active');
    
    
    switch(animationType) {
        case 'sunny':
            sunnyBg.classList.add('active');
            break;
        case 'rainy':
            rainyBg.classList.add('active');
            break;
        case 'snowy':
            snowyBg.classList.add('active');
            break;
        case 'cloudy':
            cloudyBg.classList.add('active');
            break;
        case 'stormy':
            stormyBg.classList.add('active');
            break;
        default:
            cloudyBg.classList.add('active');
    }
    
    console.log('✅ Background animation set to:', animationType);
}


function playWeatherMusic(musicFile) {
    console.log('▶️ Attempting to play:', musicFile);
    
    
    bgMusic.pause();
    bgMusic.currentTime = 0;
    
    
    bgMusic.src = musicFile;
    
    
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('✅ Music playing successfully:', musicFile);
            updateMusicUI(true);
        }).catch((error) => {
            console.log('⚠️ Autoplay blocked or error:', error);
            console.log('🔇 User interaction required to play music');
            updateMusicUI(false);
        });
    }
}


function updateMusicUI(isPlaying = null) {
    if (isPlaying === null) {
        isPlaying = !bgMusic.paused;
    }
    
    if (isPlaying) {
        musicToggleBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Music';
        musicToggleBtn.classList.remove('paused');
        musicToggleBtn.classList.add('playing');
        musicStatus.textContent = '♪ Playing ' + getMusicDescription();
        musicStatus.className = 'music-status playing';
    } else {
        musicToggleBtn.innerHTML = '<i class="fas fa-play"></i> Play Music';
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.classList.add('paused');
        musicStatus.textContent = 'Click to play ' + getMusicDescription();
        musicStatus.className = 'music-status paused';
    }
}


function getMusicDescription() {
    const descriptions = {
        'sunny.mp3': 'sunny vibes',
        'rainy.mp3': 'rain sounds',
        'cloudy.mp3': 'cloudy ambience',
        'snowy.mp3': 'winter sounds',
        'storm.mp3': 'storm effects',
        'default.mp3': 'ambient music'
    };
    
    return descriptions[currentMusicFile] || 'ambient sounds';
}


function toggleMusic() {
    if (bgMusic.paused) {
        console.log('🎵 User clicked play');
        bgMusic.play().then(() => {
            updateMusicUI(true);
        }).catch((error) => {
            console.error('❌ Failed to play music:', error);
            showError('Failed to play music. Please check if music files exist.');
        });
    } else {
        console.log('⏸️ User clicked pause');
        bgMusic.pause();
        updateMusicUI(false);
    }
}


function updateTemperatureDisplay(data) {
    let temp, feelsLike;
    
    if (currentUnit === 'celsius') {
        temp = Math.round(data.main.temp);
        feelsLike = Math.round(data.main.feels_like);
        temperatureEl.textContent = `${temp}°C`;
        feelsLikeEl.textContent = `${feelsLike}°C`;
    } else {
        temp = Math.round((data.main.temp * 9/5) + 32);
        feelsLike = Math.round((data.main.feels_like * 9/5) + 32);
        temperatureEl.textContent = `${temp}°F`;
        feelsLikeEl.textContent = `${feelsLike}°F`;
    }
}


function toggleUnit(unit) {
    if (unit === currentUnit || !weatherData) return;
    
    currentUnit = unit;
    
    
    celsiusBtn.classList.toggle('active', unit === 'celsius');
    fahrenheitBtn.classList.toggle('active', unit === 'fahrenheit');
    
    
    updateTemperatureDisplay(weatherData);
}


function showLoading() {
    loadingSpinner.style.display = 'block';
    document.getElementById('weather-info').style.display = 'none';
    errorMessage.style.display = 'none';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showError(message) {
    hideLoading();
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    document.getElementById('weather-info').style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function formatTime(date) {
    return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

function formatDateTime(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options);
}


document.addEventListener('click', function(event) {
    const popup = document.getElementById('weather-popup');
    const overlay = document.getElementById('popup-overlay');
    
    if (overlay.classList.contains('show') && !popup.contains(event.target)) {
        closeWeatherPopup();
    }
});


document.addEventListener('keydown', function(event) {
    
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'V') {
        event.preventDefault();
        toggleVoiceSearch();
    }
    
    
    if (event.key === 'Escape') {
        if (isVoiceSearchActive) {
            event.preventDefault();
            stopVoiceSearch();
        } else {
            const overlay = document.getElementById('popup-overlay');
            if (overlay.classList.contains('show')) {
                closeWeatherPopup();
            }
        }
    }
});


function testLocation() {
    console.log('🧪 Testing location feature...');
    
    if (!navigator.geolocation) {
        console.error('❌ Geolocation not supported');
        return;
    }
    
    console.log('✅ Geolocation is supported');
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            console.log('✅ Location test successful:');
            console.log('   Latitude:', position.coords.latitude);
            console.log('   Longitude:', position.coords.longitude);
            console.log('   Accuracy:', position.coords.accuracy, 'meters');
            console.log('   Timestamp:', new Date(position.timestamp));
        },
        function(error) {
            console.error('❌ Location test failed:');
            console.error('   Error code:', error.code);
            console.error('   Error message:', error.message);
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.error('   → Permission denied by user');
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error('   → Position unavailable');
                    break;
                case error.TIMEOUT:
                    console.error('   → Request timeout');
                    break;
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function testAllAnimations() {
    const animations = ['sunny', 'rainy', 'snowy', 'cloudy', 'stormy'];
    let index = 0;
    
    const cycleAnimations = () => {
        setBackgroundAnimation(animations[index]);
        console.log('🎬 Testing animation:', animations[index]);
        index = (index + 1) % animations.length;
        
        if (index === 0) {
            console.log('✅ All animations tested!');
            return;
        }
        
        setTimeout(cycleAnimations, 3000);
    };
    
    cycleAnimations();
}

function testAllMusicFiles() {
    const musicFiles = ['sunny.mp3', 'rainy.mp3', 'cloudy.mp3', 'snowy.mp3', 'storm.mp3', 'default.mp3'];
    
    musicFiles.forEach((file, index) => {
        setTimeout(() => {
            console.log('🎵 Testing:', file);
            bgMusic.src = file;
            bgMusic.play().then(() => {
                console.log('✅', file, 'loaded successfully');
            }).catch((error) => {
                console.error('❌', file, 'failed to load:', error);
            });
        }, index * 2000);
    });
}

function testVoiceSearch() {
    console.log('🧪 Testing voice search...');
    console.log('Voice Recognition Available:', !!speechRecognition);
    console.log('Current State:', {
        isActive: isVoiceSearchActive,
        hasTimeout: !!voiceSearchTimeout
    });
}

function testWeatherTips() {
    console.log('🧪 Testing weather tips system...');
    
    Object.keys(weatherTipsDatabase).forEach(condition => {
        console.log(`Testing ${condition} tips:`, weatherTipsDatabase[condition]);
    });
    
    
    showWeatherPopup(weatherTipsDatabase.sunny);
}


window.testLocation = testLocation;
window.testAllAnimations = testAllAnimations;
window.testAllMusicFiles = testAllMusicFiles;
window.testVoiceSearch = testVoiceSearch;
window.testWeatherTips = testWeatherTips;

console.log('🎯 Weather App loaded successfully!');
console.log('📍 Available debug functions: testLocation(), testAllAnimations(), testAllMusicFiles(), testVoiceSearch(), testWeatherTips()');
console.log('💡 Weather tips system ready!');
