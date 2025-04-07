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

const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Benutzername muss mindestens 3 Zeichen lang sein' }),
  password: z
    .string()
    .min(6, { message: 'Passwort muss mindestens 6 Zeichen lang sein' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showRegister, setShowRegister] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    login.mutate(
      {
        username: data.username,
        password: data.password,
      },
      {
        onError: (error) => {
          toast({
            title: 'Anmeldung fehlgeschlagen',
            description: error.message || 'Bitte überprüfe deinen Benutzernamen und Passwort',
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
      {/* Linke Seite - Anmeldeformular */}
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
              Melde dich an, um deine Kryptowährungen im Auge zu behalten
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
                <Button type="submit" className="w-full" disabled={login.isPending}>
                  {login.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Anmeldung...
                    </>
                  ) : (
                    'Anmelden'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              Noch kein Konto?{' '}
              <a 
                href="/register" 
                className="text-accent hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/register';
                }}
              >
                Jetzt registrieren
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
            Behalte alle wichtigen Kryptowährungen im Blick und verpasse nie wieder einen Moonshot mit unserem einzigartigen Mondphasen-Tracking-System.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold mb-2 text-accent">Mondphasen-Tracking</h3>
              <p className="text-gray-300">Erfahre, in welcher Phase sich jede Coin befindet: Neumond, Halbmond oder Vollmond.</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold mb-2 text-accent">Wal-Indikatoren</h3>
              <p className="text-gray-300">Verfolge Wal-Aktivitäten und identifiziere früh potentielle Moonshots.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;