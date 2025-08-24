import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedData = {
  hero: {
    title: "Expert Financial & Legal Guidance for Everyone",
    subtitle: "We provide comprehensive financial and legal services to help you navigate complex challenges and achieve your goals.",
    imageUrl: "/hero-image.jpg"
  },
  about: {
    title: "About Our Services",
    description: "We are a team of experienced professionals dedicated to providing exceptional financial and legal guidance. Our mission is to help individuals and businesses make informed decisions and achieve their objectives.",
    imageUrl: "/about-image.jpg"
  },
  services: [
    {
      title: "Financial Planning",
      description: "Comprehensive financial planning services to help you achieve your long-term goals.",
      features: "Retirement Planning, Investment Strategy, Tax Optimization",
      imageUrl: "/service-1.jpg"
    },
    {
      title: "Legal Consultation",
      description: "Expert legal advice and consultation for various legal matters.",
      features: "Contract Review, Legal Compliance, Dispute Resolution",
      imageUrl: "/service-2.jpg"
    },
    {
      title: "Business Advisory",
      description: "Strategic business advice to help your business grow and succeed.",
      features: "Business Strategy, Market Analysis, Growth Planning",
      imageUrl: "/service-3.jpg"
    }
  ],
  clients: [
    { name: "Client 1", logoUrl: "/client-1.png", order: 1 },
    { name: "Client 2", logoUrl: "/client-2.png", order: 2 },
    { name: "Client 3", logoUrl: "/client-3.png", order: 3 }
  ],
  faqs: [
    {
      question: "What services do you offer?",
      answer: "We offer comprehensive financial planning, legal consultation, and business advisory services."
    },
    {
      question: "How can I get started?",
      answer: "Contact us for a free consultation to discuss your needs and how we can help."
    }
  ],
  contacts: {
    email: "info@example.com",
    phone: "+1 (555) 123-4567"
  }
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.contact.deleteMany()
  await prisma.faq.deleteMany()
  await prisma.client.deleteMany()
  await prisma.service.deleteMany()
  await prisma.about.deleteMany()
  await prisma.hero.deleteMany()

  // Seed Hero
  const hero = await prisma.hero.create({
    data: seedData.hero
  })
  console.log('✅ Hero created:', hero.id)

  // Seed About
  const about = await prisma.about.create({
    data: seedData.about
  })
  console.log('✅ About created:', about.id)

  // Seed Services
  for (const service of seedData.services) {
    const created = await prisma.service.create({
      data: service
    })
    console.log('✅ Service created:', created.title)
  }

  // Seed Clients
  for (const client of seedData.clients) {
    const created = await prisma.client.create({
      data: client
    })
    console.log('✅ Client created:', created.name)
  }

  // Seed FAQs
  for (const faq of seedData.faqs) {
    const created = await prisma.faq.create({
      data: faq
    })
    console.log('✅ FAQ created:', created.question)
  }

  // Seed Contacts
  const contact = await prisma.contact.create({
    data: seedData.contacts
  })
  console.log('✅ Contact created:', contact.id)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
