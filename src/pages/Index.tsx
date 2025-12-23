import { useState, useEffect } from "react";
import { Link, Element } from "react-scroll";
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon, Instagram, Linkedin, Phone } from "lucide-react";
import RotatingText from "@/components/RotatingText";
import StarBorder from "@/components/StarBorder";
import ScrollReveal from "@/components/ScrollReveal";
import BannerModal from "@/components/BannerModal";
import MagicBento from "@/components/MagicBento";
import Magnet from "@/components/Magnet";
import ClickSpark from "@/components/ClickSpark";
import { LiquidButton } from "@/components/ui/liquid-button";
import { ProjectParallax } from "@/components/ProjectParallax";
import { Spotlight } from "@/components/ui/spotlight";
import { LoaderOne } from "@/components/ui/loader";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { SparklesCore } from "@/components/ui/sparkles";
import GoogleGeminiEffectSection from "@/components/GoogleGeminiEffectSection";
import { cn } from "@/lib/utils";
import eyeqLogo from "@/assets/eyeq-logo.png";
import Navbar from "@/components/Navbar";
import { motion, Variants } from "framer-motion";
import TeamMember from "@/components/TeamMember";
import { AnimatedSection } from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Fixed path
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Fixed path
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Marquee } from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AnimatedList } from "@/components/ui/animated-list";
import { AnimatedBeam } from "@/components/ui/animated-beam";

interface ModalContent {
  title: string;
  description: string;
}

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    description: "",
  });
  const [showContent, setShowContent] = useState(false);

  const { user } = useAuth();

  // Show loader for 2 seconds, then show content
  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(loaderTimer);
  }, []);

  const openModal = (title: string, description: string) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Files for Marquee animation
  const files = [
    {
      name: "Project Showcase",
      body: "Real-world computer vision projects built by our members.",
    },
    {
      name: "Learning Resources",
      body: "Curated tutorials, documentation, and research papers.",
    },
    {
      name: "Community Events",
      body: "Hackathons, workshops, and collaborative coding sessions.",
    },
    {
      name: "Mentorship Program",
      body: "One-on-one guidance from experienced developers.",
    },
    {
      name: "Portfolio Building",
      body: "Create impressive projects for your career.",
    },
  ];

  // Features for BentoGrid
  const bentoFeatures = [
    {
      Icon: FileTextIcon,
      name: "Project-Based Learning",
      description: "Learn by building real computer vision projects with hands-on experience.",
      href: "",
      cta: "Learn more",
      onCTAClick: () => openModal(
        "Project-Based Learning",
        "At EyeQ, we believe in learning by doing. Our project-based approach allows you to build real-world computer vision applications from day one. You'll work on projects like object detection systems, facial recognition software, and autonomous vehicle simulations. Each project is carefully designed to teach you both theoretical concepts and practical implementation skills. By the end of your journey with us, you'll have a portfolio of impressive projects to showcase to potential employers or for your academic requirements."
      ),
      className: "col-span-3 md:col-span-1", // Full width on mobile, 1/3 on desktop
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
        >
          {files.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm font-medium dark:text-white">
                    {f.name}
                  </figcaption>
                </div>
              </div>
              <blockquote className="mt-2 text-xs">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: BellIcon,
      name: "Community Events",
      description: "Join hackathons, workshops, and collaborative coding sessions.",
      href: "",
      cta: "Learn more",
      onCTAClick: () => openModal(
        "Community Events",
        "Our community events are designed to foster collaboration and learning in a fun environment. Participate in our weekly coding sessions where you can work on projects with peers, attend monthly hackathons with exciting challenges, and join our guest lectures featuring industry experts. We also host project showcase events where members present their work and receive feedback. These events not only enhance your technical skills but also help you build valuable connections in the computer vision field."
      ),
      className: "col-span-3 md:col-span-2", // Full width on mobile, 2/3 on desktop
      background: (
        <div className="absolute top-6 right-4 h-[300px] w-[calc(100%-2rem)] scale-90 border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-95">
          <AnimatedList className="space-y-4">
            <div className="bg-primary/10 p-5 rounded-lg shadow-sm">
              <h4 className="font-bold text-primary mb-1">Weekly Coding Session</h4>
              <p className="text-sm text-muted-foreground">Every Saturday 6PM IST</p>
            </div>
            <div className="bg-secondary/10 p-5 rounded-lg shadow-sm">
              <h4 className="font-bold text-secondary mb-1">Project Showcase</h4>
              <p className="text-sm text-muted-foreground">Monthly Demo Day</p>
            </div>
            <div className="bg-accent/10 p-5 rounded-lg shadow-sm">
              <h4 className="font-bold text-accent-foreground mb-1">Guest Lecture</h4>
              <p className="text-sm text-muted-foreground">Industry Expert Talk</p>
            </div>
          </AnimatedList>
        </div>
      ),
    },
    {
      Icon: Share2Icon,
      name: "Collaborative Network",
      description: "Connect with peers and mentors in our vibrant community.",
      href: "",
      cta: "Learn more",
      onCTAClick: () => openModal(
        "Collaborative Network",
        "EyeQ provides a vibrant collaborative network where you can connect with like-minded peers and experienced mentors. Our community includes students from various backgrounds, industry professionals, and academic experts. Through our mentorship program, you'll be paired with senior members or industry professionals who can guide you through your learning journey. Collaborate on projects, share knowledge, and participate in peer code reviews. Our Discord server and regular meetups ensure you're always connected with the community, making learning a social and collaborative experience."
      ),
      className: "col-span-3 md:col-span-2", // Full width on mobile, 2/3 on desktop
      background: (
        <div className="absolute top-6 right-4 h-[300px] w-[calc(100%-2rem)] border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105">
          <AnimatedBeam className="w-full h-full">
            <div className="flex justify-between items-center h-full px-10">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-lg">You</div>
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white font-bold shadow-md">M1</div>
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold shadow-md">M2</div>
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold shadow-md">M3</div>
            </div>
          </AnimatedBeam>
        </div>
      ),
    },
    {
      Icon: CalendarIcon,
      name: "Learning Path",
      description: "Structured curriculum from basics to advanced computer vision.",
      className: "col-span-3 md:col-span-1", // Full width on mobile, 1/3 on desktop
      href: "",
      cta: "Learn more",
      onCTAClick: () => openModal(
        "Structured Learning Path",
        "Our structured learning path takes you from foundational concepts to advanced computer vision techniques. We start with basics like image processing and gradually progress to complex topics such as deep learning for computer vision, neural networks, and cutting-edge research areas. Each module includes theoretical learning, hands-on coding exercises, and project implementation. Our curriculum is regularly updated to reflect the latest industry trends and research developments. Whether you're a complete beginner or looking to advance your skills, our learning path provides a clear roadmap to achieve your goals in computer vision."
      ),
      background: (
        <div className="absolute top-12 right-4 origin-top scale-90 rounded-md border p-2 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-95">
          <div className="p-5 text-center">
            <div className="text-sm font-medium mb-3 text-muted-foreground">Today</div>
            <div className="text-3xl font-bold mb-1">{new Date().getDate()}</div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleString('default', { month: 'short' })}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const teamMembers = [
    {
      name: "Aswath S",
      role: "President",
      quote:
        "My vision is to shape this club into a creative space where innovation meets collaboration... where every member learns, grows, and contributes to the ever-evolving world of AI and technology.",
      imageUrl: "/team/President.JPG",
      linkedinUrl: "https://www.linkedin.com/in/aswath-s-a37475336/",
    },
    {
      name: "Sasvanthu G",
      role: "Vice President",
      quote:
        "Leading with passion and purpose, I strive to create an environment where every idea is valued and every member feels empowered to push boundaries.",
      imageUrl: "/team/Vice President.jpg",
      linkedinUrl: "http://www.linkedin.com/in/sasvanthu-g",
    },
    {
      name: "Harsh Limkar N",
      role: "Secretary",
      quote:
        "Organization meets inspiration. My goal is to ensure our community runs smoothly while fostering meaningful connections and collaborative learning.",
      imageUrl: "/team/Secretary.jpg",
      linkedinUrl: "https://www.linkedin.com/in/harsh-limkar/",
    },
    {
      name: "Suvedhan G",
      role: "Treasurer",
      quote:
        "Managing resources wisely to fuel innovation. Every project deserves the support it needs to transform ideas into reality.",
      imageUrl: "/team/Treasurer.jpg",
      linkedinUrl: "https://www.linkedin.com/in/suvedhan-g-284290389/",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // This creates the stagger effect
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  return (
    <>
      {showLoader ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <LoaderOne />
        </div>
      ) : (
        <ClickSpark
          sparkColor='#8400ff'
          sparkSize={10}
          sparkRadius={20}
          sparkCount={8}
          duration={500}
        >
          {/* This is your main content wrapper */}
          <motion.div
            className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative"
            style={{ zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Navigation Bar */}
            <Navbar />

            {/* Old Background Image - REMOVED
            <div
              className="fixed inset-0 z-0 opacity-5 bg-center bg-no-repeat bg-cover parallax"
              style={{ backgroundImage: 'url(/bg-logo.png)' }}
            />
            */}

            {/* Hero Section */}
            <Element name="home">
              <section id="home" className="relative h-screen flex flex-col items-center justify-center z-10 overflow-hidden">
                {/* Spotlight Effect */}
                <Spotlight
                  className="-top-40 left-0 md:-top-20 md:left-60"
                  fill="white"
                />

                <div className="text-center relative z-20">
                  <ScrollReveal animation="fade" delay={100} duration={900}>
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <h1 className="text-6xl md:text-8xl font-bold text-foreground">
                        EyeQ
                      </h1>
                      <RotatingText
                        texts={["See", "Code", "Create"]}
                        mainClassName="px-3 sm:px-4 md:px-6 bg-primary text-primary-foreground overflow-hidden py-2 sm:py-2 md:py-3 justify-center rounded-lg text-5xl md:text-7xl font-bold"
                        staggerFrom="last"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-1 md:pb-2"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={1500}
                      />
                    </div>
                  </ScrollReveal>

                  <ScrollReveal animation="slide-up" delay={300} duration={900}>
                    <div className="relative w-fit mx-auto overflow-hidden">
                      {/* Sparkles Background */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Gradients */}
                        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-[2px] w-3/4 blur-sm" />
                        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-px w-3/4" />
                        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent h-[5px] w-1/4 blur-sm" />
                        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent h-px w-1/4" />

                        {/* Core Sparkles */}
                        <SparklesCore
                          background="transparent"
                          minSize={0.4}
                          maxSize={1}
                          particleDensity={1200}
                          className="w-full h-full"
                          particleColor="#a958f5"
                        />

                        {/* Radial Gradient */}
                        <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
                      </div>

                      {/* TypewriterEffectSmooth */}
                      <div className="relative z-10 animate-[pulseOpenClose_4.5s_ease-in-out_infinite]">
                        <TypewriterEffectSmooth
                          words={[
                            {
                              text: "Riding",
                            },
                            {
                              text: "the",
                            },
                            {
                              text: "Vibe",
                            },
                            {
                              text: "Wave",
                            },
                            {
                              text: "in",
                            },
                            {
                              text: "Computer",
                              className: "text-[#a958f5]",
                            },
                            {
                              text: "Vision!",
                              className: "text-[#a958f5]",
                            },
                          ]}
                          className="text-2xl md:text-3xl font-medium text-white mt-6"
                        />
                      </div>
                    </div>
                  </ScrollReveal>

                </div>
              </section>
            </Element>

            {/* Our Purpose Section */}
            {showContent && (
              <>
                <Element name="about">
                  <section id="about" className="relative py-32 px-4 z-10">
                    <div className="max-w-7xl mx-auto relative">
                      <ScrollReveal animation="fade" duration={800}>
                        <div className="text-center">
                          {/* Logo */}
                          <div className="flex justify-center mb-12">
                            <div className="relative">
                              <ScrollReveal animation="scale" duration={1000} delay={200}>
                                <img
                                  src={eyeqLogo}
                                  alt="EyeQ Club Logo"
                                  className="w-80 h-80 object-contain hover:scale-105 transition-all duration-500 mx-auto hover-lift"
                                />
                              </ScrollReveal>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="max-w-4xl mx-auto">
                            {/* Heading with Gradient Underline */}
                            <div className="mb-8">
                              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary leading-tight">
                                Empowering Visionaries in Computer Vision
                              </h1>
                              <ScrollReveal animation="scale" delay={800} duration={600}>
                                <div className="h-1 w-32 bg-gradient-to-r from-primary to-purple-500 rounded-full mx-auto"></div>
                              </ScrollReveal>
                            </div>

                            {/* Mission Statement */}
                            <ScrollReveal animation="slide-up" delay={300} duration={900}>
                              <p className="text-xl text-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
                                EyeQ bridges the gap between learning and innovation through{" "}
                                <span className="text-primary font-semibold">real-world projects</span>,{" "}
                                <span className="text-primary font-semibold">mentorship</span>, and{" "}
                                <span className="text-primary font-semibold">community</span>.
                              </p>
                            </ScrollReveal>

                            {/* Animated Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
                              <AnimatedSection delay={100}>
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-primary mb-2">
                                    <CountUp
                                      from={0}
                                      to={50}
                                      separator=","
                                      direction="up"
                                      duration={2}
                                      suffix="+"
                                    />
                                  </div>
                                  <div className="text-sm text-muted-foreground">Active Members</div>
                                </div>
                              </AnimatedSection>
                              <AnimatedSection delay={300}>
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-primary mb-2">
                                    <CountUp
                                      from={0}
                                      to={150}
                                      separator=","
                                      direction="up"
                                      duration={2}
                                      suffix="+"
                                    />
                                  </div>
                                  <div className="text-sm text-muted-foreground">Real-World Projects</div>
                                </div>
                              </AnimatedSection>
                              <AnimatedSection delay={500}>
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-primary mb-2">
                                    <CountUp
                                      from={0}
                                      to={10}
                                      separator=","
                                      direction="up"
                                      duration={2}
                                      suffix="+"
                                    />
                                  </div>
                                  <div className="text-sm text-muted-foreground">Expert Mentors</div>
                                </div>
                              </AnimatedSection>
                            </div>

                            {/* Call to Action */}
                            <ScrollReveal animation="slide-up" delay={500} duration={900}>
                              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              </div>
                            </ScrollReveal>
                          </div>
                        </div>
                      </ScrollReveal>
                    </div>
                  </section>
                </Element>

                {/* What Makes EyeQ Different */}
                <Element name="features">
                  <section className="relative py-20 px-4 z-10">
                    <div className="max-w-6xl mx-auto">
                      <ScrollReveal animation="fade" duration={800}>
                        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-primary">
                          What Makes EyeQ Different?
                        </h2>
                      </ScrollReveal>

                      <div className="mb-16">
                        <BentoGrid>
                          {bentoFeatures.map((feature, idx) => (
                            <BentoCard key={idx} {...feature} />
                          ))}
                        </BentoGrid>
                      </div>
                    </div>
                  </section>
                </Element>

                {/* Project Parallax */}
                <section className="relative py-20 px-4 z-10">
                  <div className="max-w-6xl mx-auto mb-16">
                    <ScrollReveal animation="fade" duration={800}>
                      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-primary">
                        MEMBERS PROJECT
                      </h2>
                    </ScrollReveal>
                    <ProjectParallax />
                  </div>
                </section>

                {/* Student Benefits */}
                <section className="relative py-20 px-4 z-10">
                  <div className="max-w-6xl mx-auto">
                    <ScrollReveal>
                      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-primary">
                        Student Benefitsn
                      </h2>
                    </ScrollReveal>

                    <Carousel
                      opts={{
                        slidesToScroll: 1,
                        loop: true,
                      }}
                      className="w-full max-w-5xl mx-auto"
                    >
                      <CarouselContent>
                        {[
                          {
                            title: "Start from Zero, Grow Together",
                            description: "Safe, beginner-friendly peer learning environment",
                          },
                          {
                            title: "Vibe Coding Sessions",
                            description: "Chill, fun coding with a community focus",
                          },
                          {
                            title: "Idea to Innovations",
                            description: "Guiding curiosity into real projects",
                          },
                          {
                            title: "Mini-Projects & Hackathons",
                            description: "Quick skill-building through small challenges",
                          },
                          {
                            title: "Building Portfolio",
                            description: "Create projects that showcase your skills",
                          },
                          {
                            title: "24/7 Community Support",
                            description: "Always-on support from mentors and peers",
                          },
                        ].map((benefit, index) => (
                          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <ScrollReveal animation="scale" delay={index * 50} duration={600}>
                              <div className="p-1">
                                <MagicBento
                                  textAutoHide={true}
                                  enableStars={true}
                                  enableSpotlight={true}
                                  enableBorderGlow={true}
                                  enableTilt={true}
                                  enableMagnetism={true}
                                  clickEffect={true}
                                  spotlightRadius={300}
                                  particleCount={12}
                                  glowColor="132, 0, 255"
                                  className="w-full h-[200px] bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20 hover:shadow-2xl"
                                >
                                  <div className="w-full h-full flex flex-col justify-center items-center text-center p-6">
                                    <h3 className="text-lg font-bold mb-3 text-primary leading-tight">
                                      {benefit.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {benefit.description}
                                    </p>
                                  </div>
                                </MagicBento>
                              </div>
                            </ScrollReveal>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden md:flex" />
                      <CarouselNext className="hidden md:flex" />
                    </Carousel>
                  </div>
                </section>

                {/* Meet the Core Team */}
                <section className="relative py-20 px-4 z-10">
                  <div className="max-w-6xl mx-auto">
                    <ScrollReveal animation="fade" duration={800}>
                      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-primary">
                        Meet the Core Team
                      </h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {teamMembers.map((member, index) => (
                        <ScrollReveal key={index} delay={index * 100} animation="slide-up" duration={800}>
                          <TeamMember
                            name={member.name}
                            role={member.role}
                            imageUrl={member.imageUrl}
                            linkedinUrl={member.linkedinUrl}
                          />
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Team Member Quotes */}
                <section className="relative py-20 px-4 z-10 bg-muted/30">
                  <div className="max-w-6xl mx-auto">
                    <motion.div
                      className="grid grid-cols-1 gap-8"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                    >
                      {teamMembers.map((member, index) => (
                        <ScrollReveal key={index} animation="slide-up" delay={index * 150} duration={700}>
                          <motion.div variants={itemVariants} className="bg-card border border-border rounded-lg shadow-lg p-8 hover:border-primary/50 hover:shadow-primary/20 hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                              <div className="flex-1 flex flex-col justify-center">
                                <h3 className="text-xl font-semibold text-primary mb-2">
                                  {member.name}
                                </h3>
                                <p className="text-muted-foreground text-sm font-medium mb-4">
                                  {member.role}
                                </p>

                                {/* Member Quote */}
                                <p className="text-sm text-muted-foreground italic leading-relaxed">
                                  "{member.quote}"
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </ScrollReveal>
                      ))}
                    </motion.div>
                  </div>
                </section>

                {/* Google Gemini Effect Section */}
                <GoogleGeminiEffectSection />

                {/* Footer */}
                <Element name="contact">
                  <footer id="contact" className="relative py-12 px-4 border-t border-border z-10">
                    <div className="max-w-6xl mx-auto">
                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Column 1: Logo & Slogan */}
                        <ScrollReveal animation="fade" duration={800}>
                          <div className="flex flex-col items-center md:items-start">
                            <img
                              src={eyeqLogo}
                              alt="EyeQ Club Logo"
                              className="w-24 h-24 object-contain mb-4"
                            />
                            <p className="text-primary font-bold text-lg">See. Code. Create.</p>
                          </div>
                        </ScrollReveal>

                        {/* Column 2: Address */}
                        <ScrollReveal animation="slide-up" duration={800} delay={200}>
                          <div>
                            <h3 className="text-xl font-bold mb-4 text-primary">Address</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              Saveetha Institute of Medical and Technical Sciences
                              <br />
                              Saveetha Nagar, Thandalam
                              <br />
                              Chennai - 602 105
                            </p>
                          </div>
                        </ScrollReveal>

                        {/* Column 3: Contact */}
                        <ScrollReveal animation="slide-up" duration={800} delay={400}>
                          <div>
                            <h3 className="text-xl font-bold mb-4 text-primary">Get in Touch</h3>
                            <div className="space-y-2 text-muted-foreground mb-6">
                              <p className="font-semibold text-foreground">Aswath S</p>
                              <p>+91 70949 25601</p>
                              <p>eyeq.simats@gmail.com</p>
                            </div>
                            <div className="flex gap-4">
                              <motion.a
                                href="https://www.instagram.com/eyeq.simats/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                whileHover={{ scale: 1.1, y: -3, color: "hsl(var(--primary))" }}
                                className="text-muted-foreground"
                              >
                                <Instagram size={28} />
                              </motion.a>
                              <motion.a
                                href="https://www.linkedin.com/company/eyeq-simats/eyeqclub"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                whileHover={{ scale: 1.1, y: -3, color: "hsl(var(--primary))" }}
                                className="text-muted-foreground"
                              >
                                <Linkedin size={28} />
                              </motion.a>
                              <motion.a
                                href="https://wa.me/917094925601"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                whileHover={{ scale: 1.1, y: -3, color: "hsl(var(--primary))" }}
                                className="text-muted-foreground"
                              >
                                <Phone size={28} />
                              </motion.a>
                            </div>
                          </div>
                        </ScrollReveal>
                      </div>

                      <ScrollReveal animation="fade" duration={800} delay={600}>
                        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
                          <p>© 2025 EyeQ Club. All rights reserved.</p>
                        </div>
                      </ScrollReveal>
                    </div>
                  </footer>
                </Element>

                <BannerModal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title={modalContent.title}
                  description={modalContent.description}
                />
              </>
            )}
          </motion.div>
        </ClickSpark>
      )}
    </>
  );
};

export default Index;