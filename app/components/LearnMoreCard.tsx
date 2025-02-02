"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface LearnMoreCardProps {
  onClose: () => void
}

const LearnMoreCard = ({ onClose }: LearnMoreCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 p-8 rounded-lg max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">About f1nnesse</h2>
        <p className="text-gray-300 mb-6">
          f!nnesse is a cutting-edge sports betting platform that offers a seamless and exciting experience for sports
          enthusiasts. With our app, you can:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-6">
          <li>Browse upcoming matches across various sports</li>
          <li>Place bets on your favorite teams</li>
          <li>Track your betting history and performance</li>
          <li>Enjoy a user-friendly interface with real-time updates</li>
        </ul>
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default LearnMoreCard

