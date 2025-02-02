"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import LearnMoreCard from "./LearnMoreCard"

const Hero = () => {
  const [showLearnMore, setShowLearnMore] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
      >
        f!nnesse
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
      >

The sole platform dedicated to the IIT Roorkee Inter-Bhawan Sports Championship 2025, providing comprehensive event information along with real-time score updates. Additionally, the app offers an interactive feature allowing users to place friendly bets on their favorite Bhawan for an engaging experience.      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Link href="/login">
          <Button
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Button>
        </Link>
        <Button
          variant="outline"
          size="lg"
          className="bg-transparent border-2 border-purple-500 text-purple-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-purple-500 hover:text-white"
          onClick={() => setShowLearnMore(true)}
        >
          Learn More
        </Button>
      </motion.div>
      {showLearnMore && <LearnMoreCard onClose={() => setShowLearnMore(false)} />}
    </div>
  )
}

export default Hero

