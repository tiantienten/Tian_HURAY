import React, { useState, useEffect } from "react";

const SCENARIOS = {
  badUI: {
    name: "Bad UI",
    alarms: [
      "Coolant Pressure Low", "Pump Failure", "High Radiation Levels", "Reactor Overheat", "Water Leak Detected", "System Error 505"
    ],
    layout: "scattered",
    decisionAid: false
  },
  goodUI: {
    name: "Good UI",
    alarms: ["Reactor Overheat (Critical)", "Coolant Pressure Low (High Priority)", "Pump Failure (Moderate)"],
    layout: "organized",
    decisionAid: true
  }
};

export default function NuclearExperiment() {
  const [mode, setMode] = useState(null);
  const [alarms, setAlarms] = useState([]);
  const [acknowledgedAlarms, setAcknowledgedAlarms] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [decisionMade, setDecisionMade] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && mode) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, mode]);

  const startSimulation = (selectedMode) => {
    setMode(SCENARIOS[selectedMode]);
    setAlarms(SCENARIOS[selectedMode].alarms);
    setAcknowledgedAlarms([]);
    setTimeLeft(60);
    setDecisionMade(false);
  };

  const acknowledgeAlarm = (alarm) => {
    if (!acknowledgedAlarms.includes(alarm)) {
      setAcknowledgedAlarms([...acknowledgedAlarms, alarm]);
    }
  };

  const handleDecision = () => {
    if (acknowledgedAlarms.length === alarms.length) {
      setDecisionMade(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Nuclear Control Room Simulation</h1>
      {!mode ? (
        <div className="mt-4 space-x-4">
          <button onClick={() => startSimulation("badUI")} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">Start Bad UI Mode</button>
          <button onClick={() => startSimulation("goodUI")} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg">Start Good UI Mode</button>
        </div>
      ) : (
        <div className="mt-6 p-6 w-3/4 border rounded-lg shadow-lg bg-gray-800">
          <h2 className="text-2xl font-bold mb-2 text-center">{mode.name} Scenario</h2>
          <p className="text-lg text-center mb-2">Time Left: {timeLeft} seconds</p>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
          </div>
          <div className={mode.layout === "scattered" ? "grid grid-cols-3 gap-4" : "grid grid-cols-1 gap-4"}>
            {alarms.map((alarm, index) => (
              <div 
                key={index} 
                onClick={() => acknowledgeAlarm(alarm)}
                className={`p-3 text-center font-bold rounded-md text-white shadow-md cursor-pointer ${acknowledgedAlarms.includes(alarm) ? 'bg-green-500' : (mode.name === 'Bad UI' ? 'bg-red-500 animate-pulse' : 'bg-blue-500')}`}
              >
                {alarm} {acknowledgedAlarms.includes(alarm) ? "✔" : ""}
              </div>
            ))}
          </div>
          {mode.decisionAid && <p className="mt-4 p-3 bg-blue-500 text-center text-white rounded-md">AI Decision Aid: Check Reactor Core Status First</p>}
          <button 
            onClick={handleDecision} 
            className={`mt-4 px-6 py-3 font-bold rounded-lg ${decisionMade || timeLeft === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`} 
            disabled={decisionMade || timeLeft === 0 || acknowledgedAlarms.length < alarms.length}>
            Confirm Response
          </button>
          {decisionMade && <p className="text-green-400 mt-2 text-center">All alarms acknowledged! Decision Recorded!</p>}
          {timeLeft === 0 && !decisionMade && <p className="text-red-400 mt-2 text-center">Time Ran Out!</p>}
        </div>
      )}
    </div>
  );
}
