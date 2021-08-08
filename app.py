from flask import Flask, render_template, jsonify, request
import json
import process

app = Flask(__name__)

# secure our flask app with a secret
sec_file = open('secret.json').read()
secret = json.loads(sec_file)
app.config['SECRET_KEY'] = secret['secret']

# render the chatbot page
@app.route('/', methods=["GET", "POST"])
def index():
    return render_template('index.html', **locals())

# process question get the chatbot respond
# return it as a json
@app.route('/chat', methods=["POST"])
def chatbotResponse():
    if request.method == 'POST':
        question = request.form['question']
        response = process.chatbot_response(question)
        return jsonify({"response": response })

# run local flask server on port 5000
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)