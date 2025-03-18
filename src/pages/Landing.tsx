import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, BarChart3, MessageSquare, Check, Zap, Shield, Clock, Users, Star, PlusCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const Landing = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setLoading(false);
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Handle Get Started button click
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e6e9f0]">
      {/* Navigation */}
      <nav className="p-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/d8bfce19-2f0d-46f6-9fbe-924f64b656e2.png" 
            alt="Cozy Task Logo" 
            className="w-12 h-12 object-contain"
          />
          <span className="text-2xl font-patrick text-primary">Cozy Task</span>
        </div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started Free</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-medium mb-4"
            >
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Introducing Cozy Task
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Conquer Procrastination with AI-Powered Task Management
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-gray-600 mb-8"
            >
              Cozy Task analyzes your habits and generates personalized, actionable tasks to help you stay productive and focused.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="w-full sm:w-auto" onClick={handleGetStarted}>
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Watch Demo</Button>
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex-1"
          >
            <motion.img 
              whileHover={{ scale: 1.03, rotate: -1 }}
              transition={{ type: "spring", stiffness: 300 }}
              src="/lovable-uploads/output_image.png"
              alt="Dashboard Preview" 
              className="w-full max-w-2xl mx-auto drop-shadow-2xl rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Supercharge Your Productivity</h2>
            <p className="text-gray-600">
              Cozy Task combines cutting-edge artificial intelligence with proven productivity techniques to help you accomplish more.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="p-6 bg-white rounded-xl shadow-sm"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Habit-Based Insights</h3>
              <p className="text-gray-600">
                Receive insights about your productivity patterns and optimal work times.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="p-6 bg-white rounded-xl shadow-sm"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant Chatbot</h3>
              <p className="text-gray-600">
                Chat with an AI assistant that helps you manage your tasks more effectively.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="p-6 bg-white rounded-xl shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Task Breakdown</h3>
              <p className="text-gray-600">
                Automatically break down complex tasks into manageable steps with AI assistance.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="p-6 bg-white rounded-xl shadow-sm"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Optimization</h3>
              <p className="text-gray-600">
                Schedule tasks during your most productive hours based on your personal patterns.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-medium mb-4">
              Premium Features
            </div>
            <h2 className="text-3xl font-bold mb-4">Designed for Focus and Clarity</h2>
            <p className="text-gray-600">
              Cozy Task combines cutting-edge artificial intelligence with proven productivity techniques to help you accomplish more.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Smart Task Prioritization</h3>
                  <p className="text-gray-600">
                    Cozy Task automatically prioritizes your tasks based on deadlines, importance, and your work patterns.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Seamless Calendar Integration</h3>
                  <p className="text-gray-600">
                    Sync with your existing calendar to automatically schedule tasks and avoid conflicts.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Adaptive Learning</h3>
                  <p className="text-gray-600">
                    The more you use Cozy Task, the smarter it gets, adapting to your preferences and work style.
                  </p>
                </div>
              </div>

              <Button size="lg" className="mt-4" onClick={handleGetStarted}>
                {isAuthenticated ? 'Go to Dashboard' : 'Learn More'}
              </Button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Task Management</h3>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">New</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                          <Check className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Follow up on client email</p>
                          <p className="text-xs text-gray-500">Based on your communication patterns</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Prepare for tomorrow's meeting</p>
                          <p className="text-xs text-gray-500">Scheduled for 10:00 AM</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                          <Check className="w-3 h-3 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Break down "Morning workout"</p>
                          <p className="text-xs text-gray-500">Make it more manageable</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-600 font-medium mb-4">
              Pricing
            </div>
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start for free, upgrade when you need more features. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Basic to-do list features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Task creation and due dates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Reminders and categorization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Limited AI suggestions</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full" variant="outline">Get Started</Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-xl shadow-md border-2 border-purple-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">$4.99</span>
                <span className="text-gray-500 ml-1">/per month</span>
              </div>
              <p className="text-gray-600 mb-6">For productivity enthusiasts</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span>Unlimited AI task suggestions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span>Automatic task breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span>Habit-based insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span>AI assistant chatbot</span>
                </li>
              </ul>
              <Link to="/payment-plans">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade Now</Button>
              </Link>
            </div>

            {/* Teams Plan */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-2">Teams</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-500 ml-1">/per user/month</span>
              </div>
              <p className="text-gray-600 mb-6">For teams and organizations</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Team collaboration features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Task delegation and tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Team analytics and insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Admin controls and permissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-yellow-100 rounded-full text-yellow-600 font-medium mb-4">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Testimonials
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">What People Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what people are saying about Cozy Task's productivity features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stars: 5,
                text: "As someone who struggles with procrastination, this app has been a game-changer. Breaking tasks down automatically makes everything feel more manageable.",
                name: "Michael Chen",
                role: "Software Developer",
                initials: "MC",
                bgColor: "blue"
              },
              {
                stars: 5,
                text: "The AI assistant is like having a personal productivity coach. It helps me stay on track and suggests better ways to organize my tasks.",
                name: "Sarah Johnson",
                role: "Project Manager",
                initials: "SJ",
                bgColor: "green"
              },
              {
                stars: 4,
                text: "The habit insights have helped me identify when I'm most productive. I've restructured my day based on these insights and seen a 30% increase in output.",
                name: "Emily Rodriguez",
                role: "Marketing Director",
                initials: "ER",
                bgColor: "pink"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className={`w-10 h-10 bg-${testimonial.bgColor}-100 rounded-full flex items-center justify-center mr-3`}>
                    <span className={`text-${testimonial.bgColor}-600 font-semibold`}>{testimonial.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
              <p className="text-lg text-purple-100 mb-6">
                Join thousands of users who have transformed their workflow with TaskFlow AI. Start your free trial today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">Get Started Free</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>





      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 font-medium mb-4">
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                How It Works
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Simple Steps to Productivity</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started with Cozy Task is easy. Follow these simple steps to transform your productivity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 z-0" />

            {[
              {
                step: 1,
                title: "Sign Up & Set Goals",
                description: "Create your account and tell us about your productivity goals and challenges.",
                icon: PlusCircle,
                color: "purple"
              },
              {
                step: 2,
                title: "AI Analysis",
                description: "Our AI analyzes your habits and creates a personalized productivity plan.",
                icon: Brain,
                color: "blue"
              },
              {
                step: 3,
                title: "Track & Improve",
                description: "Complete tasks, get insights, and watch your productivity soar.",
                icon: BarChart3,
                color: "green"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="relative z-10 flex flex-col items-center"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: 0.3 + (0.2 * index),
                    duration: 0.8 
                  }}
                  className={`w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center mb-6`}
                >
                  <div className="relative">
                    {React.createElement(step.icon, { className: `w-8 h-8 text-${step.color}-600` })}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-${step.color}-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {step.step}
                    </div>
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white" onClick={handleGetStarted}>
              Get Started in Minutes
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#f0f4f8] to-[#e6e9f0]">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-orange-100 rounded-full text-orange-600 font-medium mb-4">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                FAQ
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about Cozy Task and how it can help you be more productive.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How does Cozy Task use AI to improve productivity?",
                  answer: "Cozy Task analyzes your work patterns, task completion history, and productivity cycles to identify when you're most effective. It then suggests optimal times for different types of tasks, breaks down complex projects into manageable steps, and provides personalized productivity insights."
                },
                {
                  question: "Is my data secure with Cozy Task?",
                  answer: "Absolutely. We take data security seriously. All your data is encrypted both in transit and at rest. We never share your personal information with third parties, and our AI processing follows strict privacy guidelines. You can also export or delete your data at any time."
                },
                {
                  question: "Can I use Cozy Task with my existing tools?",
                  answer: "Yes! Cozy Task integrates seamlessly with popular productivity tools like Google Calendar, Microsoft Outlook, Slack, and more. You can sync your existing tasks and calendars to get a unified view of your productivity landscape."
                },
                {
                  question: "What makes Cozy Task different from other task managers?",
                  answer: "Unlike traditional task managers that just list your to-dos, Cozy Task actively helps you work better. Our AI assistant learns your habits, suggests better ways to organize your day, breaks down complex tasks, and adapts to your unique productivity style over time."
                },
                {
                  question: "Do I need to pay for Cozy Task?",
                  answer: "Cozy Task offers a generous free tier that includes basic task management features. For advanced AI capabilities, analytics, and team features, we offer affordable Premium and Teams plans with monthly or annual billing options."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <AccordionItem value={`item-${index}`} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-all">
                      <span className="text-left font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2">
                      <p className="text-gray-600">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="lg:max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
              <p className="text-lg text-purple-100 mb-6">
                Transform your workflow with Cozy Task. Start your free trial today.
              </p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/signup">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">Get Started Free</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Learn More</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;