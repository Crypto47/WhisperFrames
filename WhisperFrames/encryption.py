from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives import hashes
import os

def encrypt_message(message, key):
    # Generate a random IV (Initialization Vector)
    iv = os.urandom(16)
    
    # Pad the message to be a multiple of 16 bytes (AES block size)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(message.encode()) + padder.finalize()
    
    # Create AES cipher with CBC mode
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    
    # Encrypt the padded data
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()
    
    return iv + ciphertext

def decrypt_message(ciphertext, key):
    # Extract IV from the ciphertext
    iv = ciphertext[:16]
    ciphertext = ciphertext[16:]
    
    # Create AES cipher with CBC mode
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    
    # Decrypt the ciphertext
    padded_data = decryptor.update(ciphertext) + decryptor.finalize()
    
    # Unpad the data
    unpadder = padding.PKCS7(128).unpadder()
    message = unpadder.update(padded_data) + unpadder.finalize()
    
    return message.decode()

# Example usage:
if __name__ == "__main__":
    message = "Hello, this is a secret message!"
    key = os.urandom(32)  # 32 bytes for 256-bit key

    encrypted_message = encrypt_message(message, key)
    print("Encrypted:", encrypted_message)

    key = os.urandom(32)
    
    decrypted_message = decrypt_message(encrypted_message, key)
    print("Decrypted:", decrypted_message)
