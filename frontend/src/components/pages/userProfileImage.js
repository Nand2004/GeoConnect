import React, { useState } from "react";
import AWS from "aws-sdk";

const S3Uploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
  
    const handleFileSelect = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleUpload = () => {
      if (!selectedFile) {
        alert("Please select a file to upload.");
        return;
      }
  
      // Create an S3 client
      const s3 = new AWS.S3({
        accessKeyId: "AKIASECQWNHKZ4ZD62J7", // Replace with your AWS access key ID
        secretAccessKey: "fXPZD7mIwiIFr6a2+TF7pcPPrR7+xNTi3huL0qBw", // Replace with your AWS secret access key
        region: "us-east-2", // Replace with your S3 bucket's region
      });
  
      // Configure the S3 upload parameters
      const params = {
        Bucket: "imagestoragebuckethotwheelsproject", // Replace with your S3 bucket name
        Key: selectedFile.name,
        Body: selectedFile,
      };
  
      // Upload the file to S3
      s3.upload(params, {
        // Handle the progress of the upload
        // and update the uploadProgress state
        partSize: 5 * 1024 * 1024, // 5 MB
        queueSize: 1,
      })
        .on("httpUploadProgress", (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          setUploadProgress(percent);
        })
        .send((err, data) => {
          if (err) {
            console.error("Failed to upload file:", err);
            alert("Failed to upload file. Please try again.");
          } else {
            console.log("File uploaded successfully:", data);
            alert("File uploaded successfully!");
            // Reset state after successful upload
            setSelectedFile(null);
            setUploadProgress(0);
          }
          setUploading(false);
        });
  
      setUploading(true);
    };
  
    return (
      <div style={{ textAlign: 'center', paddingTop: "10px", fontFamily: 'Montserrat' , backgroundColor: '#0c0c1f', paddingBottom: '15px', paddingTop: '15px', minHeight: '100vh', color: 'white' }}>
        <br></br>
        <h3>Upload Image Style</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        {selectedFile && (
          <div>
            <p>Selected File: {selectedFile.name}</p>
            <p>Size: {selectedFile.size} bytes</p>
            {uploading && (
              <div>
                <p>Uploading...</p>
                <progress value={uploadProgress} max={100} />
              </div>
            )}
            <button onClick={handleUpload} disabled={uploading}>
              Upload
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default S3Uploader;