import argparse
import requests
import json
from pathlib import Path

def encode_image(image_path, text, encrypt):
    url = "http://127.0.0.1:5000/encode/"
    files = {'image': open(image_path, 'rb')}
    data = {'text': text, 'encrypt': str(encrypt).lower()}
    response = requests.post(url, files=files, data={'data': json.dumps(data)}, timeout=120)
    
    if response.status_code == 200:
        encoded_image_path = Path(image_path).stem + "_encoded.png"
        with open(encoded_image_path, 'wb') as f:
            f.write(response.content)
        print(f"Encoded image saved to {encoded_image_path}")
    else:
        print("Failed to encode image:", response.text)

def decode_image(image_path, encrypt):
    url = "http://127.0.0.1:5000/decode/"
    files = {'image': open(image_path, 'rb')}
    data = {'encrypt': str(encrypt).lower()}
    response = requests.post(url, files=files, data={'data': json.dumps(data)}, timeout=120)

    if response.status_code == 200:
        print("Decoded text:", response.json().get('text', 'No text found'))
    else:
        print("Failed to decode image:", response.text)

def main():
    parser = argparse.ArgumentParser(description="Encode and decode messages in images")
    subparsers = parser.add_subparsers(dest='command', help='Commands: encode, decode')

    encode_parser = subparsers.add_parser('encode', help='Encode a message in an image')
    encode_parser.add_argument('image_path', type=str, help='Path to the image file')
    encode_parser.add_argument('text', type=str, help='Text message to encode')
    encode_parser.add_argument('--encrypt', action='store_true', help='Encrypt the message')

    decode_parser = subparsers.add_parser('decode', help='Decode a message from an image')
    decode_parser.add_argument('image_path', type=str, help='Path to the encoded image file')
    decode_parser.add_argument('--encrypt', action='store_true', help='Specify if the message is encrypted')

    args = parser.parse_args()

    if args.command == 'encode':
        encode_image(args.image_path, args.text, args.encrypt)
    elif args.command == 'decode':
        decode_image(args.image_path, args.encrypt)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
