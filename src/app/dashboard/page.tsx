import DashboardLayout from "@/components/layouts/DashboardLayout";
import VerificationBadge from "@/components/dashboard/VerificationBadge";

export const metadata = {
  title: "Dashboard | DeepFake Detection Platform",
  description: "Your personal dashboard for deepfake detection and verification",
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Main content */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to your DeepFake Research Dashboard</h2>
              <p className="text-gray-300 mb-4">
                This is your hub for deepfake detection research, learning, and collaboration. 
                Track your progress, access resources, and connect with other researchers.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <a href="/roadmap" className="bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-800/50 rounded-lg p-4 transition-colors flex items-center">
                  <div className="rounded-full bg-indigo-500/20 p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Learning Roadmap</h3>
                    <p className="text-sm text-gray-400">Continue your deepfake detection education</p>
                  </div>
                </a>
                
                <a href="/tools" className="bg-purple-900/30 hover:bg-purple-900/50 border border-purple-800/50 rounded-lg p-4 transition-colors flex items-center">
                  <div className="rounded-full bg-purple-500/20 p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Detection Tools</h3>
                    <p className="text-sm text-gray-400">Access our deepfake detection tools</p>
                  </div>
                </a>
                
                <a href="/resources" className="bg-amber-900/30 hover:bg-amber-900/50 border border-amber-800/50 rounded-lg p-4 transition-colors flex items-center">
                  <div className="rounded-full bg-amber-500/20 p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Research Resources</h3>
                    <p className="text-sm text-gray-400">Papers, datasets, and more</p>
                  </div>
                </a>
                
                <a href="/community" className="bg-teal-900/30 hover:bg-teal-900/50 border border-teal-800/50 rounded-lg p-4 transition-colors flex items-center">
                  <div className="rounded-full bg-teal-500/20 p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Community</h3>
                    <p className="text-sm text-gray-400">Connect with other researchers</p>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="text-gray-400 text-center py-8">
                <p>Your activity will appear here as you use the platform.</p>
                <button className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors">
                  Explore Platform
                </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <VerificationBadge />
            
            {/* Upcoming Events */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                <div className="p-3 border border-indigo-900/50 bg-indigo-900/20 rounded-lg">
                  <span className="text-xs font-medium text-indigo-400 mb-1 block">June 15, 2023</span>
                  <h3 className="font-medium text-white">Deepfake Detection Workshop</h3>
                  <p className="text-sm text-gray-400">Learn the latest techniques in deepfake detection</p>
                </div>
                <div className="p-3 border border-indigo-900/50 bg-indigo-900/20 rounded-lg">
                  <span className="text-xs font-medium text-indigo-400 mb-1 block">July 3, 2023</span>
                  <h3 className="font-medium text-white">Research Symposium</h3>
                  <p className="text-sm text-gray-400">Share your findings with the community</p>
                </div>
              </div>
              <a href="/events" className="block text-center text-indigo-400 hover:text-indigo-300 font-medium mt-4 text-sm">
                View All Events
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 