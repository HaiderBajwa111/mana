"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/ui/use-toast"; // Assuming this hook is available from shadcn/ui setup
import { Loader2 } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!name || !email || !subject || !message) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    // In a real application, you would send this data to a server action or API endpoint
    // For example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, subject, message }) })
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success/failure
    const success = Math.random() > 0.2; // 80% chance of success for demo
    if (success) {
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll get back to you soon.",
        variant: "default",
        className: "bg-mana-mint text-mana-black",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description:
          "There was a problem sending your message. Please try again or email us directly.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-mana-text-secondary">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-mana-gray border-mana-gray-light focus:border-mana-mint focus:ring-mana-mint rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-mana-text-secondary">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-mana-gray border-mana-gray-light focus:border-mana-mint focus:ring-mana-mint rounded-lg"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-mana-text-secondary">
          Subject
        </Label>
        <Input
          id="subject"
          type="text"
          placeholder="Regarding..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="bg-mana-gray border-mana-gray-light focus:border-mana-mint focus:ring-mana-mint rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-mana-text-secondary">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="bg-mana-gray border-mana-gray-light focus:border-mana-mint focus:ring-mana-mint rounded-lg min-h-[150px]"
        />
      </div>
      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-mana-mint text-mana-black font-semibold rounded-lg px-8 py-3
                     shadow-glow-mint-sm hover:bg-mana-mint/90 hover:shadow-glow-mint-md transition-all duration-300
                     transform hover:scale-105 text-base disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
    </form>
  );
}
