function DisplayPlot({ plot, error }) {
  return (
    <>
      {error && <p style={{ color: "red" }}>
        {error}
      </p>}

      {plot && <div>
            <h3>Generated Plot</h3>
            <img src={"http://localhost:5000${plot}"} alt="Generated Plot" style={{ maxWidth: "100%", height: "auto" }} />
      </div> }
    </>
  );
}

export default DisplayPlot;