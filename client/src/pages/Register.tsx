import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RadarLogo from '@/components/RadarLogo';
import { useAuth } from '@/lib/auth';

const registerSchema = z.object({
  username: z.string().min(3, 'Benutzername muss mindestens 3 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

const Register: React.FC = () => {
  const { register } = useAuth();
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    const { username, email, password } = values;
    register.mutate({ username, email, password });
  };
  
  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-center px-6 py-8 bg-background">
      <RadarLogo />
      
      <div className="w-full max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Benutzername" 
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
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Passwort bestätigen" 
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
              disabled={register.isPending}
            >
              {register.isPending ? 'Registrieren...' : 'Registrieren'}
            </Button>
            
            <div className="text-center pt-2">
              <span className="text-muted-foreground text-sm">Bereits ein Konto?</span>{' '}
              <Link href="/login" className="text-accent text-sm hover:underline">
                Einloggen
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
