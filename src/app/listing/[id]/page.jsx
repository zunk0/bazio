async function ListingDetail({ params }) {
  const { id } = await params;

  return (
    <div>
      <h1>Detail inzerátu</h1>
      <p>ID: {id}</p>
    </div>
  );
}

export default ListingDetail

