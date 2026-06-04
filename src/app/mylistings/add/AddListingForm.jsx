'use client';

import { useActionState, useState } from 'react';
import { createListing } from '../../../../library/actions';
import './addlisting.css';

export default function AddListingForm({ userLocation, categories = [] }) {
  const [state, formAction, isPending] = useActionState(createListing, null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="add-listing-form-card">
      {state?.error && (
        <div className="form-error">{state.error}</div>
      )}
      {state?.success && (
        <div className="form-success">{state.success}</div>
      )}

      <form action={formAction}>
        {/* Title */}
        <div className="form-group">
          <label>
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            name="title"
            className="form-input"
            placeholder="e.g. iPhone 15 Pro Max"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="content"
            className="form-input"
            placeholder="Describe your item in detail..."
          />
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label>
            Photo <span className="required">*</span>
          </label>
          <label className="image-upload-zone" htmlFor="image-upload">
            {preview ? (
              <img src={preview} alt="Preview" className="image-upload-preview" />
            ) : (
              <div className="image-upload-placeholder">
                <span className="image-upload-icon">📷</span>
                <span className="image-upload-text">Click to upload an image</span>
                <span className="image-upload-hint">JPG, PNG, WEBP up to 10MB</span>
              </div>
            )}
            <input
              id="image-upload"
              type="file"
              name="image"
              accept="image/*"
              required
              className="image-upload-input"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Price & Category */}
        <div className="form-row">
          <div className="form-group">
            <label>
              Price (€) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="price"
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category_id" className="form-input">
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location — pre-filled with user's location */}
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            className="form-input"
            placeholder="e.g. Bratislava"
            defaultValue={userLocation || ''}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="form-submit-btn"
        >
          {isPending ? 'Publishing...' : 'Publish Listing'}
        </button>
      </form>
    </div>
  );
}
