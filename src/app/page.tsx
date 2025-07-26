"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState, useMemo } from "react"
import {                               
  Mail,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Phone,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { useResumeData } from "@/hooks/useResumeData"
import placeholderImage from "@/assets/compliance.jpg";
import appDemoImage from "@/assets/trading.jpg"; 
import { CardSpotlight } from "@/components/ui/card-spotlight";

export default function Home() {
  const { data: companyData, isLoading, error } = useResumeData();
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Refs for each section
  const heroRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const servicesRef = useRef<HTMLElement>(null)
  const whyChooseUsRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)


  const sectionRefs = useMemo(() => ({
    hero: heroRef,
    about: aboutRef,
    services: servicesRef,
    whyChooseUs: whyChooseUsRef,
    contact: contactRef,
  }), []); // The empty dependency array means it will be created only once

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
  }, [sectionRefs]) // Now this dependency is stable


  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs[sectionId as keyof typeof sectionRefs].current
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#d5ff5f] mx-auto mb-4"></div>
          <p>Loading company data...</p>
        </div>
      </div>
    );
  }

  if (error || !companyData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error || 'Failed to load company data'}</p>
          <p>Please check the configuration file.</p>
        </div>
      </div>
    );
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
        <div className="container max-w-full px-4 md:px-6 flex h-16 items-center justify-between">
          <div className="font-bold">
            <Link href="/" className="flex items-center gap-2 text-xl">
              <span>{companyData.company.name}</span>
              <span className="text-[#d5ff5f]">.</span>
            </Link>
          </div>

          <button className="md:hidden z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>

          <div
            className={cn(
              "fixed inset-0 bg-black flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden",
              mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
            )}
          >
            <NavLink active={activeSection === "about"} onClick={() => scrollToSection("about")}>
              About
            </NavLink>
            <NavLink active={activeSection === "services"} onClick={() => scrollToSection("services")}>
              Services
            </NavLink>
            <NavLink active={activeSection === "whyChooseUs"} onClick={() => scrollToSection("whyChooseUs")}>
              Why Us
            </NavLink>
            <NavLink active={activeSection === "contact"} onClick={() => scrollToSection("contact")}>
              Contact
            </NavLink>
          </div>

          <nav className="hidden md:flex gap-6">
            <NavLink active={activeSection === "about"} onClick={() => scrollToSection("about")}>
              About
            </NavLink>
            <NavLink active={activeSection === "services"} onClick={() => scrollToSection("services")}>
              Services
            </NavLink>
             <NavLink active={activeSection === "whyChooseUs"} onClick={() => scrollToSection("whyChooseUs")}>
              Why Choose Us
            </NavLink>
            <NavLink active={activeSection === "contact"} onClick={() => scrollToSection("contact")}>
              Contact
            </NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link href={`tel:${companyData.company.phone}`}>
              <Button variant="ghost" size="icon" className="text-[d5ff5f] hover:text-black">
                <Phone className="h-5 w-5" />
                <span className="sr-only">Phone</span>
              </Button>
            </Link>
            <Link href={`mailto:${companyData.company.email}`}>
              <Button variant="ghost" size="icon" className="text-[d5ff5f] hover:text-black">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={sectionRefs.hero} className="relative min-h-screen flex items-center">
          <div className="container max-w-full px-4 md:px-6 z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                   <div
                    className="inline-block animate-slide-up opacity-0"
                    style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
                  >
                    <Badge className="px-4 py-1 text-sm bg-[#f5ffdd] text-black border-[#e7ffac] mb-4">
                      {companyData.hero.badge}
                    </Badge>
                  </div>
                  <h1
                    className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none animate-slide-up opacity-0"
                    style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
                  >
                    {companyData.hero.title}
                    <span className="text-[#d5ff5f]">.</span>
                  </h1>
                  <p
                    className="max-w-[600px] text-gray-500 md:text-xl animate-slide-up opacity-0"
                    style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
                  >
                    {companyData.hero.subtitle}
                  </p>
                </div>
                <div
                  className="flex flex-col gap-4 sm:flex-row animate-slide-up opacity-0"
                  style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
                >
                  <Button
                    className="bg-[#d5ff5f] hover:bg-[#c4ee4e] text-black border-0 rounded-none px-8"
                    onClick={() => scrollToSection("services")}
                  >
                    {companyData.hero.ctaButtons.primary}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#d5ff5f] text-black hover:bg-[#f5ffdd] rounded-none px-8"
                    onClick={() => scrollToSection("contact")}
                  >
                    {companyData.hero.ctaButtons.secondary}
                  </Button>
                </div>
              </div>
              <div
                className="flex items-center justify-center animate-slide-up opacity-0"
                style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-none bg-[#d5ff5f] blur-3xl opacity-10 animate-pulse" />
                  <Image
                    src={placeholderImage}
                    width={500}
                    height={500}
                    alt="Accountants Point"
                    className="relative rounded-none aspect-square object-cover border-4 border-[#d5ff5f]/30 p-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none hover:bg-transparent hover:text-[#d5ff5f]"
              onClick={() => scrollToSection("about")}
            >
              <ChevronRight className="h-5 w-5 rotate-90" />
              <span className="sr-only">Scroll Down</span>
            </Button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" ref={sectionRefs.about} className="w-full py-20 md:py-32 relative bg-zinc-900">
          <div className="container max-w-full px-4 md:px-6 relative">
             <div className="grid md:grid-cols-2 gap-10 items-center">
               <div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-6">
                    {companyData.about.title.split(' ').map((word, index) => (
                      <span key={index}>
                        {word === 'POINT,' ? <span className="text-[#d5ff5f]">{word}</span> : word}
                        {index < companyData.about.title.split(' ').length - 1 && ' '}
                      </span>
                    ))}
                  </h2>
                 {companyData.about.description.map((paragraph, index) => (
                  <p key={index} className="text-white mb-4">
                    {paragraph}
                  </p>
                ))}
               </div>
               <div className="relative">
                 <Image
                    src={appDemoImage} // Replace with a relevant image for the accounting firm
                    width={1000}
                    height={600}
                    alt="Office"
                    className="object-cover border-8 border-zinc-800 shadow-lg"
                  />
               </div>
             </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" ref={sectionRefs.services} className="w-full py-20 md:py-32 relative">
          <div className="container max-w-full px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our <span className="text-[#d5ff5f]">Services</span>
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed">
                  {companyData.services.subtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl mx-auto">
              {companyData.services.items.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section id="whyChooseUs" ref={sectionRefs.whyChooseUs} className="w-full py-20 md:py-32 relative bg-zinc-900">
            <div className="container max-w-full px-4 md:px-6 relative">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                        Why Choose <span className="text-[#d5ff5f]">Us?</span>
                        </h2>
                        <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed">
                        Your dedicated financial partner for stability and growth.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    {companyData.whyChooseUs.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                        <AccordionTrigger className="text-left font-medium py-4 hover:text-[#d5ff5f] hover:no-underline">
                        {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-white pb-4">{item.description}</AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
                </div>
            </div>
        </section>


        {/* Contact Section */}
        <section id="contact" ref={sectionRefs.contact} className="w-full py-20 md:py-32 relative">
          <div className="container max-w-full px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get In <span className="text-[#d5ff5f]">Touch</span>
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed">
                  {companyData.contact.subtitle}
                </p>
              </div>
            </div>
            <div className="bg-zinc-800 p-8 max-w-2xl mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-[#d5ff5f]">
                        <Phone className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a href={`tel:${companyData.company.phone}`} className="hover:text-[#d5ff5f]">
                          {companyData.company.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-[#d5ff5f]">
                        <Mail className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a href={`mailto:${companyData.company.email}`} className="hover:text-[#d5ff5f]">
                          {companyData.company.email}
                        </a>
                      </div>
                    </div>
                    {companyData.company.website && (
                         <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-[#d5ff5f]">
                                <ExternalLink className="h-6 w-6 text-black" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Website</p>
                                <a href={companyData.company.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#d5ff5f]">
                                {companyData.company.website.replace('https://', '')}
                                </a>
                            </div>
                         </div>
                    )}
                 </div>
                 <div className="text-center mt-8">
                    <Button
                        className="bg-[#d5ff5f] hover:bg-[#c4ee4e] text-black border-0 rounded-none px-8"
                        onClick={() => scrollToSection("contact")}
                    >
                        {companyData.contact.cta}
                    </Button>
                 </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-700 py-8 bg-black">
        <div className="container max-w-full flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} {companyData.company.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href={`tel:${companyData.company.phone}`}>
              <Button variant="ghost" size="icon" className="text-[d5ff5f] hover:text-[#d5ff5f] hover:bg-transparent">
                <Phone className="h-4 w-4" />
                <span className="sr-only">Phone</span>
              </Button>
            </Link>
            <Link href={`mailto:${companyData.company.email}`}>
              <Button variant="ghost" size="icon" className="text-[d5ff5f] hover:text-[#d5ff5f] hover:bg-transparent">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


function NavLink({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors hover:text-[#d5ff5f] relative",
        active ? "text-[#d5ff5f]" : "text-white",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-0.5 bg-[#d5ff5f] transition-all duration-300",
          active ? "w-full" : "w-0",
        )}
      />
    </button>
  )
}

function ServiceCard({
  title,
  description,
  features,
}: {
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <CardSpotlight className="h-full flex flex-col p-6">
      <div className="flex-grow">
        <h3 className="text-xl font-bold relative z-20 mt-2 text-white">{title}</h3>
        <p className="text-neutral-300 mt-4 relative z-20">{description}</p>
        <ul className="mt-4 space-y-2 relative z-20">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-[#d5ff5f] mr-2 mt-1 flex-shrink-0" />
              <span className="text-white">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </CardSpotlight>
  );
}