"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Mail, Phone, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [step, setStep] = useState<"enter" | "otp">("enter");
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [inputValue, setInputValue] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mocking OTP send
    setTimeout(() => {
      setStep("otp");
      setLoading(false);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Persist login session
    setTimeout(() => {
      login(inputValue);
      onClose();
      setLoading(false);
      setStep("enter");
      setInputValue("");
      setOtpValue("");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl flex flex-col md:flex-row shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-500 rounded-sm">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 hover:bg-gray-100 transition-colors rounded-full"
        >
          <X size={20} className="text-black" />
        </button>

        {/* Left Side: Image - Fixed to ensure "Full Fit" */}
        <div className="hidden md:block w-[45%] relative aspect-[3/4] overflow-hidden bg-gray-900">
          <Image
            src="/images/auth-modal-v2.png"
            alt="Pooki Fashion Editorial"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] mb-3 text-white/70">Pooki Collective</p>
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">New Season<br/>is Here.</h2>
            <div className="h-1 w-12 bg-white" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white">
          
          {step === "enter" ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-3">Login or Signup</h2>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed">
                  Enter your details to track orders, <br/>unlock coupons and member benefits.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="flex gap-8 mb-6 border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => { setMethod("phone"); setInputValue(""); }}
                    className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                      method === "phone" ? "text-black" : "text-gray-300 hover:text-gray-400"
                    }`}
                  >
                    Mobile Number
                    {method === "phone" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMethod("email"); setInputValue(""); }}
                    className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                      method === "email" ? "text-black" : "text-gray-300 hover:text-gray-400"
                    }`}
                  >
                    Email Address
                    {method === "email" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
                  </button>
                </div>

                <div className="space-y-1">
                  <div className={`flex items-center border border-gray-200 focus-within:border-black transition-all px-5 py-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {method === "phone" ? (
                      <>
                        <span className="text-sm font-black mr-4 text-black border-r border-gray-100 pr-4">+91</span>
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          className="w-full text-base outline-none font-bold tracking-widest placeholder:text-gray-200"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          required
                          maxLength={10}
                        />
                        <Phone size={18} className="text-gray-200" />
                      </>
                    ) : (
                      <>
                        <input
                          type="email"
                          placeholder="name@email.com"
                          className="w-full text-base outline-none font-bold tracking-widest placeholder:text-gray-200"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          required
                        />
                        <Mail size={18} className="text-gray-200" />
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !inputValue}
                  className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Send OTP <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <button 
                onClick={() => setStep("enter")}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-10"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-3">Verify OTP</h2>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest">
                  A 6-digit code has been sent to <br/>
                  <span className="text-black font-black">{inputValue}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex items-center border border-gray-200 focus-within:border-black transition-all px-5 py-4">
                  <input
                    type="text"
                    placeholder="Enter 6-Digit Code"
                    className="w-full text-lg outline-none font-black tracking-[0.5em] text-center placeholder:tracking-normal placeholder:text-sm placeholder:text-gray-200"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    required
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest cursor-not-allowed">Resend in 0:29</p>
                  <button type="button" className="text-[10px] text-black font-black uppercase tracking-widest underline underline-offset-4">Need Help?</button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpValue.length < 6}
                  className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Verify & Proceed"
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-relaxed font-medium">
              By proceeding, you agree to Pooki's <br /> 
              <span className="text-black font-bold underline cursor-pointer">Terms of Service</span> & <span className="text-black font-bold underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
