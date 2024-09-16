const loadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h16 w16 border-t-4 border-slate-500 border-solid"></div>
    </div>
  );
};

export default loadingSpinner;
