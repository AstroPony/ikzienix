import { db } from '../src/lib/firebase-admin'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  featured: boolean
  category: string
  createdAt: { seconds: number }
  updatedAt: { seconds: number }
}

async function main() {
  const productsSnapshot = await db.collection('products').get()
  const products = productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[]

  console.log('All products:', products)
  console.log('Featured products:', products.filter(p => p.featured))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  }) 