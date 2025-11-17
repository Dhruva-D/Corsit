import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

const Round1Results = () => {
  return (
    <div className="min-h-screen bg-[#080514] pt-35 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#ed5a2d] mb-4">
          CORSIT Recruitments 2025
        </h1>
        <h2 className="text-xl md:text-2xl text-center text-gray-300 mb-12">
          Round 1 Extended Shortlist
        </h2>
        
        <div className="bg-gray-900 rounded-lg shadow-xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <FileText className="w-24 h-24 text-[#ed5a2d]" />
          </div>
          
          <p className="text-gray-300 mb-8 text-lg">
            View or download the Round 1 Extended Shortlist PDF document
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/corsit-rec-2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#ed5a2d] text-white px-8 py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors font-semibold w-full sm:w-auto justify-center"
            >
              <ExternalLink className="w-5 h-5" />
              View PDF
            </a>
            
            <a
              href="/corsit-rec-2025.pdf"
              download="corsit-rec-2025.pdf"
              className="inline-flex items-center gap-2 bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-[#ed5a2d] hover:text-[#ff6b3d] transition-colors font-semibold"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Round1Results;
