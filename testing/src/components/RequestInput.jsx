function RequestInput() {
    return (
        <div className="gemini-input-container">
            
            <textarea
                name="request"
                placeholder="Ask me anything about your dataset..."
                rows={4}
                cols={50}

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
    )
}

export default RequestInput;