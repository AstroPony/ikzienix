'use client'

import FAQAccordion from '@/components/faq/FAQAccordion'

const faqItems = [
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for all items in their original condition. Items must be unworn and in their original packaging with all tags attached. Please contact our customer service team to initiate a return.',
    category: 'Returns & Exchanges'
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 3-5 business days within the continental US. International shipping may take 7-14 business days depending on the destination. Express shipping is available for 1-2 business day delivery.',
    category: 'Shipping'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can view shipping options and rates during checkout.',
    category: 'Shipping'
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order by logging into your account and visiting the order details page.',
    category: 'Orders'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through our payment partners.',
    category: 'Payment'
  },
  {
    question: 'Are your sunglasses UV protected?',
    answer: 'Yes, all our sunglasses come with 100% UV protection (UV400) to block both UVA and UVB rays. This protection is built into the lens material and cannot be scratched off.',
    category: 'Product'
  },
  {
    question: 'How do I clean my sunglasses?',
    answer: 'Use a microfiber cloth and lens cleaning solution specifically designed for eyewear. Avoid using paper towels or clothing as they can scratch the lenses. For best results, clean your sunglasses regularly.',
    category: 'Product'
  },
  {
    question: 'Do you offer prescription sunglasses?',
    answer: 'Currently, we do not offer prescription sunglasses. However, we are working on adding this feature in the future. Please check back for updates.',
    category: 'Product'
  },
  {
    question: 'What is your warranty policy?',
    answer: 'We offer a 1-year warranty against manufacturing defects. This covers issues with frame construction, lens quality, and hardware. Normal wear and tear, scratches, and damage from misuse are not covered.',
    category: 'Warranty'
  },
  {
    question: 'How do I contact customer service?',
    answer: 'You can reach our customer service team through email at support@ikzienix.com, phone at 1-800-XXX-XXXX, or through the contact form on our website. We typically respond within 24 hours.',
    category: 'Customer Service'
  }
]

export default function FAQPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <h1 className="h2 mb-4">Frequently Asked Questions</h1>
          <p className="lead mb-4">
            Find answers to common questions about our products, shipping, returns, and more.
            Can't find what you're looking for? Contact our customer service team.
          </p>
          <FAQAccordion items={faqItems} />
        </div>
      </div>
    </div>
  )
} 