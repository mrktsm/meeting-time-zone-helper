import React, { useState } from "react";
import moment from "moment-timezone";

const cityOptions = [
  { value: "America/New_York", label: "New York" },
  { value: "Europe/London", label: "London" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Australia/Sydney", label: "Sydney" },
];

function App() {
  const [leftCity, setLeftCity] = useState("");
  const [rightCity, setRightCity] = useState("");
  const [overlappingTimes, setOverlappingTimes] = useState([]);

  const workingHours = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM

  const handleCalculateOverlap = () => {
    if (!leftCity || !rightCity) {
      alert("Please select both cities.");
      return;
    }

    // Convert working hours to UTC
    const leftCityUTC = workingHours.map((hour) =>
      moment.tz(`${hour}:00`, "HH:mm", leftCity).utc().format("HH:mm")
    );
    const rightCityUTC = workingHours.map((hour) =>
      moment.tz(`${hour}:00`, "HH:mm", rightCity).utc().format("HH:mm")
    );

    // Find overlapping times in UTC
    const overlapUTC = leftCityUTC.filter((time) =>
      rightCityUTC.includes(time)
    );

    // Convert overlapping times back to local times for both cities
    const overlapLocal = overlapUTC.map((time) => ({
      utc: time,
      leftCity: moment.utc(time, "HH:mm").tz(leftCity).format("HH:mm"),
      rightCity: moment.utc(time, "HH:mm").tz(rightCity).format("HH:mm"),
    }));

    setOverlappingTimes(overlapLocal);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundImage: "url(/backgroundIMG.jpg)" }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Meeting Time Zone Helper
      </h1>

      <div className="flex justify-around w-full max-w-4xl mb-6">
        {/* Left City Selection */}
        <div className="w-1/3 text-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Select a City (Left)
          </h3>
          <select
            value={leftCity}
            onChange={(e) => setLeftCity(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select City --</option>
            {cityOptions.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right City Selection */}
        <div className="w-1/3 text-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Select a City (Right)
          </h3>
          <select
            value={rightCity}
            onChange={(e) => setRightCity(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select City --</option>
            {cityOptions.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculateOverlap}
        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg shadow-lg transition-all"
      >
        Calculate Best Times
      </button>

      {/* Overlapping Times */}
      {overlappingTimes.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Overlapping Times
          </h2>
          <table className="table-auto w-full border-collapse border border-gray-300 text-left">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 bg-gray-50">
                  Time (UTC)
                </th>
                <th className="border border-gray-300 p-3 bg-gray-50">
                  Time in Left City
                </th>
                <th className="border border-gray-300 p-3 bg-gray-50">
                  Time in Right City
                </th>
              </tr>
            </thead>
            <tbody>
              {overlappingTimes.map((time, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{time.utc}</td>
                  <td className="border border-gray-300 p-3">
                    {time.leftCity}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {time.rightCity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
