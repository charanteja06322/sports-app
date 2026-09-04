const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
