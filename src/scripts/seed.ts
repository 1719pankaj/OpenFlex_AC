import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("7y9876tr78it6493", 10)
  
  await prisma.user.upsert({
    where: { email: "admin@openflex.com" },
    update: {},
    create: {
      email: "admin@openflex.com",
      password: hashedPassword,
    },
  })

  // Create initial hero content
  await prisma.hero.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Expert Financial & Legal Guidance for Everyone",
      subtitle: "Democratizing professional financial, compliance, and investment services.",
      imageUrl: "",
    },
  })

  // Create initial about content
  await prisma.about.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "About OpenFlex",
      description: "We are a leading consultancy firm providing comprehensive financial, legal, and investment services to businesses and individuals.",
      imageUrl: "",
    },
  })

  // Create initial services
  const services = [
    {
      title: "Algorithmic Trading",
      description: "Advanced algorithmic trading strategies for optimal market performance.",
      features: "Real-time analysis, Risk management, Performance optimization",
      imageUrl: "",
    },
    {
      title: "Investment Advisory",
      description: "Personalized investment strategies tailored to your financial goals.",
      features: "Portfolio analysis, Market research, Risk assessment",
      imageUrl: "",
    },
    {
      title: "Compliance Services",
      description: "Comprehensive compliance solutions for regulatory requirements.",
      features: "Regulatory updates, Audit support, Policy development",
      imageUrl: "",
    },
  ]

  for (let i = 0; i < services.length; i++) {
    await prisma.service.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1,
        ...services[i],
      },
    })
  }

  // Create initial contact info
  await prisma.contact.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: "info@openflex.com",
      phone: "+1 (555) 123-4567",
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
