"use client";

export default function ListingImage({ src, alt, imgClassName, noImageClassName }) {
  const isInvalidSrc = !src || 
    src === "/null" || 
    src === "/undefined" || 
    src.endsWith("/null") || 
    src.endsWith("/undefined") ||
    src.trim() === "" ||
    src.trim() === "/";

  const fallback = (
    <div 
      className={noImageClassName} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    >
      <span style={{ fontSize: '32px' }}>📷</span>
      <span style={{ marginTop: '8px', fontSize: '14px', fontWeight: '500' }}>No image</span>
    </div>
  );

  if (isInvalidSrc) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {fallback}
      </div>
    );
  }

  const safeSrc = src.replace(/"/g, '&quot;');
  const safeAlt = (alt || "Listing Image").replace(/"/g, '&quot;');
  const safeClass = (imgClassName || "").replace(/"/g, '&quot;');

  const imgHtml = `<img src="${safeSrc}" alt="${safeAlt}" class="${safeClass}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;" onerror="this.style.opacity='0';" />`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {fallback}
      <div 
        dangerouslySetInnerHTML={{ __html: imgHtml }} 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
        suppressHydrationWarning={true}
      />
    </div>
  );
}
