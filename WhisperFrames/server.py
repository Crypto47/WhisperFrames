from flask import Flask, request, send_file, jsonify, Response
from steganogan import SteganoGAN
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
import os, base64, json, hashlib
from flask_cors import CORS

steganogan = SteganoGAN.load(path='models/Whisperer.steg')

app = Flask(__name__)
CORS(app)

word_bytes = b'whisperframes'
sha256_digest = hashlib.sha256(word_bytes).digest()
SECRET_KEY  = sha256_digest[:32]  # This should be a 16, 24, or 32 byte key for AES

def encrypt_text(plain_text, key=SECRET_KEY):
    cipher = AES.new(key, AES.MODE_CBC)
    ct_bytes = cipher.encrypt(pad(plain_text.encode('utf-8'), AES.block_size))
    iv = base64.b64encode(cipher.iv).decode('utf-8')
    ct = base64.b64encode(ct_bytes).decode('utf-8')
    return iv + ct

def decrypt_text(encrypted_text, key=SECRET_KEY):
    try:
        iv = base64.b64decode(encrypted_text[:24])
        ct = base64.b64decode(encrypted_text[24:])
        cipher = AES.new(key, AES.MODE_CBC, iv)
        pt = unpad(cipher.decrypt(ct), AES.block_size)
        return pt.decode('utf-8')
    except:
        return None

@app.route("/")
def read_root():
    return jsonify({"message": "Hello, World!"})  # Return JSON response

@app.route('/encode/', methods=['POST'])
def encode_message():
    if 'image' not in request.files:
        return jsonify({'error': 'Image is required.'}), 400

    image_file = request.files['image']
    data = request.form.get('data')
    
    if not data:
        return jsonify({'error': 'Text data is required.'}), 400
    
    data = json.loads(data)
    text = data.get('text')
    encrypt = data.get('encrypt', 'false').lower() == 'true'
    
    if not text:
        return jsonify({'error': 'Text data is required.'}), 400
    
    if encrypt:
        text = encrypt_text(text)
    
    image_path = 'temp_input.png'
    image_file.save(image_path)
    
    output_path = 'encoded_output.png'
    steganogan.encode(image_path, output_path, text)
    
    with open(output_path, 'rb') as f:
        encoded_image = f.read()
    
    os.remove(image_path)
    os.remove(output_path)
    
    return Response(encoded_image, mimetype='image/png'), 200

@app.route("/decode/", methods=['POST'])
def decode_message():
    if 'image' not in request.files:
        return jsonify({'error': 'Image data is required.'}), 400

    image_file = request.files['image']
    data = request.form.get('data')
    
    if not data:
        return jsonify({'error': 'Data is required.'}), 400
    
    data = json.loads(data)
    encrypt = data.get('encrypt', 'false').lower() == 'true'
    
    image_path = 'temp_input.png'
    image_file.save(image_path)
    
    decoded_text = steganogan.decode(image_path)
    os.remove(image_path)
    
    if encrypt:
        decrypted_text = decrypt_text(decoded_text)
        if decrypted_text is not None:
            decoded_text = decrypted_text
    
    return jsonify({'text': decoded_text})

if __name__ == "__main__":
    app.run(debug=True)
