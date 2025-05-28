from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai

import pathlib
import textwrap

from IPython.display import display
from IPython.display import Markdown

# Secure API key
from dotenv import load_dotenv
import os
import pandas as pd
import matplotlib.pyplot as plt

app = Flask(__name__)
# Allowing reuests from other places, specificying the frontend URL
CORS(app, origins=["http://localhost:5173"])


def to_markdown(text):
    # bullet symbol • -> *
  text = text.replace('•', '  *')
    # wraps text starting with > -> blockquote in Markdown
    # predicate=lambda _: True- apply to everyline
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))



# Load enviroment variable from .env file
# load_dotenv("geminiAPI.env", override=True)

# Fetch API key
# GOOGLE_API_KEY= os.getenv("GOOGLE_API_KEY")


if not GOOGLE_API_KEY:
    print("Error: API key not found.")

# Using the API key
genai.configure(api_key= GOOGLE_API_KEY)

# using model
model= genai.GenerativeModel("gemini-2.0-flash-lite")


# Set up the upload folder
app.config["UPLOAD_FOLDER"] = "static"  # Whenever someone uploads a file, I will save it inside the static/ folder
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)   # Ensure the directory exists


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
        5. **Data Visualization** (Python code blocks for analysis and visualization using matplotlib/seaborn)
        6. **Summary** (insights based on the user's request in plain language) 
        
        "Please format the answer in this structure:
          "Overview"
          "Insights"
          "Code Blocks (Python)"
          "Visuals (if applicable, include code for matplotlib or seaborn)"
          "Summary""
    '''


def capture_plot(code_string):
   try:
      global_scope= {
         "pd": pd,
         "plt": plt,
         "sns": __import__("seaborn"),
      }
      local_scope= {}
      exec(code_string, global_scope, local_scope)      # Capture the plot and save it to a file

      img_path= os.path.join(app.config["UPLOAD_FOLDER"], "plot.png")
      plt.savefig(img_path)  # Save the plot to a file
      plt.close()  # Close the plot to free up memory
      return "static/plot.png"  # Return the path to the saved plot
   
   except Exception as e:
      return jsonify({"error": str(e)}), 500

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

      # print(f"GOOGLE API KEY IS: {GOOGLE_API_KEY}")
      response= model.generate_content(prompt)

      # extract code from response
      code_start = response.text.find("```python")
      code_end = response.text.find("```", code_start + 1)
      
      img_path= None
      if code_start != -1 and code_end != -1:
            code_block = response.text[code_start + 9:code_end].strip()
            image_path = capture_plot(code_block)

      return jsonify({"response": response.text, "plot": image_path})
    
    except Exception as e:
      return jsonify({"error": str(e)}), 500

@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

if __name__ in "__main__":
    app.run(debug=True)

