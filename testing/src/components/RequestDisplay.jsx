function RequestDisplay({result, error}) {
    return (
        <>
            {/* x && y, if x is true then y */}
            {error && <p style={{ color: "red" }}>
                {error}</p>}

            {result && (
            <div style={{ whiteSpace: "pre-wrap", marginTop: "2rem" }}>

          <h3>📊 AI Response</h3>
          <p>{result}</p>
            </div>
        )}
        </>
    )
}

export default RequestDisplay;