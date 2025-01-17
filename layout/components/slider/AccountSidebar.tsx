import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaShoppingBag, FaFileInvoiceDollar } from "react-icons/fa";
import useSelector from "@hooks/use-selector";
import { generateFallbackAvatar } from "@utils/helpers";

const AccountSidebar = () => {
  const userData = useSelector((state) => state.user);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isProfileSection =
    pathname === "/account" || pathname === "/account/change-password";

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3 justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={
                userData?.avatar_url === null ||
                userData?.avatar_url === undefined ||
                userData?.avatar_url === ""
                  ? generateFallbackAvatar(userData?.email!)
                  : userData?.avatar_url
              }
              alt="avatar"
              loading="lazy"
              className="w-12 h-12"
            />
          </div>
          <div>
            <h2 className="font-medium">{userData?.name}</h2>
          </div>
        </div>
      </div>

      <nav className="py-4 menu-account">
        <ul className="">
          <li className="group">
            <div
              className={`flex items-center justify-between p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isProfileSection
                  ? "bg-gray-100 text-blue-600"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="flex items-center space-x-3">
                <FaUser
                  className={`text-lg ${
                    isProfileSection ? "text-blue-600" : "text-gray-600"
                  }`}
                />
                <span className="font-medium">My Account</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  isProfileMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isProfileMenuOpen && (
              <ul className="mt-1 space-y-1">
                <li>
                  <Link
                    href="/account"
                    className={`block py-2 px-10 mx-2 rounded-lg transition-all duration-200 ${
                      isActive("/account")
                        ? "text-blue-600 bg-gray-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/change-password"
                    className={`block py-2 px-10 mx-2 rounded-lg transition-all duration-200 ${
                      isActive("/account/change-password")
                        ? "text-blue-600 bg-gray-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    Change Password
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link
              href="/account/orders"
              className={`flex items-center space-x-3 p-3 mx-2 rounded-lg transition-all duration-200 ${
                isActive("/account/orders")
                  ? "text-blue-600 bg-gray-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <FaShoppingBag
                className={`text-lg ${
                  isActive("/account/orders")
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              />
              <span className="font-medium">My Orders</span>
            </Link>
          </li>

          <li>
            <Link
              href="/account/invoices"
              className={`flex items-center space-x-3 p-3 mx-2 rounded-lg transition-all duration-200 ${
                isActive("/account/invoices")
                  ? "text-blue-600 bg-gray-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <FaFileInvoiceDollar
                className={`text-lg ${
                  isActive("/account/invoices")
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              />
              <span className="font-medium">My Invoices</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AccountSidebar;
