import IdeasChart from '@/components/IdeaCard'; // Import the new chart component

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of system activities and AI insights.</p>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Ideas</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">1,284</h3>
            <p className="text-xs text-green-600 mt-2 font-medium">+12% from last month</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Contributors</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">856</h3>
            <p className="text-xs text-green-600 mt-2 font-medium">+5% from last month</p>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
        </div>

        {/* Card 3: AI Sentiment Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">AI POWERED</span>
              <p className="text-sm font-medium text-gray-700">Overall Sentiment</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">78% Positive</h3>
            <p className="text-xs text-gray-600 mt-2">Based on NLP analysis of all recent comments and ideas.</p>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent border-r-transparent transform rotate-45"></div>
            <span className="text-xl z-10">🚀</span>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: REAL CHART INJECTED HERE */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Ideas Submissions by Department</h2>
            <select className="text-sm border-gray-300 rounded-md text-gray-600 outline-none focus:ring-blue-500">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          
          {/* Rendering the Recharts Component */}
          <IdeasChart />
          
        </div>

        {/* Right Column: Trending / AI Extracted Topics */}
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Trending Topics</h2>
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">Live</span>
          </div>
          
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-lg">💻</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">IT Infrastructure</p>
                  <p className="text-xs text-gray-500">142 mentions</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600">+24%</span>
            </li>
             <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-lg">🍔</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Canteen Menu</p>
                  <p className="text-xs text-gray-500">89 mentions</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600">+12%</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-lg">🚗</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Parking Space</p>
                  <p className="text-xs text-gray-500">56 mentions</p>
                </div>
              </div>
              <span className="text-xs font-bold text-red-500">-5%</span>
            </li>
          </ul>

          <button className="w-full mt-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            View Full Report
          </button>
        </div>
      </div>

    </div>
  );
}