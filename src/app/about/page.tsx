import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Our Story</h1>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-video mb-8"
          >
            <Image
              src="/about/festival.jpg"
              alt="Festival scene with people wearing sunglasses"
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="prose prose-lg mx-auto"
          >
            <h2 className="text-2xl font-bold mb-4">The Birth of Ikzienix</h2>
            <p>
              It all started with a simple phrase: "Ik zien niets" - Dutch for "I don't see anything." 
              But for us, it became so much more. It became a philosophy, a way of life, and eventually, 
              a brand that celebrates carefree moments under the sun.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Our Mission</h2>
            <p>
              We believe that protecting your eyes shouldn't come with anxiety. Whether you're at a festival, 
              on a beach, or just enjoying a sunny day, your sunglasses should be your companions, not your 
              worries. That's why we created Ikzienix - premium sunglasses that don't break the bank, so you 
              can focus on the moment, not on your accessories.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">The Festival Spirit</h2>
            <p>
              Born from the festival scene, we understand that sometimes things get lost, broken, or 
              "borrowed" in the excitement of the moment. Instead of stressing over expensive sunglasses, 
              we want you to think, "Huh, guess I'll order my next pair Ikzienix!" and move on with your 
              day. Because life's too short to worry about sunglasses.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Quality Without the Price Tag</h2>
            <p>
              Don't let the affordable price fool you - our sunglasses are built to last. With UV400 
              protection, durable frames, and stylish designs, they're perfect for everyday wear. But 
              if they do get lost or broken, replacing them won't break the bank. That's the Ikzienix 
              promise.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 p-8 rounded-lg mt-12"
          >
            <h3 className="text-xl font-bold mb-4 text-center">Join the Movement</h3>
            <p className="text-center">
              Be part of a community that values experiences over possessions, moments over materials, 
              and fun over fuss. Because at the end of the day, it's not about the sunglasses - it's 
              about the memories you make while wearing them.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 