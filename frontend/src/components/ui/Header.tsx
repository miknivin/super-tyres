import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"; // ← adjust path to your logo file

export default function Header() {
  return (
    <>
      <>
        <nav className="bg-white border-gray-200 sticky top-0 z-50 w-full shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-full px-3">
            <Link
              to={"/"}
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img
                src={logo}
                alt="Super Tyres Logo"
                className="w-14 h-14 object-contain drop-shadow-md"
              />
            </Link>
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <a
                href="#"
                className="text-sm  text-red-600 dark:text-red-500 hover:underline"
              >
                Sign out
              </a>
            </div>
          </div>
        </nav>
      </>
    </>
  );
}
