import { useState } from 'react'
import './App.css'
import axios from 'axios';

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

    const requestText= document.querySelector("textarea[name=request]").value;
    formData.append('request', requestText);

    try {
      // uses axios to send a POST request (send data) to the server
      // await- wait until a response is received
      // syntax for axios form post request
      const respond= await axios.post("/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // result from the server
      setResult(respond.data.response);
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

      <form onSubmit= {(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        
        <input type="file" name="file" accept='.csv' onChange={handleFileChange}/>
      

      {/* Gemini-style input form */}
    <div className="gemini-input-container">
      <textarea
        name= "request"
        placeholder="Ask me anything about your dataset..."
        rows="3"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
          resize: "none",

        }}
      ></textarea>
    </div>

      {/* disable- while loading, button is disabled */}
      <button type="submit" disabled= {loading}> {loading ? "Analyzing the file..." : "Analyze Dataset"}</button>
    </form>

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
