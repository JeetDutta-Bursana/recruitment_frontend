const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-6 mt-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left: Branding */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold">Recruitment_E2E</h3>
          <p className="text-sm text-blue-200">Automating your hiring journey.</p>
        </div>

        {/* Middle: Quick Links */}
        <div className="flex space-x-6 text-sm">
          <a href="/" className="hover:underline">Home</a>
          {/* <a href="/add-job" className="hover:underline">Add Job</a>
          <a href="/jd-generator" className="hover:underline">JD Generator</a>
          <a href="/dashboard" className="hover:underline">Dashboard</a> */}
        </div>

        {/* Right: Copyright */}
        <div className="text-sm text-blue-200 text-center md:text-right">
          © {new Date().getFullYear()} Recruitment_E2E. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;