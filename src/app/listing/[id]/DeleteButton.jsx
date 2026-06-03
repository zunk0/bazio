'use client';

export default function DeleteButton({ id, deleteAction }) {
  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      e.target.form.requestSubmit();
    }
  };

  return (
    <button type="button" onClick={handleDelete} className="admin-action-btn admin-delete-btn">
      🗑 Delete Listing
    </button>
  );
}
