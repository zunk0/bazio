'use client';

import { useActionState, useState } from 'react';
import { updateListing, deleteListing, toggleListingStatus } from '../../../../../library/actions';
import Link from 'next/link';
import '../../add/addlisting.css';

export default function EditListingForm({ listing, categories = [] }) {
  const [state, formAction, isPending] = useActionState(updateListing, null);
  const [preview, setPreview] = useState(listing.image_url || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(listing.image_url || null);
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
        {/* Hidden ID */}
        <input type="hidden" name="id" value={listing.id} />

        {/* Title */}
        <div className="form-group">
          <label>
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            name="title"
            defaultValue={listing.title}
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
            defaultValue={listing.content || ''}
            className="form-input"
            placeholder="Describe your item in detail..."
          />
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label>Photo</label>
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
              className="image-upload-input"
              onChange={handleImageChange}
            />
          </label>
          <p className="image-upload-note">Leave empty to keep current image.</p>
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
              defaultValue={listing.price}
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Category <span className="required">*</span></label>
            <select name="category_id" defaultValue={listing.category_id || ''} className="form-input" required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location <span className="required">*</span></label>
          <select name="location" defaultValue={listing.location || ''} className="form-input" required>
            <option value="">Select a location</option>
            <option value="Bratislavský kraj">Bratislavský kraj</option>
            <option value="Bratislava">Bratislava</option>
            <option value="Trnavský kraj">Trnavský kraj</option>
            <option value="Trnava">Trnava</option>
            <option value="Trenčiansky kraj">Trenčiansky kraj</option>
            <option value="Trenčín">Trenčín</option>
            <option value="Nitriansky kraj">Nitriansky kraj</option>
            <option value="Nitra">Nitra</option>
            <option value="Žilinský kraj">Žilinský kraj</option>
            <option value="Žilina">Žilina</option>
            <option value="Banskobystrický kraj">Banskobystrický kraj</option>
            <option value="Banská Bystrica">Banská Bystrica</option>
            <option value="Prešovský kraj">Prešovský kraj</option>
            <option value="Prešov">Prešov</option>
            <option value="Košický kraj">Košický kraj</option>
            <option value="Košice">Košice</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="form-submit-btn"
        >
          {isPending ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>

    </div>
  );
}
