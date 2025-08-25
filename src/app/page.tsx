"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, Mail, Menu, Phone, X } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDatabaseData } from "@/hooks/useDatabaseData"
import { cn } from "@/lib/utils"


import brandLogo from "@/assets/oflex_ac.png"
import aboutImage from "@/assets/algo_about_image.jpg"
import heroImage from "@/assets/algo_hero_image.jpg"

export default function Home() {
  const { hero, about, services, clients, faqs, contacts, isLoading, error } = useDatabaseData()
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

  if (error || (!hero && !about && !services.length)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="mb-4 text-red-400">Error: {error || "Failed to load company data"}</p>
          <p>Please check the database connection.</p>
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
            <Image src={brandLogo} alt="ALGO CONSULTANCY logo" height={40} />
            <span className="hidden font-bold text-xl sm:inline">
              ALGO CONSULTANCY
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
            {contacts && (
              <>
                <Link href={`tel:${contacts.phone}`}>
                  <Button variant="ghost" size="icon" className="text-white hover:text-black">
                    <Phone className="h-5 w-5" />
                    <span className="sr-only">Phone</span>
                  </Button>
                </Link>
                <Link href={`mailto:${contacts.email}`}>
                  <Button variant="ghost" size="icon" className="text-white hover:text-black">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </Button>
                </Link>
              </>
            )}
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
                    <Badge className="mb-4 border-[#c9a6a6] bg-[#f2e6e6] px-4 py-1 text-sm text-black">Professional Services</Badge>
                  </div>
                  <h1 className="animate-slide-up text-4xl font-bold tracking-tighter opacity-0 sm:text-6xl xl:text-7xl/none" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                    {hero?.title || "Expert Financial & Legal Guidance for Everyone"}
                    <span className="text-[#8B0000]">.</span>
                  </h1>
                  <p className="max-w-[600px] animate-slide-up text-gray-400 opacity-0 md:text-xl" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
                    {hero?.subtitle || "We provide comprehensive financial and legal services to help you navigate complex challenges and achieve your goals."}
                  </p>
                </div>

                <div className="flex animate-slide-up items-center justify-center opacity-0 lg:hidden" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-none bg-[#8B0000] opacity-20 blur-3xl" />
                    <Image 
                      src={hero?.imageUrl || heroImage} 
                      width={450} 
                      height={300}
                      alt="Algo Trading Consultancy" 
                      className="relative rounded-none border-4 border-[#8B0000]/30 object-cover p-1" 
                    />
                  </div>
                </div>

                <div className="flex animate-slide-up flex-col gap-4 opacity-0 sm:flex-row" style={{ animationDelay: "1.0s", animationFillMode: "forwards" }}>
                  <Button className="rounded-none border-0 bg-[#8B0000] px-8 text-white hover:bg-[#A52A2A]" onClick={() => scrollToSection("services")}>
                    Our Services <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button className="rounded-none border-0 bg-[#8B0000] px-8 text-white hover:bg-[#A52A2A]" onClick={() => scrollToSection("contact")}>
                    Get Started
                  </Button>
                </div>
                
                {clients.length > 0 && (
                  <div className="animate-slide-up opacity-0 pt-12 pb-12" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
                    <p className="mb-6 text-base font-semibold text-gray-300">Trusted by Industry Leaders</p>
                    <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
                      {clients.map((client) => (
                        <div key={client.id} className="h-20 w-32 flex items-center justify-center">
                          {client.logoUrl ? (
                            <Image
                              src={client.logoUrl}
                              alt={`${client.name} logo`}
                              width={128}
                              height={80}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="h-20 w-32 bg-gray-700 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-sm">{client.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="hidden animate-slide-up items-center justify-center opacity-0 lg:flex" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-none bg-[#8B0000] opacity-20 blur-3xl" />
                  <Image 
                    src={hero?.imageUrl || heroImage} 
                    width={450} 
                    height={300}
                    alt="Financial Growth" 
                    className="relative rounded-none border-4 border-[#8B0000]/30 object-cover p-1" 
                  />
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
                    {about?.title || "About Our Services"}
                    <span className="text-[#8B0000]">.</span>
                 </h2>
                <p className="mb-4 text-gray-300">
                  {about?.description || "We are a team of experienced professionals dedicated to providing exceptional financial and legal guidance. Our mission is to help individuals and businesses make informed decisions and achieve their objectives."}
                </p>
              </div>
              <div className="relative">
                <Image 
                  src={about?.imageUrl || aboutImage} 
                  width={1000} 
                  height={600} 
                  alt="Algo Trading Analysis" 
                  className="border-8 border-zinc-800 object-cover shadow-lg" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" ref={servicesRef} className="w-full py-20 md:py-32">
          <div className="container mx-auto max-w-full px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our <span className="text-[#8B0000]">Services</span></h2>
              <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed">Comprehensive solutions tailored to your needs</p>
            </div>
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  title={service.title} 
                  description={service.description} 
                  features={service.features.split(', ')} 
                  imageUrl={service.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="whyChooseUs" ref={whyChooseUsRef} className="w-full bg-zinc-900 py-20 md:py-32">
          <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">Why Choose <span className="text-[#8B0000]">ALGO?</span></h2>
            <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed">Your dedicated partners in growth and financial well-being.</p>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`} className="border-b border-gray-700">
                  <AccordionTrigger className="py-4 text-left font-medium text-white no-underline hover:text-[#8B0000] hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={contactRef} className="w-full py-20 md:py-32">
          <div className="container mx-auto max-w-full px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get In <span className="text-[#8B0000]">Touch</span></h2>
              <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed">Ready to get started? Contact us today.</p>
            </div>
            {contacts && (
              <div className="mx-auto max-w-2xl bg-zinc-900 p-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-[#8B0000] p-3">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <a href={`tel:${contacts.phone}`} className="hover:text-[#8B0000]">{contacts.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-[#8B0000] p-3">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a href={`mailto:${contacts.email}`} className="hover:text-[#8B0000]">{contacts.email}</a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <Button asChild className="rounded-none border-0 bg-[#8B0000] px-8 text-white hover:bg-[#A52A2A]">
                    <Link href={`mailto:${contacts.email}?subject=Consultation Request`}>
                      Request Consultation
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="w-full bg-black py-20 md:py-32">
            <div className="container mx-auto max-w-full px-4 md:px-6">
                <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our <span className="text-[#8B0000]">Location</span></h2>
                    <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed">Find us at our office for a consultation.</p>
                </div>
                <div className="mx-auto max-w-7xl">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14758.123456789!2d88.45678901234567!3d22.98765432109876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f123%3A0x1234567890abcdef!2sKanchrapara%2C%20West%20Bengal%2C%20India!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        title="Office Location Map - Kanchrapara, West Bengal"
                        loading="lazy"
                        className="border-4 border-zinc-800"
                    ></iframe>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800 bg-black py-8">
        <div className="container mx-auto flex max-w-full flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} ALGO CONSULTANCY. All rights reserved.</p>
          {contacts && (
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon" className="text-[#8B0000] hover:text-white">
                <Link href={`tel:${contacts.phone}`}>
                  <Phone className="h-4 w-4" />
                  <span className="sr-only">Phone</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="text-[#8B0000] hover:text-white">
                <Link href={`mailto:${contacts.email}`}>
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Link>
              </Button>
            </div>
          )}
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

function ServiceCard({ title, description, features, imageUrl }: { title: string; description: string; features: string[]; imageUrl: string }) {
  return (
    <div className="flex h-full flex-col border border-zinc-800 bg-zinc-900 transition-colors duration-300 hover:border-[#8B0000]">
      <div className="h-48 w-full bg-gray-700 flex items-center justify-center">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} width={400} height={200} className="h-full w-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>
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