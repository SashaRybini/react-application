import React, { useState } from 'react';
import { Button, Input, Typography } from '@mui/material';
import appFirebase from '../../config/firebase-config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const FilePicker = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
  
    const handleFileChange = (event: any) => {
      if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
      }
    };
  
    const handleUpload = async () => {
      if (!file) return;
  
      const storage = getStorage(appFirebase); // Get a reference to Firebase Storage
      const storageRef = ref(storage, file.name); // Reference to Firebase Storage
  
      try {
        await uploadBytes(storageRef, file); // Upload the file
        const downloadURL = await getDownloadURL(storageRef); // Get the download URL
        setFileUrl(downloadURL);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <Button variant="contained" component="span">
          Upload File
        </Button>
      </label>
      {file && <Typography variant="subtitle1">Selected File: {file.name}</Typography>}
      {fileUrl && (
        <div>
          <Typography variant="subtitle1">File URL:</Typography>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileUrl}
          </a>
        </div>
      )}
      {file && (
        <Button variant="contained" onClick={handleUpload}>
          Upload
        </Button>
      )}
    </div>
  );
};

export default FilePicker;
