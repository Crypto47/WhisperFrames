import React, { useState } from 'react';
import axios from 'axios';

const Encode = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [textMessage, setTextMessage] = useState('');
  const [receivedImage, setReceivedImage] = useState(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [encryption, setEncryption] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUploadedImage(file);
  };

  const handleTextChange = (e) => {
    setTextMessage(e.target.value);
  };

  const handleEncryptToggle = () => {
    setEncryption(!encryption);
  };

  const handleEncodeMessage = async () => {
    if (!uploadedImage || !textMessage) return;

    const formData = new FormData();
    formData.append('image', uploadedImage);
    formData.append('data', JSON.stringify({ text: textMessage, encrypt: encryption.toString() }));

    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://127.0.0.1:5000/encode/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer', // Set responseType to arraybuffer to receive binary data
      });

      console.log(response.data);

      // Create a blob from the arraybuffer response data
      const blob = new Blob([response.data], { type: 'image/png' });

      // Create an object URL from the blob
      const url = URL.createObjectURL(blob);
      setReceivedImage(url);
      setShowDownloadButton(true);
    } catch (error) {
      console.error('Error encoding image:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = receivedImage;
    link.download = 'encoded_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setReceivedImage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-800">
      <div className="flex flex-col items-center justify-evenly w-2/4 h-2/3 p-6 bg-zinc-900 rounded-lg shadow-lg">
        <label
          htmlFor="upload-button"
          className="w-2/4 h-2/4 border border-solid border-gray-300 flex items-center justify-center rounded-lg mb-4 cursor-pointer shadow-md bg-gray-700"
        >
          <input
            type="file"
            id="upload-button"
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="btn">Upload cover image</p>
        </label>
        {uploadedImage && <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded" className="mb-4 rounded-lg object-contain h-2/4 w-2/4" />}
        
        <textarea
          value={textMessage}
          onChange={handleTextChange}
          placeholder="Enter text to encode"
          className="mb-4 p-2 w-full h-24 rounded-lg bg-gray-700 text-teal-500 font-bold"
        />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <label className="cursor-pointer relative h-[2.1em] w-[4.2em] rounded-full bg-[hsl(0,0%,7%)] shadow-[0px_1.44px_2.88px_0px_rgb(18,18,18,0.25),0px_2.88px_5.76px_0px_rgb(18,18,18,0.35)]">
              <span className="absolute inset-[0.072em] rounded-full border-[0.72px] border-[hsl(0,0%,25%)]"></span>
              <div className="absolute left-[0.36em] top-1/2 flex h-[1.44em] w-[1.44em] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[inset_0px_1.44px_1.44px_0px_hsl(0,0%,85%)]">
                <div className="h-[1.08em] w-[1.08em] rounded-full bg-[hsl(0,0%,7%)] shadow-[0px_1.44px_1.44px_0px_hsl(0,0%,85%)]"></div>
              </div>
              <div className="absolute right-[0.36em] top-1/2 h-[0.18em] w-[1.08em] -translate-y-1/2 rounded-full bg-[hsl(0,0%,50%)] shadow-[inset_0px_1.44px_0.72px_0px_hsl(0,0%,40%)]"></div>
              <input
                className="peer h-[0.72em] w-[0.72em] opacity-0"
                id="encrypt-toggle"
                type="checkbox"
                checked={encryption}
                onChange={handleEncryptToggle}
              />
              <span className="absolute left-[0.18em] top-1/2 flex h-[1.8em] w-[1.8em] -translate-y-1/2 items-center justify-center rounded-full bg-[rgb(26,26,26)] shadow-[inset_2.88px_2.88px_2.88px_0px_rgba(64,64,64,0.25),inset_-2.88px_-2.88px_2.88px_0px_rgba(16,16,16,0.5)] duration-300 peer-checked:left-[calc(100%-1.98em)]">
                <span className="relative h-full w-full rounded-full">
                  <span className="absolute inset-[0.072em] rounded-full border-[0.72px] border-[hsl(0,0%,50%)]"></span>
                </span>
              </span>
            </label>
            <span className="px-6 font-bold text-teal-500">Encrypt</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button onClick={handleEncodeMessage} className="button">
            Encode
          </button>
        </div>

        {loading && <p className="text-white">Processing... Please wait.</p>}

        {receivedImage && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white p-6 rounded-lg shadow-lg flex justify-center" onMouseEnter={() => setShowDownloadButton(true)}
                onMouseLeave={() => setShowDownloadButton(false)}>
              <img
                src={receivedImage}
                alt="Received"
                className="mb-4 rounded-lg object-contain h-2/4 w-2/4"
                
              />
              {showDownloadButton && (
                <button
                  onClick={handleDownloadImage}
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black px-4 py-1 text-white rounded"
                >
                  <p className='font-bold text-teal-500'>Download</p>
                </button>
              )}
              <button onClick={handleClose} className="absolute top-2 right-2 bg-white text-black font-bold rounded-full px-3 py-1">
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Encode;
