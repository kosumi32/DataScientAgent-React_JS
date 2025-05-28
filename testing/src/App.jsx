import { useState } from 'react'
import './App.css'
import axios from 'axios';

import FileUploader from './components/FileUploader';
import DisplayResult from './components/DisplayResult';
import RequestInput from './components/RequestInput';
import DisplayPlot from './components/DisplayPlot';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(" ");
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [plot, setPlot] = useState(null);

  const handleFileChange = (event) => {
       setFile(event.target.files[0]);
  };

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
      setPlot(respond.data.plot);
      setError(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Falsed to analyze dataset.");
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
        
      <FileUploader onChange={handleFileChange}/>
      <RequestInput/>

      {/* disable- while loading, button is disabled */}
      <button type="submit" disabled= {loading}> {loading ? "Analyzing the file..." : "Analyze Dataset"}</button>
    </form>

      {file && <p>Selected file: {file.name}</p>}

      <DisplayResult result={result} error={error} />
      <DisplayPlot plot={plot} error={error} />
    </>
  )
}

export default App
