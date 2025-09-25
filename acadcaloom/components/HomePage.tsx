import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, BookOpen, ArrowRight, Check, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomePageProps {
  onAuth: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAuth }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      title: "Smart Scheduling",
      description: "Automatically generate conflict-free timetables that work for everyone"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Time Management",
      description: "Optimize class timings and teacher allocations efficiently"
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      title: "Multi-User Support",
      description: "Different views for teachers and students with role-based access"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-rose-500" />,
      title: "Subject Planning",
      description: "Easy subject allocation and management for all classes"
    }
  ];

  const demoScreens = [
    { title: "Class Schedule", image: "/images/class-schedule.png" },
    { title: "Teacher Dashboard", image: "/images/teacher-dashboard.png" },
    { title: "Subject Management", image: "/images/subject-management.png" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] -z-10" />
      
      <header className="p-6 backdrop-blur-sm bg-white/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              AcademicCal Pro
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Features</a>
              <a href="#demo" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Demo</a>
            </nav>
            <Button 
              onClick={onAuth}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
              variant="default"
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-bold"
          >
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Revolutionize Your
            </span>
            <br />
            <span className="text-gray-900">Class Scheduling</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Create perfect class schedules automatically with our intelligent timetable generator. Save time and eliminate conflicts effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4"
          >
            <Button 
              onClick={onAuth}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group font-semibold"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-gray-200 font-semibold"
              onClick={() => setIsVideoModalOpen(true)}
            >
              Watch Demo
              <Play className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-8 text-gray-600"
          >
            <div className="flex items-center bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">Easy to get started</span>
            </div>
            <div className="flex items-center bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">24/7 active</span>
            </div>
            <div className="flex items-center bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">Genetic Algorithm</span>
            </div>
          </motion.div>
        </div>

        <section id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Perfect Scheduling
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make timetable management a breeze
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 * (index + 3) }}
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-2xl h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="demo" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sneak Peek into Our App
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out the demo screens to see how AcademicCal Pro works
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm p-8 rounded-2xl">
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100/50 p-1 rounded-xl">
                <TabsTrigger 
                  value="schedule" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow rounded-lg font-semibold"
                >
                  Class Schedule
                </TabsTrigger>
                <TabsTrigger 
                  value="dashboard" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow rounded-lg font-semibold"
                >
                  Teacher Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="management" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow rounded-lg font-semibold"
                >
                  Subject Management
                </TabsTrigger>
              </TabsList>
              {demoScreens.map((screen, index) => (
                <TabsContent key={index} value={["schedule", "dashboard", "management"][index]}>
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                    <Image 
                      src={screen.image} 
                      alt={screen.title}
                      width={1200}
                      height={675}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </section>
      </main>

      {/* YouTube Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-4xl mx-4">
            <Button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              variant="ghost"
              size="icon"
            >
              <X className="w-8 h-8" />
            </Button>
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/MsONo4GRQqQ"
                title="AcademicCal Pro Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold">AcademicCal Pro</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                A smart solution for academic timetable management using advanced algorithms and modern web technologies.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/puneeth067/scheduloom" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://scheduloom-one.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors font-medium">
                  Live App
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Project Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  Smart Scheduling
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  Multi-User Support
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  Subject Management
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  Teacher Allocation
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  Genetic Algorithm
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Technologies Used</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  Next.js 14
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  TypeScript
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  Tailwind CSS
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  Supabase
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  Genetic Algorithms
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  Framer Motion
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            © 2024 College Timetable Generator - AcademicCal Pro 
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;