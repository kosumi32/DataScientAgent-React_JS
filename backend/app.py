from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

import pathlib
import textwrap

from IPython.display import display
from IPython.display import Markdown

app = Flask(__name__)
# Allowing reuests from other places, specificying the frontend URL
CORS(app, origins=["http://localhost:5173"])


def to_markdown(text):
    # bullet symbol • -> *
  text = text.replace('•', '  *')
    # wraps text starting with > -> blockquote in Markdown
    # predicate=lambda _: True- apply to everyline
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

# Secure API key
from dotenv import load_dotenv
import os

# Load enviroment variable from .env file
# load_dotenv("geminiAPI.env", override=True)

# Fetch API key
# GOOGLE_API_KEY= os.getenv("GOOGLE_API_KEY")
GOOGLE_API_KEY= "AIzaSyDLUO86YUMzHwVsCLunF2ure9MAlpXwkeI"

if not GOOGLE_API_KEY:
    print("Error: API key not found.")

# Using the API key
genai.configure(api_key= GOOGLE_API_KEY)

# using model
model= genai.GenerativeModel("gemini-2.0-flash-lite")


import pandas as pd

# prompt making
def create_prompt(request ,ds):
    sample_data= ds.head().to_markdown()
    request = request
    
    return f'''

        You are a helpful Data Scientist assistant.
        Based on this user's request: {request}, analyze the following dataset and generate:

        Dataset Preview:
        {sample_data}

        1. **Data Loading Code**
        2. **Data Exploration** 
        3. **Data Cleaning** 
        4. **Data Analysis** 
        5. **Data Visualization**
        6. **Summary** (insights based on the user's request in plain language) 
        
        Return Python code in markdown blocks with explanation.
    '''

# file = request.files["file"]  # Access the uploaded file
# user_request = request.form["request"]  # Access the text input

@app.route("/analyze", methods=["POST"])
def analyze():
    
    file= request.files.get("file")
    user_request= request.form.get("request")

    if not file:
        return jsonify({"error": "No file provided"}), 400
    if not user_request:
        return jsonify({"error": "No request provided"}), 400
    
    try:
      print("File and request received!")
      df = pd.read_csv(file)
      prompt= create_prompt(user_request, df)

      print(f"GOOGLE API KEY IS: {GOOGLE_API_KEY}")
      response= model.generate_content(prompt)
      return jsonify({"response": response.text})
    
    except Exception as e:
      return jsonify({"error": str(e)}), 500


if __name__ in "__main__":
    app.run(debug=True)

