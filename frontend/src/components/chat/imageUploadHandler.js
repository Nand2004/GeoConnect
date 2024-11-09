import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { BsImage, BsX } from 'react-icons/bs';

const ImageUploadHandler = ({ onImageSubmit, chatId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !chatId) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('chatId', chatId);
    formData.append('name', selectedImage.name);
    formData.append('mimeType', selectedImage.type);

    try {
      const response = await fetch('http://localhost:8081/image/createImage', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onImageSubmit({
          type: data.imageUrl,
          name: selectedImage.name,
          mimeType: selectedImage.type
        });
        clearImage();
      } else {
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex align-items-center gap-2">
        <Button
          variant="outline-secondary"
          className="position-relative p-2"
          style={{ width: '40px', height: '40px' }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="position-absolute top-0 start-0 opacity-0 w-100 h-100"
            style={{ cursor: 'pointer' }}
          />
          <BsImage />
        </Button>
        
        {selectedImage && (
          <div className="d-flex align-items-center gap-2">
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              size="sm"
            >
              {isUploading ? 'Uploading...' : 'Send'}
            </Button>
            <Button
              variant="link"
              className="p-0 text-danger"
              onClick={clearImage}
            >
              <BsX size={20} />
            </Button>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="position-relative" style={{ maxWidth: '200px' }}>
          <img
            src={previewUrl}
            alt="Preview"
            className="rounded img-fluid"
            style={{ maxHeight: '200px', objectFit: 'contain' }}
          />
          <small className="text-muted d-block mt-1">
            {selectedImage?.name}
          </small>
        </div>
      )}
    </div>
  );
};

export default ImageUploadHandler;