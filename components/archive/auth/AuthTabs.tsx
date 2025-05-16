"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface TabProps {
  id: string
  label: string
  active: boolean
  onClick: () => void
}

interface AuthTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

function Tab({ id, label, active, onClick }: TabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-4 py-2 text-base font-medium transition-colors ${
        active ? "text-[#E8652B]" : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {label}
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#E8652B]"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  )
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  const tabs = [
    { id: "login", label: "登入" },
    { id: "signup", label: "註冊" }
  ]

  return (
    <div className="border-b border-[#F8D0B0] mb-4">
      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </div>
  )
} 