
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: FeedbackRequest = await req.json();

    // Send feedback to admin
    const adminEmailResponse = await resend.emails.send({
      from: "FindMyClg <onboarding@resend.dev>",
      to: ["awejofficial@gmail.com"],
      subject: `New Feedback from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #002C3E;">New Feedback Received</h2>
          <div style="background-color: #F7F8F3; padding: 20px; border-radius: 8px; border-left: 4px solid #F7444E;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #78BCC4; font-size: 12px; margin-top: 20px;">
            This feedback was sent through FindMyClg - DSE College Finder
          </p>
        </div>
      `,
    });

    // Send thank you email to user
    const userEmailResponse = await resend.emails.send({
      from: "FindMyClg <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for your feedback!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #002C3E;">Thank you for your feedback, ${name}!</h2>
          <div style="background-color: #F7F8F3; padding: 20px; border-radius: 8px;">
            <p>We have received your feedback and truly appreciate you taking the time to help us improve FindMyClg.</p>
            <p>Our team will review your message and get back to you if needed. We're constantly working to make our DSE college finder better for students like you.</p>
            <div style="margin: 20px 0; padding: 15px; background-color: white; border-radius: 5px; border-left: 4px solid #78BCC4;">
              <p style="margin: 0;"><strong>Your message:</strong></p>
              <p style="margin: 10px 0 0 0; color: #666;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p>Best regards,<br>
            <strong style="color: #F7444E;">The FindMyClg Team</strong></p>
          </div>
          <p style="color: #78BCC4; font-size: 12px; margin-top: 20px; text-align: center;">
            FindMyClg - Your DSE College Finder | Made with ❤️ by Awej
          </p>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);
    console.log("User email sent:", userEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Feedback sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-feedback function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
