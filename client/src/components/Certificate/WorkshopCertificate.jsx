import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import "./WorkshopCertificate.css";

const WorkshopCertificate = () => {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [participant, setParticipant] = useState(null);
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError("");
    setParticipant(null);
    setImageLoaded(false);

    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/workshop-2026/verify-certificate/${identifier}`
      );
      setParticipant(response.data);
    } catch (err) {
      console.error("Verification error:", err);
      setError(
        err.response?.data?.message || "Participant not found or payment not verified."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (participant && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = "/participation_certificate.png";

      img.onload = () => {
        // Set canvas internal dimensions to match original image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original background
        ctx.drawImage(img, 0, 0);

        // Name Styling
        // Based on the provided screenshot, the name is centered on the brown line
        ctx.font = "italic 600 80px 'Playfair Display', serif"; // Adjust size/font as needed
        ctx.fillStyle = "#2c3e50"; // Dark color for text
        ctx.textAlign = "center";
        
        // Coordinates: roughly horizontal center, vertical alignment above signatures
        // Standard certificate baseline is often around 55-60% height
        const x = canvas.width / 2;
        const y = canvas.height * 0.53; // Adjust vertical position based on template

        // Draw the name
        ctx.fillText(participant.name, x, y, canvas.width * 0.7); // maxWidth set to 70% of canvas width
        
        setImageLoaded(true);
      };
    }
  }, [participant]);

  const handleDownload = () => {
    if (!canvasRef.current || !participant) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `CORSIT_Workshop_Certificate_${participant.name.replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="certificate-page min-h-screen pt-52 pb-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#ed5a2d] mb-4 uppercase tracking-tighter">CORSIT WORKSHOP 2026</h1>
        <p className="text-white mb-10 text-2xl md:text-3xl font-medium tracking-wide">Download your participation certificate</p>
        
        <form onSubmit={handleSearch} className="mb-12 max-w-md mx-auto flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter USN or Email"
            className="flex-grow bg-[#1a1625] border border-gray-700 rounded-lg px-6 py-3 outline-none focus:border-[#ed5a2d] transition-colors"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ed5a2d] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#ff6b3d] transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Check"}
          </button>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg mb-10 animate-fade-in">
            Participant not found
          </div>
        )}

        {participant && (
          <div className="certificate-view animate-slide-up">
            <h2 className="text-2xl font-semibold mb-6 text-green-400">Found: {participant.name}</h2>
            
            <div className="canvas-wrapper mb-8 bg-white/5 p-4 rounded-xl border border-white/10 overflow-hidden">
               {/* Displayed as responsive image preview */}
               <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl rounded" />
            </div>

            <button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              Download Certificate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopCertificate;
