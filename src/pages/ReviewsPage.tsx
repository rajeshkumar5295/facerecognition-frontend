import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaStar, 
  FaCamera,
  FaSpinner
} from 'react-icons/fa';

const ReviewsPage: React.FC = () => {
  const allTestimonials = [
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
    },
    {
      name: "Jennifer Lee",
      position: "Principal",
      company: "Sunrise Elementary",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Parents love the transparency and security. Real-time notifications when their children arrive safely give them peace of mind."
    },
    {
      name: "Carlos Martinez",
      position: "Security Chief",
      company: "Metro Bank",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Bank security requires the highest standards. FaceTrack's accuracy and fraud prevention features exceed our expectations."
    }
  ];

  const [visibleReviews, setVisibleReviews] = useState(3); // Initially show 3 reviews
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    // Immediate scroll to top for instant page load
    window.scrollTo(0, 0);
    
    // Also ensure any pending scroll operations are reset
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Load more reviews function
  const loadMoreReviews = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const newVisibleCount = Math.min(visibleReviews + 2, allTestimonials.length);
      setVisibleReviews(newVisibleCount);
      
      // Check if we've loaded all reviews
      if (newVisibleCount >= allTestimonials.length) {
        setHasMore(false);
      }
      
      setIsLoading(false);
    }, 800); // 800ms delay to simulate loading
  }, [isLoading, hasMore, visibleReviews, allTestimonials.length]);

  // Scroll event listener for lazy loading
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      
      // Load more when user is 500px from bottom
      if (scrollHeight - scrollTop - clientHeight < 500) {
        loadMoreReviews();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreReviews, isLoading, hasMore]);

  // Get only visible reviews
  const displayedReviews = allTestimonials.slice(0, visibleReviews);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FaCamera className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FaceTrack
              </span>
            </Link>
            <Link 
              to="/" 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customers</span> Say
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8 px-4">
            Discover why thousands of organizations worldwide trust FaceTrack for their attendance management
          </p>
          <div className="flex items-center justify-center flex-wrap space-x-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-xl md:text-2xl" />
            ))}
            <span className="text-gray-700 text-base md:text-lg ml-3 mt-2 md:mt-0">4.9/5 from 1,200+ reviews</span>
          </div>
        </div>
      </section>

      {/* Timeline Reviews Layout */}
      <section className="py-12 md:py-20 relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full opacity-20 blur-xl"></div>

        <div className="container mx-auto px-4">
          {/* Timeline Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Center Line - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-300 via-purple-400 to-indigo-500 h-full rounded-full shadow-sm"></div>
            
            {/* Center Timeline Dots - Hidden on mobile */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
              {displayedReviews.map((_, index) => (
                <div
                  key={index}
                  className="w-5 h-5 bg-gradient-to-br from-white to-blue-50 border-4 border-purple-400 rounded-full shadow-lg absolute z-10 transform -translate-x-1/2"
                  style={{ 
                    top: `${(index * 280) + 80}px`,
                    animation: `pulseTimeline 2s ease-in-out infinite ${Math.min(index * 0.3, 1.8)}s`
                  }}
                ></div>
              ))}
            </div>

            {/* Reviews Timeline */}
            <div className="space-y-8 md:space-y-16 pt-8 md:pt-16">
              {displayedReviews.map((testimonial, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } relative`}
                >
                  {/* Review Card */}
                  <div
                    className={`w-full md:w-5/12 transform transition-all duration-700 hover:scale-105 ${
                      index % 2 === 0 
                        ? 'md:translate-x-8 hover:md:translate-x-12' 
                        : 'md:-translate-x-8 hover:md:-translate-x-12'
                    }`}
                    style={{
                      animation: `fadeInUp 0.8s ease-out ${Math.min(index * 0.15, 1.2)}s both`
                    }}
                  >
                    <div className={`relative p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl border transition-all duration-300 ${
                      index % 3 === 0 
                        ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200 hover:border-blue-300' 
                        : index % 3 === 1
                        ? 'bg-gradient-to-br from-purple-50 to-white border-purple-200 hover:border-purple-300'
                        : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200 hover:border-indigo-300'
                    }`}>
                      {/* User Info */}
                      <div className={`flex items-center mb-6 ${
                        index % 2 === 0 ? 'flex-row md:flex-row' : 'flex-row md:flex-row-reverse'
                      }`}>
                        <div className="relative">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg ring-4 ${
                              index % 3 === 0 ? 'ring-blue-200' : index % 3 === 1 ? 'ring-purple-200' : 'ring-indigo-200'
                            }`}
                          />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                            index % 3 === 0 ? 'bg-blue-500' : index % 3 === 1 ? 'bg-purple-500' : 'bg-indigo-500'
                          }`}></div>
                        </div>
                        <div className={`${
                          index % 2 === 0 ? 'ml-4 md:ml-4 text-left' : 'ml-4 md:mr-4 md:ml-0 text-left md:text-right'
                        }`}>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900">{testimonial.name}</h3>
                          <p className={`font-semibold text-sm md:text-base ${
                            index % 3 === 0 ? 'text-blue-600' : index % 3 === 1 ? 'text-purple-600' : 'text-indigo-600'
                          }`}>{testimonial.position}</p>
                          <p className="text-gray-600 text-xs md:text-sm">{testimonial.company}</p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className={`flex items-center mb-4 ${
                        index % 2 === 0 ? 'justify-start md:justify-start' : 'justify-start md:justify-end'
                      }`}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-base md:text-lg mx-0.5 animate-pulse" style={{
                            animationDelay: `${i * 0.1}s`
                          }} />
                        ))}
                      </div>
                      
                      {/* Review Text */}
                      <blockquote 
                        className={`text-gray-700 text-base md:text-lg leading-relaxed italic ${
                          index % 2 === 0 ? 'text-left md:text-left' : 'text-left md:text-right'
                        }`}
                      >
                        "{testimonial.text}"
                      </blockquote>

                      {/* Arrow pointing to timeline - Hidden on mobile */}
                      <div 
                        className={`hidden md:block absolute top-1/2 transform -translate-y-1/2 w-0 h-0 ${
                          index % 2 === 0 
                            ? 'right-0 translate-x-full border-y-transparent' 
                            : 'left-0 -translate-x-full border-y-transparent'
                        }`}
                        style={{
                          filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.15))',
                          ...(index % 2 === 0 
                            ? { 
                                borderLeftWidth: '14px', 
                                borderTopWidth: '14px', 
                                borderBottomWidth: '14px',
                                borderLeftColor: index % 3 === 0 ? '#3B82F6' : index % 3 === 1 ? '#8B5CF6' : '#6366F1'
                              }
                            : { 
                                borderRightWidth: '14px', 
                                borderTopWidth: '14px', 
                                borderBottomWidth: '14px',
                                borderRightColor: index % 3 === 0 ? '#3B82F6' : index % 3 === 1 ? '#8B5CF6' : '#6366F1'
                              })
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Spacer for center line - Hidden on mobile */}
                  <div className="hidden md:block w-2/12"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Loading Indicator and Load More */}
          <div className="text-center mt-12 md:mt-16">
            {isLoading && (
              <div className="flex items-center justify-center mb-8">
                <FaSpinner className="text-2xl text-blue-600 animate-spin mr-3" />
                <span className="text-gray-600 text-lg">Loading more reviews...</span>
              </div>
            )}
            
            {hasMore && !isLoading && (
              <button
                onClick={loadMoreReviews}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
              >
                Load More Reviews
              </button>
            )}
            
            {!hasMore && (
              <div className="text-gray-500 text-lg">
                🎉 You've seen all our amazing reviews!
              </div>
            )}
          </div>
        </div>

        {/* Keyframe Animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(60px) scale(0.9);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            @keyframes pulseTimeline {
              0%, 100% {
                transform: translateX(-50%) scale(1);
                opacity: 1;
              }
              50% {
                transform: translateX(-50%) scale(1.2);
                opacity: 0.8;
              }
            }
            
            @keyframes gradientShift {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
            
            /* Mobile responsive animations */
            @media (max-width: 768px) {
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(30px) scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
            }
          `
        }} />
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-white via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-10 blur-2xl"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Trusted by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 group">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">5,000+</div>
                <div className="text-gray-600 text-sm md:text-base">Organizations</div>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto"></div>
              </div>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200 group">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                <div className="text-gray-600 text-sm md:text-base">Accuracy Rate</div>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto"></div>
              </div>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-200 group">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-gray-600 text-sm md:text-base">Support</div>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto"></div>
              </div>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-100 hover:border-yellow-200 group">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  4.9
                  <FaStar className="ml-1 text-2xl md:text-3xl text-yellow-500" />
                </div>
                <div className="text-gray-600 text-sm md:text-base">Customer Rating</div>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-0 w-24 h-24 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-1/3 right-0 w-28 h-28 bg-white rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to <span className="text-yellow-300">Join Them?</span>
          </h2>
          <p className="text-base md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start your free trial today and experience the difference that thousands of organizations already love
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="inline-flex items-center bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50 group"
            >
              Start Free Trial
              <FaArrowLeft className="ml-2 transform rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <Link 
              to="/contact" 
              className="inline-flex items-center border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Schedule Demo
              <FaCamera className="ml-2" />
            </Link>
          </div>

          <div className="mt-8 md:mt-12 text-sm opacity-75">
            <p>✨ No credit card required • 14-day free trial • Setup in 5 minutes</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage; 