import { useState } from 'react';
import Navbar from './components/Navbar';
import WorkflowText from './components/WorkflowText';
import WorkflowImage from './components/WorkflowImage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Tab Navigation */}
        <div className="glass-panel rounded-2xl p-2 mb-8 mx-auto inline-flex gap-2">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Creative Studio (Text)
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'image'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Style Lab (Image)
          </button>
        </div>

        {/* Workflow Content */}
        <div className="flex-1">
          {activeTab === 'text' ? <WorkflowText /> : <WorkflowImage />}
        </div>
      </main>

      {/* Global Toast Notifications */}
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}

export default App;
