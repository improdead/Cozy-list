import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, BarChart3, MessageSquare, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-medium mb-4">
              Introducing Cozy Task
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conquer Procrastination with AI-Powered Task Management
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Cozy Task analyzes your habits and generates personalized, actionable tasks to help you stay productive and focused.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto" onClick={handleGetStarted}>
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Watch Demo</Button>
            </div>
          </div>
          <div className="flex-1">
            <img 
              src="/lovable-uploads/output_image.png"
              alt="Dashboard Preview" 
              className="w-full max-w-2xl mx-auto drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Supercharge Your Productivity</h2>
            <p className="text-gray-600">
              Cozy Task combines cutting-edge artificial intelligence with proven productivity techniques to help you accomplish more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Habit-Based Insights</h3>
              <p className="text-gray-600">
                Receive insights about your productivity patterns and optimal work times.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant Chatbot</h3>
              <p className="text-gray-600">
                Chat with an AI assistant that helps you manage your tasks more effectively.
              </p>
            </div>
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
              <Link to="/signup">
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
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-yellow-100 rounded-full text-yellow-600 font-medium mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their productivity with Cozy Task.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">
                "As someone who struggles with procrastination, this app has been a game-changer. Breaking tasks down automatically makes everything feel more manageable."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">MC</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-gray-500">Software Developer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex mb-4">
                {[1, 2, 3, 4].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-gray-700 italic mb-6">
                "The habit insights have helped me identify when I'm most productive. I've restructured my day based on these insights and seen a 30% increase in output."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-pink-600 font-semibold">ER</span>
                </div>
                <div>
                  <h4 className="font-semibold">Emily Rodriguez</h4>
                  <p className="text-sm text-gray-500">Marketing Director</p>
                </div>
              </div>
            </div>
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

      {/* Footer */}
      <footer className="bg-white/50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Integrations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Guides</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-purple-600">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/d8bfce19-2f0d-46f6-9fbe-924f64b656e2.png" 
                alt="Cozy Task Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-patrick text-primary">Cozy Task</span>
            </div>
            <p className="text-gray-600">&copy; {new Date().getFullYear()} Cozy Task. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
              <p className="text-lg text-purple-100 mb-6">
                Join thousands of users who have transformed their workflow with Cozy Task. Start your free trial today.
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
    </div>
  );
};

export default Landing;