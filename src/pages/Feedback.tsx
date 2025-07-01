
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MessageSquare, Send } from 'lucide-react';

const Feedback: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle feedback submission here
    console.log('Feedback submitted');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">Feedback</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Help us improve FindMyClg by sharing your thoughts and suggestions
              </p>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground">Share Your Feedback</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your feedback is valuable to us and helps make the platform better for everyone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-card-foreground">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-card-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-card-foreground">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your feedback"
                      className="bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-card-foreground">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please share your detailed feedback, suggestions, or report any issues..."
                      rows={6}
                      className="bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Send className="h-4 w-4 mr-2" />
                    Send Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Feedback;
