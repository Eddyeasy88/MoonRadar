import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RadarLogo from '@/components/RadarLogo';
import { useAuth } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
});

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Wenn bereits eingeloggt, zum Dashboard weiterleiten
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Login-Seite: Benutzer ist bereits eingeloggt, Weiterleitung zum Dashboard');
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log('Login-Formular abgeschickt:', values.email);
    login.mutate(values);
  };
  
  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-center px-6 py-8 bg-background">
      <RadarLogo />
      
      <div className="w-full max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="E-Mail" 
                      className="px-4 py-3 rounded-full bg-secondary border border-accent/30 text-foreground focus:border-accent" 
                      {...field} 
                    />
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
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Passwort" 
                      className="px-4 py-3 rounded-full bg-secondary border border-accent/30 text-foreground focus:border-accent" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full py-6 px-4 rounded-full bg-secondary border border-accent text-accent font-medium hover:bg-accent hover:text-background transition-colors"
              disabled={login.isPending}
            >
              {login.isPending ? 'Einloggen...' : 'Einloggen'}
            </Button>
            
            <Link href="/register">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full py-6 px-4 rounded-full bg-secondary text-foreground font-medium hover:bg-muted transition-colors"
              >
                Registrieren
              </Button>
            </Link>
            
            <div className="text-center pt-2">
              <Link href="#reset-password" className="text-accent text-sm hover:underline">
                Passwort vergessen?
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
