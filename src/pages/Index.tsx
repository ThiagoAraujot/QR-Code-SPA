import { useState } from 'react';
import { QRInput } from '@/components/QRInput';
import { QRGenerator } from '@/components/QRGenerator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [inputValue, setInputValue] = useState('');
  const [shouldGenerate, setShouldGenerate] = useState(false);

  const handleGenerate = () => {
    setShouldGenerate(true);
  };

  const handleClear = () => {
    setInputValue('');
    setShouldGenerate(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5 -z-10" />
      
      {/* Theme toggle */}
      <ThemeToggle />
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 shadow-lg shadow-primary/25">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m4 0V4m-4 4h4m0 0V4m0 4h.01M8 12h.01M8 8h.01M8 16h.01M16 8h4m-4 8h4m-4-4h.01M8 20h.01"
                />
              </svg>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              QR Code Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
              Create beautiful QR codes instantly. Perfect for URLs, text, contact info, and more.
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <QRInput
              value={inputValue}
              onChange={setInputValue}
              onGenerate={handleGenerate}
            />
          </div>

          {/* QR Code Display */}
          {shouldGenerate && (
            <QRGenerator
              inputValue={inputValue}
              onClear={handleClear}
              triggerGeneration={shouldGenerate}
            />
          )}

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Generation</h3>
              <p className="text-sm text-muted-foreground">Generate QR codes in milliseconds with our optimized engine</p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Easy Download</h3>
              <p className="text-sm text-muted-foreground">Download high-quality PNG images ready for print or digital use</p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">High Quality</h3>
              <p className="text-sm text-muted-foreground">Crisp, clear QR codes with error correction for reliable scanning</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Supports URLs, plain text, phone numbers, email addresses, and more
            </p>
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
