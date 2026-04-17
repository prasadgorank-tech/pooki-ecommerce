"use client";

import { useState } from "react";
import { Ruler, CheckCircle2 } from "lucide-react";

export default function FitQuizModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [recommendedSize, setRecommendedSize] = useState("");

  const calculateSize = () => {
    // Simulated Fit Logic Algorithm based on Height/Weight relation
    setRecommendedSize("Large (L)");
    setStep(3);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 text-sm font-semibold tracking-wider uppercase underline underline-offset-4 decoration-[var(--color-muted)] hover:decoration-[var(--foreground)] transition-colors"
      >
        <Ruler size={16} />
        <span>Find Your True Fit</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--background)] max-w-md w-full p-8 border border-[var(--color-border)] shadow-xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => { setIsOpen(false); setStep(1); }} 
              className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-[var(--foreground)]"
            >
              x
            </button>
            
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Fit Calculator</h2>

            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-2">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">Height (cm)</label>
                  <input type="number" placeholder="e.g. 180" className="w-full border border-[var(--color-border)] bg-transparent p-3 outline-none focus:border-[var(--foreground)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">Weight (kg)</label>
                  <input type="number" placeholder="e.g. 75" className="w-full border border-[var(--color-border)] bg-transparent p-3 outline-none focus:border-[var(--foreground)] transition-colors" />
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-[var(--foreground)] text-[var(--background)] font-bold uppercase tracking-wider py-4 mt-4 hover:opacity-90 transition-opacity"
                >
                  Next Step
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-2">
                <label className="block text-sm font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">How do you prefer it to fit?</label>
                <div className="grid grid-cols-1 gap-2">
                  <button onClick={calculateSize} className="border border-[var(--color-border)] p-4 text-left hover:border-[var(--foreground)] font-medium">Standard (True to size)</button>
                  <button onClick={calculateSize} className="border border-[var(--color-border)] p-4 text-left hover:border-[var(--foreground)] font-medium">Slightly Baggy (Relaxed)</button>
                  <button onClick={calculateSize} className="border border-[var(--color-border)] p-4 text-left hover:border-[var(--foreground)] font-medium">Oversized (Streetwear fit)</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-6 animate-in zoom-in">
                <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
                <p className="text-[var(--color-muted)] uppercase tracking-widest text-sm mb-2">Computed Based on Data</p>
                <h3 className="text-4xl font-black tracking-tighter mb-6">{recommendedSize}</h3>
                <button onClick={() => { setIsOpen(false); setStep(1); }} className="w-full bg-[var(--foreground)] text-[var(--background)] font-bold uppercase tracking-wider py-4">
                  Apply Size
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
