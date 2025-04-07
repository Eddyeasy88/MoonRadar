import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Redirect } from 'wouter';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import RadarLogo from '@/components/RadarLogo';
import { Loader2 } from 'lucide-react';
import { insertUserSchema } from '@shared/schema';

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...userData } = data;
    
    register.mutate(
      userData,
      {
        onError: (error) => {
          toast({
            title: 'Registrierung fehlgeschlagen',
            description: error.message || 'Bitte versuche es mit einem anderen Benutzernamen oder einer anderen E-Mail-Adresse',
            variant: 'destructive',
          });
        },
      }
    );
  };

  // Wenn der Benutzer bereits angemeldet ist, zur Hauptseite weiterleiten
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Linke Seite - Registrierungsformular */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-accent/20">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-6">
              <RadarLogo size={70} />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              MOONRADAR
            </CardTitle>
            <CardDescription className="text-center">
              Erstelle ein Konto und starte deine Krypto-Reise zum Mond
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benutzername</FormLabel>
                      <FormControl>
                        <Input placeholder="Benutzername eingeben" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="E-Mail eingeben" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Passwort eingeben" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort bestätigen</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Passwort wiederholen" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={register.isPending}>
                  {register.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrierung...
                    </>
                  ) : (
                    'Registrieren'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              Bereits ein Konto?{' '}
              <a 
                href="/login" 
                className="text-accent hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/login';
                }}
              >
                Jetzt anmelden
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Rechte Seite - Hero-Bereich */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-background to-gray-900 p-12 flex items-center justify-center">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-6 text-white">
            <span className="text-accent">MOONRADAR</span> - Dein Radar für die nächste Krypto-Rakete
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Registriere dich jetzt und entdecke die besten Krypto-Opportunitäten mit unseren einzigartigen Wal-Indikatoren und dem Mondphasen-Tracking-System.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold mb-2 text-accent">VIP-Zugang</h3>
              <p className="text-gray-300">Erhalte als VIP früheren Zugang zu Moonshots und exklusive Analysen.</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold mb-2 text-accent">Watchlist</h3>
              <p className="text-gray-300">Behalte deine favorisierten Coins im Blick und verpasse keine Bewegung.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;