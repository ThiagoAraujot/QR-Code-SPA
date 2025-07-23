import { useState, useEffect } from 'react';
import { Download, Copy, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QRGeneratorProps {
  inputValue: string;
  onClear: () => void;
  triggerGeneration: boolean;
}

export const QRGenerator = ({ inputValue, onClear, triggerGeneration }: QRGeneratorProps) => {
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (triggerGeneration && inputValue.trim()) {
      console.log('Triggering QR generation for:', inputValue);
      generateQRCode();
    } else if (!inputValue.trim()) {
      setQrCodeImageUrl('');
      setIsVisible(false);
    }
  }, [triggerGeneration, inputValue]);

  const generateQRCode = async () => {
  console.log('Starting QR generation for input:', inputValue);
  setIsLoading(true);
  try {
    const response = await fetch('https://3grrhgboa8.execute-api.us-east-1.amazonaws.com/prod/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: inputValue }),
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to generate QR code: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Handle the AWS Lambda response format
    let qrCodeUrl;
    if (data.body && typeof data.body === 'string') {
      // Parse the stringified JSON in the body
      const bodyData = JSON.parse(data.body);
      qrCodeUrl = bodyData.qr_code_url;
      console.log('Parsed from body:', qrCodeUrl);
    } else if (data.qr_code_url) {
      // Direct format
      qrCodeUrl = data.qr_code_url;
      console.log('Direct format URL:', qrCodeUrl);
    } else {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format - no qr_code_url found');
    }
    
    if (!qrCodeUrl) {
      console.error('No QR code URL found in response');
      throw new Error('No QR code URL in response');
    }
    
    console.log('Successfully got QR code URL:', qrCodeUrl);
    setQrCodeImageUrl(qrCodeUrl);
    setIsVisible(true);
  } catch (error) {
    console.error('QR Generation error:', error);
    
    // Mais detalhes no erro
    let errorMessage = "Please try again with valid input.";
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        errorMessage = "Network error - please check your connection and try again.";
      } else if (error.message.includes('400')) {
        errorMessage = "Invalid input - please enter a valid text or URL.";
      } else if (error.message.includes('500')) {
        errorMessage = "Server error - please try again later.";
      } else {
        errorMessage = error.message;
      }
    }
    
    toast({
      title: "Error generating QR code",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  const downloadQRCode = () => {
    if (qrCodeImageUrl) {
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = qrCodeImageUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "QR Code Downloaded",
        description: "Your QR code has been saved successfully.",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      if (qrCodeImageUrl) {
        // Convert image URL to blob and copy to clipboard
        const response = await fetch(qrCodeImageUrl);
        const blob = await response.blob();
        
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        
        toast({
          title: "Copied to Clipboard",
          description: "QR code image copied successfully.",
        });
      }
    } catch (error) {
      // Fallback: copy the input text
      await navigator.clipboard.writeText(inputValue);
      toast({
        title: "Text Copied",
        description: "Input text copied to clipboard.",
      });
    }
  };

  if (!inputValue.trim() && !isLoading) {
    return null;
  }

  return (
    <div className={`qr-container mt-8 ${isVisible ? 'show' : ''}`}>
      <div className="glass-card p-8 max-w-sm mx-auto animate-slide-up">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-foreground">Generated QR Code</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Clear QR code"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          {isLoading ? (
            <div className="w-64 h-64 flex items-center justify-center bg-muted/50 rounded-xl">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Generating QR code...</p>
              </div>
            </div>
          ) : qrCodeImageUrl ? (
            <div className="relative group">
              <img
                src={qrCodeImageUrl}
                alt="Generated QR Code"
                className="w-64 h-64 rounded-xl shadow-lg mx-auto block transition-transform duration-300 group-hover:scale-105"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </div>
          ) : null}
        </div>
        
        {qrCodeImageUrl && (
          <div className="flex gap-3 mt-6">
            <Button
              variant="gradient"
              size="lg"
              onClick={downloadQRCode}
              className="flex-1"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={copyToClipboard}
              className="flex-1"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center break-all">
            {inputValue}
          </p>
        </div>
      </div>
    </div>
  );
};