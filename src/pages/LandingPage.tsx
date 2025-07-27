import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserCheck, 
  FaCamera, 
  FaClock, 
  FaShieldAlt,
  FaChartBar,
  FaUsers,
  FaStar,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaPlay,
  FaChevronUp,
  FaTimes
} from 'react-icons/fa';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentDemoImage, setCurrentDemoImage] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentProcessStep, setCurrentProcessStep] = useState(0);

  const features = [
    {
      icon: <FaCamera className="text-4xl text-blue-600" />,
      title: "AI Face Recognition",
      description: "Advanced facial recognition technology with 99.9% accuracy for secure attendance tracking."
    },
    {
      icon: <FaClock className="text-4xl text-green-600" />,
      title: "Real-time Tracking",
      description: "Instant attendance marking with live dashboard updates and notifications."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-purple-600" />,
      title: "Secure & Private",
      description: "End-to-end encryption ensures your biometric data remains completely secure."
    },
    {
      icon: <FaChartBar className="text-4xl text-red-600" />,
      title: "Analytics Dashboard",
      description: "Comprehensive reports and analytics to track attendance patterns and trends."
    },
    {
      icon: <FaUsers className="text-4xl text-yellow-600" />,
      title: "Multi-Organization",
      description: "Support for schools, offices, hotels, hospitals, and any organization type."
    },
    {
      icon: <FaUserCheck className="text-4xl text-indigo-600" />,
      title: "Easy Management",
      description: "Simple user management with role-based access and approval workflows."
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 10 users",
        "Basic face recognition",
        "Standard reports",
        "Email support",
        "Mobile app access",
        "1GB storage"
      ],
      buttonText: "Start Free",
      popular: false,
      color: "gray"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 100 users",
        "Advanced face recognition",
        "Custom reports & analytics",
        "Priority support",
        "API access",
        "10GB storage",
        "Multi-location support",
        "Export data"
      ],
      buttonText: "Start Trial",
      popular: true,
      color: "blue"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited users",
        "AI-powered insights",
        "White-label solution",
        "24/7 dedicated support",
        "Custom integrations",
        "Unlimited storage",
        "Advanced security features",
        "On-premise deployment",
        "Custom training"
      ],
      buttonText: "Contact Sales",
      popular: false,
      color: "purple"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "HR Director",
      company: "TechCorp Solutions",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "FaceTrack has revolutionized our attendance system. The accuracy is incredible and it's saved us countless hours of manual tracking."
    },
    {
      name: "Dr. Michael Chen",
      position: "Principal",
      company: "Riverside High School", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Managing attendance for 2000+ students was a nightmare. FaceTrack made it seamless and secure. Highly recommended!"
    },
    {
      name: "Emma Rodriguez",
      position: "Operations Manager",
      company: "Grand Plaza Hotel",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Perfect for our hotel staff management. The multi-shift tracking and real-time notifications have improved our operations significantly."
    },
    {
      name: "James Wilson",
      position: "Factory Manager",
      company: "AutoTech Manufacturing",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "With 500+ workers across multiple shifts, FaceTrack has eliminated time fraud and streamlined our payroll process completely."
    },
    {
      name: "Lisa Park",
      position: "IT Administrator",
      company: "MediCare Hospital",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Security and privacy were our main concerns. FaceTrack's encryption and HIPAA compliance made it the perfect choice for healthcare."
    },
    {
      name: "Robert Davis",
      position: "Store Manager",
      company: "RetailMax Chain",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Managing attendance across 15 retail locations was chaos. Now everything is centralized and automated. Amazing platform!"
    },
    {
      name: "Maria Santos",
      position: "Office Manager",
      company: "Creative Studios Inc",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Our creative team loves the seamless check-in process. No more time cards or manual logging. It just works beautifully!"
    },
    {
      name: "David Kumar",
      position: "Facilities Director",
      company: "GreenTech Campus",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The environmental benefits alone sold us - no paper, no plastic cards. Plus the analytics help us optimize our workspace usage."
    }
  ];

  // Face Recognition Demo Images
  const demoImages = [
    {
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      alt: "Face Recognition Dashboard",
      status: "Live Recognition Active"
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      alt: "Facial Detection Analysis",
      status: "Face Detected Successfully"
    },
    {
      src: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
      alt: "Multi-Face Recognition",
      status: "Multiple Faces Recognized"
    },
    {
      src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
      alt: "Security Verification",
      status: "Identity Verified"
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop", 
      alt: "Real-time Processing",
      status: "Processing in Real-time"
    }
  ];

  // Face recognition process steps with images
  const processSteps = [
    {
      step: 1,
      title: "Face Capture",
      description: "High-quality camera captures facial features in real-time with advanced lighting compensation and geometric facial mapping",
      image: "https://images.unsplash.com/photo-1595079676909-0927809dc21d?w=800&h=500&fit=crop", // Digital identity scanning
      color: "blue",
      icon: <FaCamera className="text-4xl text-blue-600" />
    },
    {
      step: 2,
      title: "AI Analysis", 
      description: "Advanced algorithms create detailed facial landmarks, analyze biometric patterns, and generate secure digital templates",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=500&fit=crop", // AI analysis interface
      color: "purple",
      icon: <FaUserCheck className="text-4xl text-purple-600" />
    },
    {
      step: 3,
      title: "Instant Match",
      description: "Lightning-fast comparison with stored templates provides instant identity verification with 99.9% accuracy rate", 
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop", // Technology verification
      color: "green",
      icon: <FaCheck className="text-4xl text-green-600" />
    }
  ];

  // Auto-change demo images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemoImage((prev) => (prev + 1) % demoImages.length);
    }, 3000);

    return () => clearInterval(interval as NodeJS.Timeout);
  }, [demoImages.length]);

  // Auto-change process steps every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProcessStep((prev) => (prev + 1) % processSteps.length);
    }, 4000);

    return () => clearInterval(interval as NodeJS.Timeout);
  }, [processSteps.length]);

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 400); // Show after scrolling 400px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Remove hash from URL when component mounts
  useEffect(() => {
    if (window.location.hash) {
      // Wait for component to mount, then remove hash
      setTimeout(() => {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }, 100);
    }
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle video modal keyboard and click events
  useEffect(() => {
    if (showVideoModal) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowVideoModal(false);
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('modal-backdrop')) {
          setShowVideoModal(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleClickOutside);
        document.body.style.overflow = 'unset';
      };
    }
  }, [showVideoModal]);

  // Scroll functions for reviews
  const scrollReviews = (direction: 'left' | 'right') => {
    const container = document.querySelector('.reviews-container') as HTMLElement;
    if (container) {
      const scrollAmount = 370; // Card width + gap
      const newPosition = direction === 'left' 
        ? Math.max(0, container.scrollLeft - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, container.scrollLeft + scrollAmount);
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 md:p-2 rounded-lg">
                <FaCamera className="text-white text-lg md:text-2xl" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FaceTrack
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('reviews')} 
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Reviews
              </button>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
              >
                Login
              </Link>
            </nav>

            <button 
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="space-y-1">
                <div className="w-6 h-0.5 bg-gray-600"></div>
                <div className="w-6 h-0.5 bg-gray-600"></div>
                <div className="w-6 h-0.5 bg-gray-600"></div>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3 pt-4">
                <button 
                  onClick={() => {
                    scrollToSection('features');
                    setIsMenuOpen(false);
                  }} 
                  className="text-gray-600 hover:text-blue-600 text-left cursor-pointer py-2 px-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('pricing');
                    setIsMenuOpen(false);
                  }} 
                  className="text-gray-600 hover:text-blue-600 text-left cursor-pointer py-2 px-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('reviews');
                    setIsMenuOpen(false);
                  }} 
                  className="text-gray-600 hover:text-blue-600 text-left cursor-pointer py-2 px-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Reviews
                </button>
                <Link 
                  to="/contact" 
                  className="text-gray-600 hover:text-blue-600 py-2 px-2 rounded-lg hover:bg-blue-50 transition-colors block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-center font-medium mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-24 md:pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 md:space-y-8 lg:col-span-2">
              <div className="space-y-3 md:space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Smart Attendance
                  </span>
                  <br />
                  with Face Recognition
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Transform your organization's attendance tracking with cutting-edge AI face recognition technology. 
                  Secure, accurate, and effortless for schools, offices, hotels, and more.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-20">
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap text-sm sm:text-base"
                >
                  <span>Start Free Trial</span>
                  <FaArrowRight className="ml-2 flex-shrink-0" />
                </Link>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-200 whitespace-nowrap shadow-lg bg-white text-sm sm:text-base"
                >
                  <FaPlay className="mr-2 flex-shrink-0" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-sm" />
                  99.9% Accuracy
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-sm" />
                  GDPR Compliant
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-sm" />
                  24/7 Support
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-3 group">
              <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl p-1 transform transition-all duration-500 group-hover:scale-102 group-hover:shadow-2xl">
                <div className="bg-white rounded-3xl p-8">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src={demoImages[currentDemoImage].src} 
                      alt={demoImages[currentDemoImage].alt}
                      className="w-full h-96 object-cover rounded-2xl transition-all duration-1000 ease-in-out group-hover:scale-105"
                      key={currentDemoImage} // Force re-render for smooth transition
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl group-hover:from-black/40 transition-all duration-500"></div>
                    
                    {/* Status Indicator */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="bg-green-500 w-2.5 h-2.5 rounded-full inline-block mr-2 animate-pulse shadow-lg"></div>
                      <span className="text-xs font-medium bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {demoImages[currentDemoImage].status}
                      </span>
                    </div>

                    {/* Progress Indicators */}
                    <div className="absolute top-4 right-4 flex space-x-1">
                      {demoImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentDemoImage(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                            index === currentDemoImage
                              ? 'bg-white shadow-lg'
                              : 'bg-white/40 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Face Recognition Overlay Animation */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div 
                        className="absolute border-2 border-blue-400 rounded-lg animate-pulse group-hover:border-blue-500 group-hover:shadow-blue-400/50 group-hover:shadow-lg transition-all duration-300"
                        style={{
                          width: '120px',
                          height: '120px',
                          top: '35%',
                          left: '40%',
                          transform: 'translate(-50%, -50%)',
                          animation: `scanAnimation 3s ease-in-out infinite`
                        }}
                      />
                      <div 
                        className="absolute text-blue-400 text-[10px] font-mono font-bold tracking-wider group-hover:text-blue-500 transition-colors duration-300"
                        style={{
                          top: '25%',
                          left: '40%',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        SCANNING...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 p-3 rounded-2xl animate-bounce group-hover:animate-pulse group-hover:bg-yellow-300 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg z-10">
                <FaUserCheck className="text-2xl text-yellow-800 group-hover:text-yellow-900 transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animations for Demo */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html {
              scroll-behavior: smooth;
            }
            
            @keyframes scanAnimation {
              0% {
                opacity: 0.3;
                transform: translate(-50%, -50%) scale(0.8);
                border-color: #60A5FA;
              }
              50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.1);
                border-color: #3B82F6;
              }
              100% {
                opacity: 0.3;
                transform: translate(-50%, -50%) scale(0.8);
                border-color: #60A5FA;
              }
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: scale(1.05);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }

            @keyframes fade-in {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes scale-in {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }

            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
            }

            .animate-scale-in {
              animation: scale-in 0.3s ease-out;
            }
          `
        }} />
      </section>

      {/* How Face Recognition Works */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-10 blur-2xl"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Our <span className="text-blue-600">Face Recognition</span> Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology makes attendance tracking effortless and secure
            </p>
          </div>

          {/* Process Steps - Mobile Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {processSteps.map((process, index) => (
              <div 
                key={index}
                className={`text-center group transform transition-all duration-500 ${
                  index === currentProcessStep ? 'scale-110 z-10' : 'scale-100 opacity-70'
                }`}
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 shadow-lg group-hover:shadow-xl ${
                  process.color === 'blue' 
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300' 
                    : process.color === 'purple'
                    ? 'bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300'
                    : 'bg-gradient-to-br from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300'
                }`}>
                  <span className={`text-xl md:text-2xl font-bold ${
                    process.color === 'blue' ? 'text-blue-600' : process.color === 'purple' ? 'text-purple-600' : 'text-green-600'
                  }`}>
                    {process.step}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{process.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed px-2">{process.description}</p>
              </div>
            ))}
          </div>

          {/* Auto-Sliding Image Display */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
            <div className="relative h-48 md:h-80 overflow-hidden rounded-xl md:rounded-2xl">
              <img 
                src={processSteps[currentProcessStep].image} 
                alt={processSteps[currentProcessStep].title}
                className="w-full h-full object-cover transition-all duration-1000 ease-in-out transform group-hover:scale-110"
                key={currentProcessStep}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              
              {/* Step Indicator */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                <div className="bg-white/90 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className={`p-2 rounded-full ${
                      processSteps[currentProcessStep].color === 'blue' ? 'bg-blue-100' :
                      processSteps[currentProcessStep].color === 'purple' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {processSteps[currentProcessStep].icon}
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-semibold text-gray-900">
                        Step {processSteps[currentProcessStep].step}: {processSteps[currentProcessStep].title}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600">Currently Processing...</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 flex space-x-1 md:space-x-2">
                {processSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProcessStep(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentProcessStep
                        ? 'bg-white shadow-lg scale-125'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Live Processing Animation */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6">
              <div className="bg-green-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                Live Processing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-5 blur-3xl"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Powerful Features for Modern Organizations
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Everything you need to streamline attendance management across your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Flexible pricing options that grow with your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-200 ${
                  plan.popular ? 'ring-2 md:ring-4 ring-blue-500 transform md:scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4 rounded-full text-xs md:text-sm font-semibold mb-4">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl md:text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 text-sm md:text-base">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-4 px-6 rounded-full font-semibold transition-all duration-200 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg' 
                      : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section id="reviews" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands of Organizations
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-4">
              See what our customers say about FaceTrack
            </p>
          </div>

          {/* Horizontal Scrollable Reviews */}
          <div className="relative">
            {/* Left Arrow - Hidden on mobile */}
            <button
              onClick={() => scrollReviews('left')}
              className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hover:scale-110"
              style={{ marginLeft: '-20px' }}
            >
              <FaArrowLeft className="text-blue-600 text-lg" />
            </button>

            {/* Right Arrow - Hidden on mobile */}
            <button
              onClick={() => scrollReviews('right')}
              className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hover:scale-110"
              style={{ marginRight: '-20px' }}
            >
              <FaArrowRight className="text-blue-600 text-lg" />
            </button>

            <div 
              className="reviews-container flex space-x-4 md:space-x-6 overflow-x-auto pb-6 scrollbar-hide px-4 md:px-0" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 md:p-8 rounded-2xl min-w-[280px] md:min-w-[350px] max-w-[280px] md:max-w-[350px] shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex-shrink-0 border border-gray-100 hover:border-blue-200 group"
                >
                  <div className="flex items-center mb-3 md:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-base md:text-lg group-hover:text-yellow-500 transition-colors duration-300" style={{
                        animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`
                      }} />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 text-sm md:text-base">"{testimonial.text}"</p>
                  
                  <div className="flex items-center">
                    <div className="relative">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4 ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all duration-300 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 text-sm md:text-base">{testimonial.name}</h4>
                      <p className="text-xs md:text-sm text-gray-600">{testimonial.position}</p>
                      <p className="text-xs md:text-sm text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scroll hint gradient */}
            <div className="absolute right-12 top-0 bottom-6 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>

          {/* See All Reviews Button */}
          <div className="text-center mt-8 md:mt-12">
            <Link 
              to="/reviews" 
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
            >
              See All Reviews
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        {/* CSS styles for scrollbar hiding */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `
        }} />
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white relative overflow-hidden">
        {/* Curved top */}
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 Q300,20 600,50 T1200,30 L1200,0 L0,0 Z" fill="white"/>
          </svg>
        </div>
        
        {/* Sky-like background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-400/10 to-cyan-300/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-indigo-400/8 to-sky-300/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 pt-16 md:pt-20 pb-8 md:pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Company Info */}
            <div className="md:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 md:p-2 rounded-lg">
                  <FaCamera className="text-white text-lg md:text-2xl" />
                </div>
                <span className="text-xl md:text-2xl font-bold">FaceTrack</span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-base">
                Leading the future of attendance management with AI-powered face recognition technology. 
                Trusted by thousands of organizations worldwide for secure, accurate, and effortless attendance tracking.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#" className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-full hover:from-blue-700 hover:to-blue-800 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group">
                  <FaFacebook className="text-xl md:text-2xl text-white group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="bg-gradient-to-r from-sky-400 to-sky-600 p-4 rounded-full hover:from-sky-500 hover:to-sky-700 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group">
                  <FaTwitter className="text-xl md:text-2xl text-white group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 rounded-full hover:from-blue-800 hover:to-blue-950 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group">
                  <FaLinkedin className="text-xl md:text-2xl text-white group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="bg-gradient-to-r from-gray-600 to-gray-800 p-4 rounded-full hover:from-gray-700 hover:to-gray-900 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group">
                  <FaEnvelope className="text-xl md:text-2xl text-white group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection('features')} 
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('pricing')} 
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('reviews')} 
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Reviews
                  </button>
                </li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div id="contact">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaEnvelope className="mr-3 text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm md:text-base">hello@facetrack.com</span>
                </li>
                <li className="flex items-start">
                  <FaPhone className="mr-3 text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm md:text-base">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <FaMapMarkerAlt className="mr-3 text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm md:text-base">
                    123 Innovation Street<br />Tech Valley, CA 94102
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center">
            <p className="text-gray-300 text-xs md:text-sm">
              © 2024 FaceTrack. All rights reserved. Made with ❤️ for modern organizations.
            </p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-4xl w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                How Face Recognition Works
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close modal"
              >
                <FaTimes className="text-gray-500 text-xl hover:text-gray-700" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative pb-[56.25%] h-0"> {/* 16:9 aspect ratio */}
              <iframe
                src="https://www.youtube.com/embed/OB0eGgIKZQA?autoplay=1&mute=1&rel=0&controls=1&modestbranding=1"
                title="How Face Recognition Algorithm Works"
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FaUserCheck className="text-blue-600 mr-2" />
                  <span>AI-Powered Detection</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaShieldAlt className="text-green-600 mr-2" />
                  <span>99.9% Accuracy</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaClock className="text-purple-600 mr-2" />
                  <span>Real-time Processing</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Link
                  to="/register"
                  onClick={() => setShowVideoModal(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
                >
                  Start Your Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 md:bottom-8 right-4 md:right-8 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 md:p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-bounce hover:animate-none group"
          aria-label="Scroll to top"
        >
          <FaChevronUp className="text-lg md:text-xl group-hover:scale-110 transition-transform duration-200" />
        </button>
      )}
    </div>
  );
};

export default LandingPage; 