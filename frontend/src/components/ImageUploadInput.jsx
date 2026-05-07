import { useState } from 'react';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

const ImageUploadInput = ({ onImagesChange, currentImages = [], maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewUrls, setPreviewUrls] = useState(currentImages);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const totalImages = previewUrls.length + files.length;
    if (totalImages > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed. You have ${previewUrls.length} selected, trying to add ${files.length} more.`);
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(f => !f.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setUploadError(`${invalidFiles.length} file(s) are not valid images. Only JPG, PNG, WebP, GIF allowed.`);
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const uploadedUrls = [];
      for (const file of files) {
        try {
          const url = await uploadImageToCloudinary(file);
          uploadedUrls.push(url);
        } catch (error) {
          setUploadError(prev => 
            prev ? `${prev}\n❌ ${file.name}: ${error.message}` : `❌ ${file.name}: ${error.message}`
          );
        }
      }

      if (uploadedUrls.length > 0) {
        const newUrls = [...previewUrls, ...uploadedUrls];
        setPreviewUrls(newUrls);
        onImagesChange(newUrls);
      }
    } catch (error) {
      setUploadError(
        error.message || 
        'Upload failed. Check IMAGE_UPLOAD_SETUP.md for Cloudinary configuration instructions.'
      );
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    onImagesChange(newUrls);
    setUploadError('');
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label className="muted" style={{ display: 'block', marginBottom: '8px' }}>
        Place images ({previewUrls.length}/{maxImages})
      </label>

      {uploadError && (
        <div 
          style={{ 
            color: '#b91c1c', 
            margin: '0 0 8px', 
            fontSize: '0.9rem',
            padding: '8px 12px',
            background: 'rgba(185, 28, 28, 0.08)',
            border: '1px solid rgba(185, 28, 28, 0.2)',
            borderRadius: '6px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {uploadError}
        </div>
      )}

      <div style={{ marginBottom: '12px' }}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading || previewUrls.length >= maxImages}
          className="field"
          style={{ marginBottom: '8px' }}
        />
        {uploading && (
          <p className="muted" style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>
            ⏳ Uploading to Cloudinary...
          </p>
        )}
        {previewUrls.length >= maxImages && !uploading && (
          <p className="muted" style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#ea580c' }}>
            Maximum images reached. Remove an image to add more.
          </p>
        )}
      </div>

      {previewUrls.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(80px, 20vw, 100px), 1fr))', gap: 'clamp(6px, 1.5vw, 8px)' }}>
          {previewUrls.map((url, index) => (
            <div key={index} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#f0f0f0', border: '1px solid var(--border)', aspectRatio: '1' }}>
              <img
                src={url}
                alt={`preview-${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={uploading}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => !uploading && (e.target.style.background = 'rgba(0, 0, 0, 0.85)')}
                onMouseOut={(e) => !uploading && (e.target.style.background = 'rgba(0, 0, 0, 0.7)')}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {previewUrls.length === 0 && !uploading && (
        <p className="muted" style={{ margin: '8px 0 0', fontSize: '0.9rem', fontStyle: 'italic' }}>
          Select 1-{maxImages} images to get started
        </p>
      )}
    </div>
  );
};

export default ImageUploadInput;
