import { useState } from 'react'
import './App.css'


function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(" ");
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    // event.target- <input type="file" /> element
    setFile(event.target.files[0]);
  }

  // handle file upload, if sending (disable button clicking)
  const handleSubmit = async () => {

    if (!file) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);

    // formData- send form data to the server (key-value pair)
    const formData = new FormData();
    formData.append('file', file);

    try {
      // uses axios to send a POST request (send data) to the server
      // await- wait until a response is received
      // syntax for axios form post request
      const respond= await axios.post("http://localhost:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // result from the server
      setResult(respond.data.result);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Data Science Agent</h1>
      <input type="file" accept='.csv' onChange={handleFileChange}/>

      {/* disable- while loading, button is disabled */}
      <button onClick={handleSubmit} disabled= {loading}> {loading ? "Analyzing the file..." : "Analyze Dataset"}</button>

      {file && <p>Selected file: {file.name}</p>}

      {/* x && y, if x is true then y */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div style={{ whiteSpace: "pre-wrap", marginTop: "2rem" }}>
          <h3>📊 AI Response</h3>
          <p>{result}</p>
        </div>
        )}
    </>
  )
}

export default App
