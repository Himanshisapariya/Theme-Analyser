
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    const res = await axios.post('http://localhost:5000/scan', formData);

    setReport(res.data);
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', background: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1>Shopify CSS Cleaner</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        onClick={handleScan}
        style={{
          marginLeft: '10px',
          padding: '10px 20px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Scan CSS
      </button>

      {loading && <p>Scanning...</p>}

      {report && (
        <div style={{ marginTop: '30px' }}>
          <h2>Report</h2>

          <p>Total Rules: {report.totalRules}</p>
          <p>Unused Rules: {report.unusedRules}</p>
          <p>Estimated Savings: {report.estimatedSavings}</p>

          <table border="1" cellPadding="10" style={{ marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Selector</th>
                <th>File</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {report.report.map((item, index) => (
                <tr key={index}>
                  <td>{item.selector}</td>
                  <td>{item.file}</td>
                  <td>{item.status}</td>
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
