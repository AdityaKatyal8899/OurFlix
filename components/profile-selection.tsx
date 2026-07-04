'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface ProfileSelectionProps {
  onSelectProfile: (profileName: string) => void
  avatarPath?: string
}

export function ProfileSelection({ onSelectProfile, avatarPath = '/pfp.jpeg' }: ProfileSelectionProps) {
  const profileName = "CapyBara"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141414] select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center justify-center text-center"
      >
        {/* Title matching the image font style exactly */}
        <h1 className="mb-10 text-4xl sm:text-5xl md:text-6xl font-light tracking-wide text-white">
          Who&apos;s watching?
        </h1>

        {/* Profile Card Container */}
        <button
          type="button"
          onClick={() => onSelectProfile(profileName)}
          className="group relative flex flex-col items-center focus:outline-none"
        >
          {/* Square avatar container with white border on hover */}
          <div className="relative size-32 sm:size-36 md:size-40 overflow-hidden rounded-[4px] border-[3px] border-transparent transition-all duration-150 ease-out group-hover:border-white group-focus:border-white">
            <Image
              src={avatarPath}
              alt={profileName}
              fill
              sizes="(max-width: 640px) 128px, 160px"
              priority
              className="object-cover size-full"
            />
          </div>

          {/* Profile Name matching the color and transitions from the image */}
          <span className="mt-4 text-base sm:text-lg font-normal text-[#808080] transition-colors duration-150 group-hover:text-white group-focus:text-white">
            {profileName}
          </span>
        </button>

        {/* Manage Profiles Button */}
        {/* <button
          type="button"
          className="mt-16 px-6 py-2 border border-neutral-600 text-neutral-500 hover:border-neutral-200 hover:text-neutral-200 text-[13px] uppercase tracking-[0.15em] transition-all duration-200 bg-transparent"
        >
          Manage Profiles
        </button> */}
      </motion.div>
    </div>
  )
}
