"use client";

// import { Mail, MessageSquare, Send } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// export default function Contact() {
//   const handleSubmit = e => {
//     e.preventDefault();
//     // Handle form submission
//     console.log("Form submitted");
//   };
//   return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="mb-12">
//         <h1 className="text-5xl font-serif font-bold mb-4">Get in Touch</h1>
//         <p className="text-xl text-muted-foreground">
//           Have a question or want to collaborate? We'd love to hear from you.
//         </p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-12">
//         {/* Contact Form */}
//         <div>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="name">Name</Label>
//               <Input id="name" placeholder="Your name" required />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" placeholder="your.email@example.com" required />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="subject">Subject</Label>
//               <Input id="subject" placeholder="What's this about?" required />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="message">Message</Label>
//               <Textarea id="message" placeholder="Tell us more..." rows={6} required />
//             </div>

//             <Button type="submit" className="w-full" size="lg">
//               <Send className="h-4 w-4 mr-2" />
//               Send Message
//             </Button>
//           </form>
//         </div>

//         {/* Contact Info */}
//         <div className="space-y-8">
//           <div>
//             <h2 className="text-2xl font-serif font-semibold mb-6">
//               Other Ways to Connect
//             </h2>
            
//             <div className="space-y-6">
//               <div className="flex items-start gap-4">
//                 <div className="p-3 rounded-lg bg-muted">
//                   <Mail className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-1">Email</h3>
//                   <p className="text-muted-foreground">
//                     hello@thechronicle.blog
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="p-3 rounded-lg bg-muted">
//                   <MessageSquare className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-1">Response Time</h3>
//                   <p className="text-muted-foreground">
//                     We typically respond within 24-48 hours
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 border border-border rounded-lg bg-muted/30">
//             <h3 className="font-semibold mb-3">Newsletter</h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               Stay updated with our latest articles and insights. Subscribe to our newsletter.
//             </p>
//             <div className="flex gap-2">
//               <Input placeholder="Your email" type="email" />
//               <Button>Subscribe</Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>;
// }


import { Mail, Twitter, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing! You'll hear from me soon.");
      setEmail("");
    }
  };

  const handleEmailClick = () => {
    navigator.clipboard.writeText("hello@thechronicle.blog");
    toast.success("Email copied to clipboard!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Let's Connect</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          I'd love to hear from you. Whether you have a question, feedback, or just want to say hi!
        </p>
      </div>

      {/* Newsletter Section */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="p-8 border border-border rounded-2xl bg-muted/30">
          <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          
          <h2 className="text-3xl font-serif font-bold mb-4 text-center">
            Never Miss a Post
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Get my latest articles delivered straight to your inbox. No spam, just quality content.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" size="lg" className="sm:w-auto w-full">
              Subscribe
            </Button>
          </form>
          
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Join other readers in staying up to date
          </p>
        </div>
      </div>

      {/* Direct Email Contact */}
      <div className="max-w-2xl mx-auto mb-16 text-center">
        <h3 className="text-2xl font-serif font-semibold mb-4">Prefer Email?</h3>
        <p className="text-muted-foreground mb-6">
          Drop me a line directly. I typically respond within 24-48 hours.
        </p>
        <button
          onClick={handleEmailClick}
          className="inline-flex items-center gap-2 text-2xl font-semibold text-primary hover:underline"
        >
          <Mail className="h-6 w-6" />
          hello@thechronicle.blog
        </button>
      </div>

      {/* Social Links */}
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-serif font-semibold mb-6">Find Me On</h3>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => window.open('https://twitter.com', '_blank')}
          >
            <Twitter className="h-5 w-5" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            <Github className="h-5 w-5" />
            GitHub
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => window.open('https://linkedin.com', '_blank')}
          >
            <Linkedin className="h-5 w-5" />
            LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
}
