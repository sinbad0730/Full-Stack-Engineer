import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Rocket } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactSection() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactForm) => 
      fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Message Sent! 🚀",
        description: "Thanks for reaching out! I'll get back to you soon.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Send",
        description: "Something went wrong. Please try again or contact me directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center cosmic-glow">
                <Rocket className="w-12 h-12 text-stellar-white" />
              </div>
              <h2 className="text-4xl font-bold text-stellar-white mb-4">
                Message Launched! 🚀
              </h2>
              <p className="text-xl text-gray-300">
                Your message has been sent successfully. I'll get back to you within 24 hours!
              </p>
            </div>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stellar-white mb-6">
              <span className="bg-gradient-to-r from-neon-blue to-cosmic-accent bg-clip-text text-transparent">
                Launch Your Project
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to bring your ideas to life? Let's connect and discuss how we can 
              create something amazing together in the digital universe.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="glass cosmic-glow">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-stellar-white mb-6">
                  Send Message
                </h3>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        {...form.register("name")}
                        className="bg-space-blue/20 border-neon-blue/30 text-stellar-white placeholder:text-gray-400"
                      />
                      {form.formState.errors.name && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        {...form.register("email")}
                        className="bg-space-blue/20 border-neon-blue/30 text-stellar-white placeholder:text-gray-400"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Input
                      placeholder="Subject"
                      {...form.register("subject")}
                      className="bg-space-blue/20 border-neon-blue/30 text-stellar-white placeholder:text-gray-400"
                    />
                    {form.formState.errors.subject && (
                      <p className="text-red-400 text-sm mt-1">
                        {form.formState.errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      placeholder="Tell me about your project..."
                      rows={6}
                      {...form.register("message")}
                      className="bg-space-blue/20 border-neon-blue/30 text-stellar-white placeholder:text-gray-400 resize-none"
                    />
                    {form.formState.errors.message && (
                      <p className="text-red-400 text-sm mt-1">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full py-3 bg-gradient-to-r from-neon-blue to-cosmic-accent hover:scale-105 transition-all duration-300 cosmic-glow"
                  >
                    {contactMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stellar-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="glass cosmic-glow">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-stellar-white mb-6">
                    Get In Touch
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-stellar-white" />
                      </div>
                      <div>
                        <p className="text-stellar-white font-medium">Email</p>
                        <p className="text-gray-300">hello@spacedev.com</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-stellar-white" />
                      </div>
                      <div>
                        <p className="text-stellar-white font-medium">Phone</p>
                        <p className="text-gray-300">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-stellar-white" />
                      </div>
                      <div>
                        <p className="text-stellar-white font-medium">Location</p>
                        <p className="text-gray-300">Earth, Solar System</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Response Promise */}
              <Card className="glass cosmic-glow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className="text-lg font-bold text-stellar-white mb-2">
                      Quick Response Guaranteed
                    </h4>
                    <p className="text-gray-300 text-sm">
                      I typically respond within 24 hours. For urgent projects, 
                      expect a response within 2-4 hours during business days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}