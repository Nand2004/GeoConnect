import React from 'react';
import { Button } from 'react-bootstrap';
import { BsImage } from 'react-icons/bs';

function ImageUploadHandler({ 
  selectedImage, 
  handleImageChange, 
  clearImageSelection 
}) {
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
            onChange={handleImageChange}
            className="position-absolute top-0 start-0 opacity-0 w-100 h-100"
            style={{ cursor: 'pointer' }}
          />
          <BsImage />
        </Button>
        {selectedImage && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={clearImageSelection}
          >
            Clear Image
          </Button>
        )}
      </div>

      {selectedImage && (
        <div className="position-relative">
          <img
            id="imagePreview"
            alt="Selected"
            className="rounded"
            style={{ maxWidth: "180px", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploadHandler;