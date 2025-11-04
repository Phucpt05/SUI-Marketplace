import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ConnectBtn from "../common/ConnectBtn";
import { useCurrentAccount } from "@mysten/dapp-kit";

const baseNavItems = [
  {
    label: "Learn",
    href: "/learn",
  },
  {
    label: "Developers",
    href: "/developers-onchain",
  },
  {
    label: "All Developers",
    href: "/developers-offchain",
  },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const account = useCurrentAccount();
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = account ? [
    {
      label: "Profile",
      href: `/profile/${account.address}`,
    },
    ...baseNavItems
  ] : baseNavItems;
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Header */}
        <div className="flex items-center justify-between">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer text-2xl font-bold text-white"
          >
            Dolphinder
          </span>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navItems.map(item => (
              <span
                onClick={() => navigate(item.href)}
                className={`relative cursor-pointer transition-all duration-300 px-4 py-2 rounded-lg font-medium ${
                  location.pathname === item.href
                    ? "text-white bg-white/20 shadow-lg shadow-white/10"
                    : "text-white/90 hover:text-white hover:bg-white/10 hover:scale-105"
                }`}
                key={item.href}
              >
                {item.label}
                {location.pathname === item.href && (
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10"></span>
                )}
              </span>
            ))}
          </nav>

          {/* Desktop Connect Button */}
          <div className="hidden md:block">
            <ConnectBtn />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-6 w-6 flex-col items-center justify-center space-y-1 md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span
              className={`h-0.5 w-6 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            ></span>
            <span
              className={`h-0.5 w-6 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`h-0.5 w-6 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col space-y-3 border-t border-white/10 py-4">
            {navItems.map(item => (
              <span
                onClick={() => {
                  navigate(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`cursor-pointer py-3 px-4 transition-all duration-300 text-left rounded-lg font-medium ${
                  location.pathname === item.href
                    ? "text-white bg-white/20 shadow-lg shadow-white/10 border border-white/20"
                    : "text-white/90 hover:text-white hover:bg-white/10 hover:scale-[1.02]"
                }`}
                key={item.href}
              >
                {item.label}
                {location.pathname === item.href && (
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10"></span>
                )}
              </span>
            ))}
            <div className="border-t border-white/10 pt-4">
              <ConnectBtn />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
