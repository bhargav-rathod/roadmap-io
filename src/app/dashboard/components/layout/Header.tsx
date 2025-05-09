'use client'

import Link from 'next/link'
import { FiZap, FiMenu, FiChevronRight, FiHome } from 'react-icons/fi'
import UserMenu from '@/components/ui/UserMenu'
import { usePathname } from 'next/navigation'

interface HeaderProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    credits: number
    onPaymentClick: () => void
    onTransactionHistoryClick: () => void
    onBuyCreditsClick: () => void
    onSupportClick: () => void
    onHelpClick: () => void
    onProfileClick: () => void
    onAboutClick: () => void
    roadmapTitle?: string
}

export default function Header({
    sidebarOpen,
    setSidebarOpen,
    credits,
    onPaymentClick,
    onTransactionHistoryClick,
    onBuyCreditsClick,
    onSupportClick,
    onHelpClick,
    onProfileClick,
    onAboutClick,
    roadmapTitle
}: HeaderProps) {
    const pathname = usePathname()

    const generateBreadcrumbs = () => {
        const paths = pathname.split('/').filter(path => path)
        const breadcrumbs = []

        breadcrumbs.push({
            href: '/dashboard',
            name: 'Dashboard',
            icon: <FiHome className="mr-1" />
        })

        const isRoadmapPage = paths.length >= 2
        if (isRoadmapPage) {
            if (roadmapTitle) {
                breadcrumbs.push({
                    href: '',
                    name: roadmapTitle
                })
            }
        } else {
            paths.slice(1).forEach((path, index) => {
                const href = `/dashboard/${paths.slice(1, index + 2).join('/')}`
                const name = path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                breadcrumbs.push({ href, name })
            })
        }

        return breadcrumbs
    }

    const breadcrumbs = generateBreadcrumbs()

    return (
        <nav className="bg-white shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="sidebar-toggle p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 mr-2"
                            >
                                <FiMenu className="h-6 w-6" />
                            </button>
                        )}
                        <div className="hidden sm:flex items-center text-sm">
                            {breadcrumbs.map((crumb, index) => (
                                <div key={index} className="flex items-center">
                                    {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="flex items-center text-gray-600 hover:text-gray-900"
                                        >
                                            {crumb.icon && crumb.icon}
                                            {crumb.name}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-800 font-medium">
                                            {crumb.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 ml-auto">
                        <div
                            onClick={onPaymentClick}
                            className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium text-yellow-800 cursor-pointer hover:bg-yellow-200 transition-colors"
                        >
                            <FiZap className="mr-1" />
                            Credits: <span className="font-bold ml-1">{credits}</span>
                        </div>
                        <UserMenu
                            onTransactionHistoryClick={onTransactionHistoryClick}
                            onPaymentClick={onPaymentClick}
                            onSupportClick={onSupportClick}
                            onHelpClick={onHelpClick}
                            onProfileClick={onProfileClick}
                            onAboutClick={onAboutClick}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}