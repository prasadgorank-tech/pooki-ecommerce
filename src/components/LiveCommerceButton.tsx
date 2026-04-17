import { Video } from "lucide-react";

export default function LiveCommerceButton() {
  return (
    <div className="relative inline-block mt-6">
      {/* Pulse effect */}
      <span className="absolute -inset-1 rounded-full bg-red-500 opacity-30 animate-ping"></span>
      
      <button className="relative flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 uppercase tracking-wider text-sm transition-colors shadow-[0_0_20px_rgba(220,38,38,0.5)]">
        <Video size={18} />
        <span>Live From The Rack</span>
        <span className="ml-2 w-2 h-2 rounded-full bg-white animate-pulse"></span>
      </button>
    </div>
  );
}
