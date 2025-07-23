import { useState, useRef, useEffect } from 'react';
import { QrCode, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
}

export const QRInput = ({ value, onChange, onGenerate }: QRInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on page load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onGenerate();
    }
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onGenerate();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="floating-input">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder=" "
              className="glass-card w-full px-4 py-4 text-lg rounded-xl border-2 border-transparent 
                         focus:border-primary focus:ring-0 focus:outline-none 
                         transition-all duration-300 placeholder:text-transparent
                         pr-12 smooth-transition"
              aria-label="Enter text or URL to generate QR code"
            />
            
            <label className="absolute left-4 top-4 text-muted-foreground 
                              transition-all duration-300 pointer-events-none
                              smooth-transition text-lg">
              Enter text or URL...
            </label>
            
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="absolute right-2 top-2 h-8 w-8 text-muted-foreground 
                           hover:text-foreground hover:bg-muted/50 rounded-lg"
                aria-label="Clear input"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <Button
          type="submit"
          variant="gradient"
          size="xl"
          disabled={!value.trim()}
          className="w-full animate-pulse-glow disabled:animate-none disabled:opacity-50"
        >
          <QrCode className="h-5 w-5" />
          Generate QR Code
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Enter any text, URL, or data to create an instant QR code
        </p>
      </div>
    </div>
  );
};