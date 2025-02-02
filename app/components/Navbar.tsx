"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    setUserType(null);
    router.push("/");
  };

  const navItems = [
    { name: "Home", href: "/", allowedUsers: ["user", "admin"] },
    { name: "Display", href: "/display", allowedUsers: ["user", "admin"] },

    { name: "Bet", href: "/bet", allowedUsers: ["user"] },
    { name: "Profile", href: "/profile", allowedUsers: ["user"] },
    { name: "Leaderboard", href: "/leaderboard", allowedUsers: ["user", "admin"] },
    { name: "Listing", href: "/listing", allowedUsers: ["admin"] },
    { name: userType ? "Admin" : "Login", href: userType ? "/admin" : "/login", allowedUsers: ["admin"] },
  ];

  // Filter nav items based on userType
  const filteredNavItems = navItems.filter((item) => {
    if (userType === "user") {
      // Admin-related items should be hidden for a normal user
      return item.allowedUsers.includes("user");
    }
    if (userType === "admin") {
      // Hide "Your Bets" for admin and show "Listing"
      return item.allowedUsers.includes("admin") || item.allowedUsers.includes("user");
    }
    // If no userType, only show public items
    return item.allowedUsers.includes("user") || item.allowedUsers.includes("admin");
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              f!nesse
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    pathname === item.href
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {userType && (
                <Button onClick={handleLogout} variant="outline" size="sm" className="text-black border-black">
                  Logout
                </Button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {userType && (
              <Button onClick={handleLogout} variant="outline" size="sm" className="w-full mt-2">
                Logout
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
