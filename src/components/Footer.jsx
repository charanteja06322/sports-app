const Footer = () => {
  return (
    <footer className="border-t mt-8">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} SportsApp. All rights reserved.
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            Terms of Service
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
