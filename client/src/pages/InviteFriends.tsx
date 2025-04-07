import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/lib/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

const InviteFriends: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const { data: inviteData, isLoading } = useQuery({
    queryKey: ['/api/invite/generate'],
    enabled: !!user,
  });
  
  const inviteUrl = inviteData?.url || `https://moonradar.app/invite?ref=${user?.referralCode || 'user'}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast({
      title: 'Link kopiert!',
      description: 'Der Einladungslink wurde in die Zwischenablage kopiert.',
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareOnTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent('Probier MoonRadar aus, die beste Crypto-Tracking App mit Mondphasen!')}`, '_blank');
  };
  
  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Probier MoonRadar aus, die beste Crypto-Tracking App mit Mondphasen! ${inviteUrl}`)}`, '_blank');
  };
  
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Ich benutze MoonRadar um Kryptowährungen zu tracken! Melde dich mit meinem Link an: ${inviteUrl}`)}&hashtags=crypto,MoonRadar`, '_blank');
  };
  
  return (
    <div className="px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/profile">
          <a className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </a>
        </Link>
        <h1 className="text-2xl font-bold flex-1 text-center">Freunde einladen</h1>
      </div>
      
      <h2 className="text-2xl font-bold mb-8 text-center">Lade Freunde ein und werde belohnt</h2>
      
      {/* Invite Link */}
      <div className="bg-secondary/50 rounded-xl p-3 mb-4 overflow-hidden">
        <span className="block text-sm text-muted-foreground truncate">
          {isLoading ? 'Wird geladen...' : inviteUrl}
        </span>
      </div>
      
      {/* Share Actions */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <Button 
          variant="outline"
          className="py-6 px-4 rounded-xl bg-secondary text-foreground font-medium"
          onClick={copyToClipboard}
          disabled={isLoading}
        >
          <Copy className="h-4 w-4 mr-2" />
          {copied ? 'Kopiert!' : 'Link kopieren'}
        </Button>
        
        <Button
          variant="outline"
          className="py-6 px-4 rounded-xl bg-secondary text-foreground font-medium"
          onClick={() => setShowQR(!showQR)}
          disabled={isLoading}
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <rect x="7" y="7" width="3" height="3"></rect>
            <rect x="14" y="7" width="3" height="3"></rect>
            <rect x="7" y="14" width="3" height="3"></rect>
            <rect x="14" y="14" width="3" height="3"></rect>
          </svg>
          QR-Code anzeigen
        </Button>
      </div>
      
      {/* QR Code Display */}
      {showQR && (
        <div className="bg-white p-4 rounded-lg mb-6 flex justify-center">
          <div className="text-center">
            <div className="mb-2 text-black">Dein MoonRadar QR-Code</div>
            {/* SVG placeholder for QR code */}
            <svg width="150" height="150" viewBox="0 0 150 150" className="mx-auto">
              <rect width="150" height="150" fill="white" />
              <g fill="black">
                {/* This is a simplified QR code pattern */}
                <rect x="10" y="10" width="30" height="30" />
                <rect x="110" y="10" width="30" height="30" />
                <rect x="10" y="110" width="30" height="30" />
                <rect x="50" y="50" width="50" height="50" />
                <rect x="50" y="10" width="10" height="30" />
                <rect x="90" y="10" width="10" height="30" />
                <rect x="10" y="50" width="30" height="10" />
                <rect x="110" y="50" width="30" height="10" />
                <rect x="50" y="110" width="10" height="30" />
                <rect x="90" y="110" width="10" height="30" />
              </g>
            </svg>
          </div>
        </div>
      )}
      
      {/* Social Share */}
      <div className="flex justify-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"
          onClick={shareOnTelegram}
          disabled={isLoading}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 18.274H6.106c-.663 0-1.215-.552-1.215-1.215V6.94c0-.663.552-1.215 1.215-1.215H7.8v4.714l1.84-1.84 1.84 1.84V5.725h6.414c.663 0 1.215.552 1.215 1.215v10.119c0 .663-.552 1.215-1.215 1.215z" />
          </svg>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"
          onClick={shareOnWhatsApp}
          disabled={isLoading}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"
          onClick={shareOnTwitter}
          disabled={isLoading}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </Button>
      </div>
      
      {/* Reward Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Jeder geworbene Freund bringt dir 1 VIP-Tag kostenlos!</p>
      </div>
    </div>
  );
};

export default InviteFriends;
