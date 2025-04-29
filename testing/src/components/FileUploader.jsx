function FileUploader({ onChange }) {
    return (
        <input type="file" name="file" accept=".csv" onChange={onChange} />
    );
}

export default FileUploader;