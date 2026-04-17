"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = countryCode + phone;
    try {
      if (isLogin) {
        const { error } = method === 'email'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signInWithPassword({ phone: fullPhone, password });
        if (error) throw error;
        router.push("/profile");
      } else {
        const { error } = method === 'email'
          ? await supabase.auth.signUp({ email, password, options: { data: { name } } })
          : await supabase.auth.signUp({ phone: fullPhone, password, options: { data: { name } } });
        if (error) throw error;
        setStep('OTP');
      }
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = countryCode + phone;
    try {
      const { data, error } = method === 'email'
        ? await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' })
        : await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: 'sms' });

      if (error) throw error;

      if (data.user) {
        await supabase.from("user_profiles").upsert({ 
          id: data.user.id, 
          email: method === 'email' ? email : fullPhone, 
          name: name 
        });
      }
      router.push("/profile");
    } catch (err: any) {
      console.error(err);
      alert("Invalid OTP: " + err.message);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--background)] border border-[var(--color-border)] p-8 shadow-2xl">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-center mb-2">
          {step === 'OTP' ? "Awaiting Code" : (isLogin ? "Access Vault" : "Create Profile")}
        </h1>
        <p className="text-center text-[var(--color-muted)] text-sm mb-6">
          {step === 'OTP' ? "Verify your identity." : (isLogin ? "Agent verified." : "Join the syndicate.")}
        </p>

        {step === 'OTP' ? (
          <form className="space-y-4" onSubmit={handleVerifyOTP}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">Enter 6-Digit OTP</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required placeholder="123456" maxLength={6} className="w-full bg-transparent border border-[var(--color-border)] p-3 outline-none focus:border-[var(--foreground)] transition-colors text-center text-xl tracking-widest" />
            </div>
            <button type="submit" className="w-full bg-[var(--foreground)] text-[var(--background)] font-bold uppercase tracking-widest py-4 mt-6 hover:opacity-90 transition-opacity">
              Verify
            </button>
            <button type="button" onClick={() => setStep('DETAILS')} className="w-full text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mt-4 hover:text-[var(--foreground)] transition-colors underline underline-offset-4">
              Return
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleAuth}>
            
            {/* Method Switcher */}
            <div className="flex border border-[var(--color-border)] mb-4">
               <button type="button" onClick={() => setMethod('email')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest ${method === 'email' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--color-muted)] hover:text-[var(--foreground)]'}`}>Email</button>
               <button type="button" onClick={() => setMethod('phone')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest border-l border-[var(--color-border)] ${method === 'phone' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--color-muted)] hover:text-[var(--foreground)]'}`}>Phone</button>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">Your Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-transparent border border-[var(--color-border)] p-3 outline-none focus:border-[var(--foreground)] transition-colors" />
              </div>
            )}

            {method === 'email' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-transparent border border-[var(--color-border)] p-3 outline-none focus:border-[var(--foreground)] transition-colors" />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">Phone Number</label>
                <div className="flex border border-[var(--color-border)] focus-within:border-[var(--foreground)] transition-colors">
                  <select 
                    value={countryCode} 
                    onChange={e => setCountryCode(e.target.value)}
                    className="bg-transparent p-3 outline-none border-r border-[var(--color-border)] text-[var(--foreground)] text-sm cursor-pointer"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+39">🇮🇹 +39</option>
                    <option value="+82">🇰🇷 +82</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+92">🇵🇰 +92</option>
                  </select>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="1234567890" required className="w-full bg-transparent p-3 outline-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-transparent border border-[var(--color-border)] p-3 outline-none focus:border-[var(--foreground)] transition-colors" />
            </div>
            
            <button type="submit" className="w-full bg-[var(--foreground)] text-[var(--background)] font-bold uppercase tracking-widest py-4 mt-6 hover:opacity-90 transition-opacity">
              {isLogin ? "Enter" : "Request Verification"}
            </button>
          </form>
        )}

        {step === 'DETAILS' && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              type="button"
              className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors underline decoration-[var(--color-border)] hover:decoration-[var(--foreground)] underline-offset-4"
            >
              {isLogin ? "Need access? Register here." : "Already an agent? Login here."}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
