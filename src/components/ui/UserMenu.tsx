// components/ui/UserMenu.tsx
'use client'

import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserMenu({
  onTransactionHistoryClick,
  onPaymentClick,
  onSupportClick,
  onHelpClick,
  onProfileClick,
  onAboutClick,
}: {
  onTransactionHistoryClick: () => void,
  onPaymentClick: () => void,
  onSupportClick: () => void,
  onHelpClick: () => void,
  onProfileClick: () => void,
  onAboutClick: () => void,
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const firstAvatarLetter = session?.user?.name?.toLocaleUpperCase().split(' ')[0]?.charAt(0) ?? ""
  const secondAvatarLetter = session?.user?.name?.toLocaleUpperCase().split(' ')[1]?.charAt(0) ?? "";
  const imageSrc = "https://ui-avatars.com/api/?name=" + firstAvatarLetter + "+" + secondAvatarLetter;
  
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <img
            src={imageSrc}
            alt="User avatar"
            width={32}
            height={32}
            className="object-cover rounded-full"
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <button
            onClick={() => {
              setIsOpen(false);
              onProfileClick();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onPaymentClick();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Buy Credits
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onTransactionHistoryClick();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Transaction History
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onSupportClick();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Support
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onHelpClick();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Help
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onAboutClick();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
          >
            About
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/login?logout=success' })}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}