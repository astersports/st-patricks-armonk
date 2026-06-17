import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, X, Loader2, Church } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

export function ParishAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.parishAssistant.chat.useMutation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    try {
      const result = await chatMutation.mutateAsync({
        message: userMsg.content,
        history: messages.slice(-10),
      });
      setMessages([...newMessages, { role: "assistant", content: result.reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I'm having trouble. Please try again or call (914) 273-9724." }]);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
        aria-label="Open Parish Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] shadow-2xl border-primary/20 flex flex-col" style={{ height: "500px", maxHeight: "70vh" }}>
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b bg-primary text-primary-foreground rounded-t-lg">
        <Church className="w-5 h-5" />
        <div className="flex-1">
          <p className="font-semibold text-sm">Parish Assistant</p>
          <p className="text-xs opacity-80">Ask me anything about St. Patrick's</p>
        </div>
        <button onClick={() => setOpen(false)} className="hover:opacity-70"><X className="w-5 h-5" /></button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <Church className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Welcome! I can help with Mass times, events, programs, and more.</p>
            <div className="mt-3 space-y-1">
              {["What are the Mass times?", "How do I register for CCD?", "When are confessions?"].map(q => (
                <button key={q} onClick={() => { setInput(q); }} className="block mx-auto text-xs text-primary hover:underline">{q}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] rounded-lg px-3 py-2 text-sm",
              msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 text-sm"
            disabled={chatMutation.isPending}
          />
          <Button type="submit" size="sm" disabled={!input.trim() || chatMutation.isPending}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
