import axios from "axios";
import { IoMdSunny, IoMdCloudy, IoMdRainy, IoMdSnow, IoMdThunderstorm, IoMdSearch } from "react-icons/io";
import { BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind } from "react-icons/bs";
import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";
import { useEffect, useState } from "react";

const API_KEY = "2f9981ddccfcc065f4eaa66d19ac5d34";

function App() {
    const [data, setData] = useState(null);
    const [location, setLocation] = useState("London");
    const [inputValue, setInputValue] = useState("");
    const [animate, setAnimate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInput = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (inputValue.trim() !== "") {
            setLocation(inputValue.trim());
            setInputValue(""); 
        }

        setAnimate(true);

        setTimeout(() => {
            setAnimate(false);
        }, 500);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
                const response = await axios.get(URL);
                setData(response.data);
            } catch (error) {
                setError("Invalid city or country. Please try again.");
            }
            setTimeout(() => {
                setLoading(false);
            }, 1500); 
        };

        fetchData();
    }, [location]);

    let icon;

    switch (data?.weather[0].main) {
        case "Clouds":
            icon = <IoMdCloudy />;
            break;
        case "Haze":
            icon = <BsCloudHaze2Fill />;
            break;
        case "Rain":
            icon = <IoMdRainy className="text-blue-500"/>;
            break;
        case "Clear":
            icon = <IoMdSunny className="text-yellow-300"/>;
            break;
        case "Drizzle":
            icon = <BsCloudDrizzleFill className="text-blue-500"/>;
            break;
        case "Snow":
            icon = <IoMdSnow className="text-blue-200"/>;
            break;
        case "Thunderstorm":
            icon = <IoMdThunderstorm />;
            break;
        case "Mist":
            icon = <BsCloudHaze2Fill className="text-blue-200"/>;
            break;
        default:
            icon = null;
    }

    const date = new Date();

    return (
        <div className="container">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {/* Form Input */}
            <form onSubmit={handleSubmit} className={`form ${animate ? 'bounce' : ''}`}>
                <div className="form-input">
                    <input
                        onChange={handleInput}
                        type="text"
                        value={inputValue}
                        placeholder="Search by City or Country"
                    />
                    <button type="submit">
                        <IoMdSearch className="search-icon" />
                    </button>
                </div>
            </form>
            <div className="weather-info">
                {loading ? (
                    <div className="spinner">
                        <ImSpinner8 />
                    </div>
                ) : (
                    data && (
                        <>
                            {/* Card Top */}
                            <div className="top-section">
                                <div className="icon">
                                    {icon}
                                </div>
                                <div>
                                    <div className="location">
                                        {data.name}, {data.sys.country}
                                    </div>
                                    <div className="date">
                                        {date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}
                                    </div>
                                </div>
                            </div>
    
                            {/* Temperature and Weather Description */}
                            <div className="temperature-section">
                                <div className="temperature">
                                    {parseInt(data.main.temp)}
                                </div>
                                <div className="temp-icon">
                                    <TbTemperatureCelsius />
                                </div>
                                <div className="description">
                                    {data.weather[0].description}
                                </div>
                            </div>
    
                            {/* Card Bottom */}
                            <div className="details">
                                <div className="details-item">
                                    <BsEye />
                                    <span>Visibility: {data.visibility / 1000} KM</span>
                                </div>
                                <div className="details-item">
                                    <BsThermometer />
                                    <span>Feels Like: {parseInt(data.main.feels_like)}</span>
                                    <TbTemperatureCelsius />
                                </div>
                                <div className="details-item">
                                    <BsWater />
                                    <span>Humidity: {data.main.humidity}%</span>
                                </div>
                                <div className="details-item">
                                    <BsWind />
                                    <span>Wind: {data.wind.speed} m/s</span>
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    );
}

export default App;
