import AttackMap from "./components/AttackMap";
import { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  Upload,
  Database,
  Activity,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [realMonitor, setRealMonitor] = useState(null);
  const [file, setFile] = useState(null);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [geoData, setGeoData] = useState(null);
const [prediction, setPrediction] = useState(null);
const [monitorData, setMonitorData] = useState(null);
const loadRealMonitor = async () => {
  const response = await fetch(
    "http://127.0.0.1:8000/real-monitor"
  );

  const data = await response.json();

  setRealMonitor(data);
};
<button
  onClick={loadRealMonitor}
  className="bg-purple-600 px-5 py-3 rounded-lg"
>
  📡 Scan Live Traffic
</button>
{
  realMonitor && (
    <div className="bg-slate-800 p-6 rounded-xl mt-6">
      <h2>📡 Live Traffic Scan</h2>

      <p>
        Packets Captured:
        {realMonitor.captured}
      </p>

      <p>
        Suspicious:
        {realMonitor.suspicious}
      </p>

      <p>
        Normal:
        {realMonitor.normal}
      </p>
    </div>
  )
}
const loadMonitor = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/live-monitor"
    );

    const data = await response.json();

    setMonitorData(data);
  } catch (error) {
    console.error(error);
  }
};
const runPrediction = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/sample-predict"
    );

    const data = await response.json();

    setPrediction(data);
  } catch (error) {
    console.error(error);
    alert("Prediction Failed");
  }
};
const loadGeoIP = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/geoip"
    );

    const data = await response.json();

    setGeoData(data);
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  loadGeoIP();
  loadMonitor();

  const interval = setInterval(() => {
    loadMonitor();
  }, 5000);

  return () => clearInterval(interval);
}, []);
  const handleUpload = async () => {
    if (!file) {
      alert("Select a dataset first");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze-csv",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    }

    setLoading(false);
  };

  const chartData = result
    ? Object.entries(result.attack_summary).map(
        ([name, count]) => ({
          name,
          count,
        })
      )
    : [];

  const getSeverity = (attack) => {
    if (
      attack === "neptune" ||
      attack === "smurf" ||
      attack === "back"
    )
      return "HIGH";

    if (
      attack === "satan" ||
      attack === "ipsweep" ||
      attack === "portsweep"
    )
      return "MEDIUM";

    return "LOW";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-5xl font-bold mb-10 flex items-center gap-3">
        <Shield size={40} />
        Aegis RL Cyber Defense Platform
      </h1>

<div className="mb-6 flex gap-4">

  <button
    onClick={() =>
      window.open(
        "http://127.0.0.1:8000/generate-report",
        "_blank"
      )
    }
    className="bg-green-600 px-5 py-3 rounded-lg font-bold"
  >
    📄 Download Security Report
  </button>

  <button
    onClick={() =>
      window.open(
        "http://127.0.0.1:8000/export-excel",
        "_blank"
      )
    }
    className="bg-blue-600 px-5 py-3 rounded-lg font-bold"
  >
    📊 Export Excel Report
  </button>

</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

  <div className="bg-green-700 p-5 rounded-xl">
    <h3 className="text-xl font-bold">
      🛡 Security Score
    </h3>
    <p className="text-4xl font-bold mt-2">
      92/100
    </p>
  </div>

  <div className="bg-red-700 p-5 rounded-xl">
    <h3 className="text-xl font-bold">
      🚨 Active Threats
    </h3>
    <p className="text-4xl font-bold mt-2">
      4
    </p>
  </div>

  <div className="bg-blue-700 p-5 rounded-xl">
    <h3 className="text-xl font-bold">
      🌍 Risk Level
    </h3>
    <p className="text-4xl font-bold mt-2">
      LOW
    </p>
  </div>

</div>
      {/* Upload Section */}

      <div className="bg-slate-800 p-6 rounded-xl mb-8">
        <h2 className="text-2xl mb-4 flex items-center gap-2">
          <Upload />
          Upload Dataset
        </h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <br />

        <button
          onClick={handleUpload}
          className="bg-blue-600 px-5 py-2 rounded-lg"
        >
          {loading ? "Analyzing..." : "Analyze Dataset"}
        </button>
      </div>

      {/* Results */}
<div className="bg-slate-800 p-6 rounded-xl mb-8">
  <h2 className="text-2xl mb-4">
    🛡️ Live Attack Analyzer
  </h2>

  <button
    onClick={runPrediction}
    className="bg-red-600 px-5 py-2 rounded-lg"
  >
    Analyze Threat
  </button>
</div>

{
  prediction && (
    <div className="bg-slate-800 p-6 rounded-xl mb-8">

      <h2 className="text-2xl mb-4">
        🚨 Threat Result
      </h2>

      <p>
        Attack Type:
        <strong>
          {" "}
          {prediction.attack_type}
        </strong>
      </p>

      <p>
        Severity:
        <strong>
          {" "}
          {prediction.severity}
        </strong>
      </p>

      <h3 className="mt-4 mb-2">
        Recommended Actions
      </h3>

      <ul className="list-disc pl-5">
        {prediction.solutions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

    </div>
  )
}
      {result && (
        <>
          {/* Summary Cards */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

            <div className="bg-slate-800 p-5 rounded-xl">
              <Database />
              <h3>Total Records</h3>
              <p className="text-3xl font-bold">
                {result.total_records}
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <Activity />
              <h3>Attack Types</h3>
              <p className="text-3xl font-bold">
                {Object.keys(result.attack_summary).length}
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <Shield />
              <h3>Status</h3>
              <p className="text-2xl font-bold text-green-400">
                Protected
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <AlertTriangle />
              <h3>Top Attack</h3>
              <p className="text-2xl font-bold text-red-400">
                {
                  Object.entries(result.attack_summary)
                    .sort((a, b) => b[1] - a[1])[0][0]
                }
              </p>
            </div>

          </div>

          {/* Chart */}

          <div className="bg-slate-800 p-6 rounded-xl mb-8">
            <h2 className="text-2xl mb-4">
              Attack Distribution
            </h2>

            <ResponsiveContainer
              width="100%"
              height={400}
            >
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Threat Intelligence */}

          <div className="bg-slate-800 p-6 rounded-xl mb-8">

            <h2 className="text-2xl mb-4">
              Threat Intelligence
            </h2>

            {Object.entries(result.attack_summary).map(
              ([attack, count]) => (
                <div
                  key={attack}
                  className="border-b border-slate-700 py-3"
                >
                  <p className="font-bold">
                    {attack.toUpperCase()}
                  </p>

                  <p>
                    Count: {count}
                  </p>

                  <p>
                    Severity:{" "}
                    {getSeverity(attack)}
                  </p>
                </div>
              )
            )}
          </div>
{/* Attack History Table */}

<div className="bg-slate-800 p-6 rounded-xl mb-8">

  <h2 className="text-2xl mb-4">
    📋 Attack History
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full border-collapse">

      <thead>
        <tr className="border-b border-slate-600">
          <th className="text-left p-3">Attack Type</th>
          <th className="text-left p-3">Severity</th>
          <th className="text-left p-3">Count</th>
        </tr>
      </thead>

      <tbody>
        {Object.entries(result.attack_summary).map(
          ([attack, count]) => (
            <tr
              key={attack}
              className="border-b border-slate-700"
            >
              <td className="p-3">
                {attack.toUpperCase()}
              </td>

              <td className="p-3">
                {getSeverity(attack)}
              </td>

              <td className="p-3">
                {count}
              </td>
            </tr>
          )
        )}
      </tbody>

    </table>

  </div>

</div>
{geoData && (
  <div className="bg-slate-800 p-6 rounded-xl mb-8">

    <h2 className="text-2xl mb-4">
      🌍 Attack Source Intelligence
    </h2>

    <p className="mb-2">
      <strong>IP:</strong> {geoData.ip}
    </p>

    <p className="mb-2">
      <strong>Country:</strong> {geoData.country}
    </p>

    <p className="mb-2">
      <strong>City:</strong> {geoData.city}
    </p>

    <p className="mb-2">
      <strong>Risk Score:</strong> {geoData.risk_score}%
    </p>

  </div>
)}
{monitorData && (
  <div className="bg-slate-800 p-6 rounded-xl mb-8">

    <h2 className="text-2xl mb-4">
      📡 Live Monitoring
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div className="bg-slate-700 p-4 rounded">
        <h3>Packets Captured</h3>
        <p className="text-3xl font-bold">
          {monitorData.packets}
        </p>
      </div>

      <div className="bg-red-700 p-4 rounded">
        <h3>Suspicious</h3>
        <p className="text-3xl font-bold">
          {monitorData.suspicious}
        </p>
      </div>

      <div className="bg-green-700 p-4 rounded">
        <h3>Normal</h3>
        <p className="text-3xl font-bold">
          {monitorData.normal}
        </p>
      </div>

    </div>

  </div>
)}
          {/* Recommendations */}

          <div className="bg-slate-800 p-6 rounded-xl">

            <h2 className="text-2xl mb-4">
              Recommended Actions
            </h2>
<div className="bg-slate-800 p-6 rounded-xl mt-8">
  <h2 className="text-2xl mb-4">
    🌍 Global Threat Map
  </h2>

  <AttackMap />
</div>
            <ul className="list-disc pl-5 space-y-2">
              <li>Enable WAF Protection</li>
              <li>Configure IDS/IPS Rules</li>
              <li>Enable Rate Limiting</li>
              <li>Monitor Network Traffic</li>
              <li>Block Suspicious IPs</li>
              <li>Review Firewall Policies</li>
            </ul>

          </div>
        </>
      )}
    </div>
  );
}
<div className="bg-slate-800 p-6 rounded-xl mb-8">
  <h2 className="text-2xl mb-4">
    🌍 Global Threat Map
  </h2>

  <AttackMap />
</div>
export default App;