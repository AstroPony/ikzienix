'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface MotionWrapperProps {
  children: ReactNode
  className?: string
  initial?: any
  animate?: any
  exit?: any
  transition?: any
}

export function MotionDiv({ children, ...props }: MotionWrapperProps) {
  return <motion.div {...props}>{children}</motion.div>
}

export function MotionWrapper({ children }: { children: ReactNode }) {
  return <AnimatePresence>{children}</AnimatePresence>
} 