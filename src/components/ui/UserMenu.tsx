// components/ui/UserMenu.tsx
'use client'

import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEmulation } from '../EmulationProvider';
import { theme } from "@/app/theme";

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
  const { emulatedUser, setEmulationByEmail, clearEmulation, loading, error } = useEmulation();
  const [showEmuModal, setShowEmuModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const user = emulatedUser || session?.user;
  const firstAvatarLetter = user?.name?.toLocaleUpperCase().split(' ')[0]?.charAt(0) ?? ""
  const secondAvatarLetter = user?.name?.toLocaleUpperCase().split(' ')[1]?.charAt(0) ?? "";
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
    <div>
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
            {session?.user?.user_role === 'ADMIN' && (
              <button
                onClick={() => { setShowEmuModal(true); setIsOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 flex items-center"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                Emulate User
              </button>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/login?logout=success' })}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {/* Emulation Modal */}
      {showEmuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowEmuModal(false)}>&times;</button>
            <h2 className="text-lg font-bold mb-2">Emulate User</h2>
            {emulatedUser && (
              <div className="mb-2 text-yellow-700 font-semibold">Currently emulating: {emulatedUser.name} ({emulatedUser.email})</div>
            )}
            <input
              type="email"
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Enter user email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              disabled={loading}
            />
            <button
              className={`${theme.colors.primaryBg} ${theme.colors.primaryHoverBg} px-4 py-1 rounded mr-2 disabled:opacity-50`}
              onClick={async () => {
                setSuccessMsg('');
                const ok = await setEmulationByEmail(emailInput);
                if (ok) {
                  setSuccessMsg('Emulation started!');
                  setShowEmuModal(false); // Auto-close modal on successful emulation
                }
              }}
              disabled={loading || !emailInput}
            >
              {loading ? 'Emulating...' : 'Emulate'}
            </button>
            {emulatedUser && (
              <button
                className="ml-2 bg-gray-200 px-3 py-1 rounded"
                onClick={() => { clearEmulation(); setSuccessMsg('Emulation cleared!'); }}
                disabled={loading}
              >
                Clear
              </button>
            )}
            {error && <div className="text-red-600 mt-2">{error}</div>}
            {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
          </div>
        </div>
      )}
      {/* Yellow bar for active emulation */}
      {emulatedUser && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-t-lg shadow-lg z-40">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            Emulating: {emulatedUser.name} ({emulatedUser.email})
            <button
              className="ml-2 text-yellow-800 hover:text-yellow-900"
              onClick={() => { clearEmulation(); setSuccessMsg('Emulation cleared!'); }}
              disabled={loading}
            >
              <u>Stop</u>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}