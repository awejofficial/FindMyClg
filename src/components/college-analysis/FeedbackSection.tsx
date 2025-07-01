
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FeedbackSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill all fields",
        description: "Name, email and message are required.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-feedback', {
        body: {
          name: formData.name,
          email: formData.email,
          message: formData.message
        }
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      toast({
        title: "Feedback sent successfully!",
        description: "Thank you for your feedback. We'll get back to you soon.",
      });

    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Failed to send feedback",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-green-800">
            <CheckCircle className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Thank you for your feedback!</h3>
              <p className="text-sm text-green-700">We've received your message and will get back to you soon.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsSubmitted(false)}
            className="mt-4 border-green-300 text-green-800 hover:bg-green-100"
          >
            Send Another Feedback
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#F7F8F3] border-[#78BCC4]/30">
      <CardHeader>
        <CardTitle className="text-[#002C3E] flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#F7444E]" />
          Share Your Feedback
        </CardTitle>
        <p className="text-sm text-gray-600">
          Help us improve your college search experience
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-name" className="text-[#002C3E]">Name</Label>
              <Input
                id="feedback-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="bg-white border-gray-300 focus:border-[#F7444E] focus:ring-[#F7444E]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-email" className="text-[#002C3E]">Email</Label>
              <Input
                id="feedback-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="bg-white border-gray-300 focus:border-[#F7444E] focus:ring-[#F7444E]"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback-message" className="text-[#002C3E]">Message</Label>
            <Textarea
              id="feedback-message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Share your thoughts, suggestions, or report any issues..."
              rows={4}
              className="bg-white border-gray-300 focus:border-[#F7444E] focus:ring-[#F7444E]"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#F7444E] text-white hover:bg-[#F7444E]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
