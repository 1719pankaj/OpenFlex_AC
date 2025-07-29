"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { StaticImageData } from "next/image"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, Mail, Menu, Phone, X } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useResumeData } from "@/hooks/useResumeData"
import { cn } from "@/lib/utils"

// Import your new images
import brandLogo from "@/assets/brand_logo.png"
import aboutImage from "@/assets/trading.jpg"
import heroImage from "@/assets/Accountant_Point.png"
import client1 from "@/assets/all_india_computers_client1.png"
import client2 from "@/assets/aakash_construction_client2.png"
import client3 from "@/assets/a_pro_ppf_clinet3.png"
import client4 from "@/assets/detailing_devils_clinet4.png"
import gstImage from "@/assets/GST_stock_image1.jpeg"
import itrImage from "@/assets/ITR_stock_image2.jpeg"
import tallyImage from "@/assets/Tally_stock_image3.jpeg"

const serviceImageMap: Record<string, StaticImageData> = {
  "GST_stock_image1.jpeg": gstImage,
  "ITR_stock_image2.jpeg": itrImage,
  "Tally_stock_image3.jpeg": tallyImage,
}

const clientLogoMap: Record<string, { src: StaticImageData; alt: string }> = {
  "all_india_computers_client1.png": { src: client1, alt: "All India Computers Logo" },
  "aakash_construction_client2.png": { src: client2, alt: "Aakash Construction Logo" },
  "a_pro_ppf_clinet3.png": { src: client3, alt: "A-Pro PPF Logo" },
  "detailing_devils_clinet4.png": { src: client4, alt: "Detailing Devils Logo" },
}

export default function Home() {
  const { data: companyData, isLoading, error } = useResumeData()
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Refs for each section
  const heroRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const servicesRef = useRef<HTMLElement>(null)
  const whyChooseUsRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  const sectionRefs = useMemo(
    () => ({
      hero: heroRef,
      about: aboutRef,
      services: servicesRef,
      whyChooseUs: whyChooseUsRef,
      contact: contactRef,
    }),
    [],
  )

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      const currentPosition = window.scrollY + 100

      Object.entries(sectionRefs).forEach(([section, ref]) => {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current
          if (currentPosition >= offsetTop && currentPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sectionRefs])

  const scrollToSection = (sectionId: keyof typeof sectionRefs) => {
    const section = sectionRefs[sectionId].current
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      })
    }
    setMobileMenuOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-[#8B0000]"></div>
          <p>Loading company data...</p>
        </div>
      </div>
    )
  }

  if (error || !companyData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="mb-4 text-red-400">Error: {error || "Failed to load company data"}</p>
          <p>Please check the configuration file.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrollY > 50 ? "bg-black/90 shadow-sm backdrop-blur-sm" : "bg-transparent",
        )}
      >
        <div className="container mx-auto flex h-20 max-w-full items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src={brandLogo} alt={`${companyData.company.name} logo`} height={40} />
            <span className="hidden font-bold text-xl sm:inline">
              {companyData.company.name}
              <span className="text-[#8B0000]">.</span>
            </span>
          </Link>

          <button className="z-50 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>

          <div
            className={cn(
              "fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-black transition-all duration-300 md:hidden",
              mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
            )}
          >
            <NavLink active={activeSection === "about"} onClick={() => scrollToSection("about")}>About</NavLink>
            <NavLink active={activeSection === "services"} onClick={() => scrollToSection("services")}>Services</NavLink>
            <NavLink active={activeSection === "whyChooseUs"} onClick={() => scrollToSection("whyChooseUs")}>Why Us</NavLink>
            <NavLink active={activeSection === "contact"} onClick={() => scrollToSection("contact")}>Contact</NavLink>
          </div>

          <nav className="hidden gap-6 md:flex">
            <NavLink active={activeSection === "about"} onClick={() => scrollToSection("about")}>About</NavLink>
            <NavLink active={activeSection === "services"} onClick={() => scrollToSection("services")}>Services</NavLink>
            <NavLink active={activeSection === "whyChooseUs"} onClick={() => scrollToSection("whyChooseUs")}>Why Choose Us</NavLink>
            <NavLink active={activeSection === "contact"} onClick={() => scrollToSection("contact")}>Contact</NavLink>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link href={`tel:${companyData.company.phone}`}>
              <Button variant="ghost" size="icon" className="text-[#8B0000] hover:text-white">
                <Phone className="h-5 w-5" />
                <span className="sr-only">Phone</span>
              </Button>
            </Link>
            <Link href={`mailto:${companyData.company.email}`}>
              <Button variant="ghost" size="icon" className="text-[#8B0000] hover:text-white">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative flex min-h-[calc(100vh-5rem)] items-center">
          <div className="container z-10 mx-auto max-w-full px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-block animate-slide-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                    <Badge className="mb-4 border-[#c9a6a6] bg-[#f2e6e6] px-4 py-1 text-sm text-black">{companyData.hero.badge}</Badge>
                  </div>
                  <h1 className="animate-slide-up text-4xl font-bold tracking-tighter opacity-0 sm:text-6xl xl:text-7xl/none" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                    {companyData.hero.title}
                    <span className="text-[#8B0000]">.</span>
                  </h1>
                  <p className="max-w-[600px] animate-slide-up text-gray-400 opacity-0 md:text-xl" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
                    {companyData.hero.subtitle}
                  </p>
                </div>
                <div className="flex animate-slide-up flex-col gap-4 opacity-0 sm:flex-row" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
                  <Button className="rounded-none border-0 bg-[#8B0000] px-8 text-white hover:bg-[#A52A2A]" onClick={() => scrollToSection("services")}>
                    {companyData.hero.ctaButtons.primary} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button className="rounded-none border-0 bg-[#8B0000] px-8 text-white hover:bg-[#A52A2A]" onClick={() => scrollToSection("contact")}>
                    {companyData.hero.ctaButtons.secondary}
                  </Button>
                </div>
                {/* Trusted By Section - Integrated into Hero */}
                <div className="animate-slide-up opacity-0 pt-12" style={{ animationDelay: "1.0s", animationFillMode: "forwards" }}>
                  <p className="mb-6 text-base font-semibold text-gray-300">{companyData.clients.title}</p>
                  <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
                    {companyData.clients.logos.map((logo) => {
                      const clientLogo = clientLogoMap[logo.src]
                      return <Image key={logo.alt} src={clientLogo.src} alt={clientLogo.alt} height={100} className="object-contain" />
                    })}
                  </div>
                </div>
              </div>
              <div className="flex animate-slide-up items-center justify-center opacity-0" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-none bg-[#8B0000] opacity-20 blur-3xl" />
                  <Image src={heroImage} width={450} alt="Financial Compliance" className="relative rounded-none border-4 border-[#8B0000]/30 object-cover p-1" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" ref={aboutRef} className="w-full bg-zinc-900 py-20 md:py-32">
          <div className="container mx-auto max-w-full px-4 md:px-6">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tighter sm:text-5xl">
                  {companyData.about.title.split(" ").map((word, index) => (
                    <span key={index}>
                      {word === "POINT," ? <span className="text-[#8B0000]">{word}</span> : word}
                      {index < companyData.about.title.split(" ").length - 1 && " "}
                    </span>
                  ))}
                </h2>
                {companyData.about.description.map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-300">{paragraph}</p>
                ))}
              </div>
              <div className="relative">
                <Image src={aboutImage} width={1000} height={600} alt="Business meeting" className="border-8 border-zinc-800 object-cover shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" ref={servicesRef} className="w-full py-20 md:py-32">
          <div className="container mx-auto max-w-full px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our <span className="text-[#8B0000]">Services</span></h2>
              <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed">{companyData.services.subtitle}</p>
            </div>
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {companyData.services.items.map((service) => (
                <ServiceCard key={service.title} title={service.title} description={service.description} features={service.features} image={serviceImageMap[service.image]} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="whyChooseUs" ref={whyChooseUsRef} className="w-full bg-zinc-900 py-20 md:py-32">
          <div className="container mx-auto max-w-full px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">Why Choose <span className="text-[#8B0000]">Us?</span></h2>
              <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed">Your dedicated financial partner for stability and growth.</p>
            </div>
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {companyData.whyChooseUs.map((item, index) => (
                  <AccordionItem key={item.title} value={`item-${index}`} className="border-b border-gray-700">
                    <AccordionTrigger className="py-4 text-left font-medium text-white no-underline hover:text-[#8B0000] hover:no-underline">{item.title}</AccordionTrigger>
                    <AccordionContent className="pb-4 text-gray-300">{item.description}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={contactRef} className="w-full py-20 md:py-32">
          <div className="container mx-auto max-w-full px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get In <span className="text-[#8B0000]">Touch</span></h2>
              <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed">{companyData.contact.subtitle}</p>
            </div>
            <div className="mx-auto max-w-2xl bg-zinc-900 p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-[#8B0000] p-3">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <a href={`tel:${companyData.company.phone}`} className="hover:text-[#8B0000]">{companyData.company.phone}</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-[#8B0000] p-3">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <a href={`mailto:${companyData.company.email}`} className="hover:text-[#8B0000]">{companyData.company.email}</a>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button asChild className="rounded-none border-0 bg-[#8B0000] px-8 text-white hover:bg-[#A52A2A]">
                  <Link href={`mailto:${companyData.company.email}?subject=Consultation Request`}>
                    {companyData.contact.cta}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800 bg-black py-8">
        <div className="container mx-auto flex max-w-full flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} {companyData.company.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="text-[#8B0000] hover:text-white">
              <Link href={`tel:${companyData.company.phone}`}>
                <Phone className="h-4 w-4" />
                <span className="sr-only">Phone</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-[#8B0000] hover:text-white">
              <Link href={`mailto:${companyData.company.email}`}>
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("relative text-sm font-medium transition-colors hover:text-[#8B0000]", active ? "text-[#8B0000]" : "text-white")}>
      {children}
      <span className={cn("absolute -bottom-1 left-0 h-0.5 bg-[#8B0000] transition-all duration-300", active ? "w-full" : "w-0")} />
    </button>
  )
}

function ServiceCard({ title, description, features, image }: { title: string; description: string; features: string[]; image: StaticImageData }) {
  return (
    <div className="flex h-full flex-col border border-zinc-800 bg-zinc-900 transition-colors duration-300 hover:border-[#8B0000]">
      <Image src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="flex flex-grow flex-col p-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 flex-grow text-gray-400">{description}</p>
        <ul className="mt-4 space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-[#8B0000]" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}