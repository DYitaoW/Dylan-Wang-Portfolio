import { useState } from "react";
import type { FormEvent } from "react";

type ChatMessage = { id: number; sender: "bot" | "user"; text: string };

function getBotReply(question: string) {
  const prompt = question.toLowerCase();
  if (prompt.includes("project") || prompt.includes("build") || prompt.includes("game")) return "Dylan built 'Beyond the Stats' (a soccer predictive ML model & app), 'Draft It! 38-0 Draft' (an iOS football draft & season simulation game on the App Store), and 'Boilermates' (a Java socket networking social app).";
  if (prompt.includes("skill") || prompt.includes("tech")) return "Dylan works with Java, C/C++, Python, Swift, JavaScript, SQL, Scikit-Learn, Pandas, Flask, and React.";
  if (prompt.includes("contact") || prompt.includes("email") || prompt.includes("hire") || prompt.includes("phone")) return "You can reach Dylan at dylanywang06@gmail.com, (703) 935-9101, or view his resume and GitHub/LinkedIn on the desk.";
  if (prompt.includes("about") || prompt.includes("who") || prompt.includes("purdue")) return "Dylan is a Computer Science student at Purdue University (minoring in Management & Finance, 3.73 GPA), CS250 TA, and U.S. Soccer referee.";
  return "I can tell you about Dylan’s projects, technical skills, background, or contact details.";
}

export default function ChatPhone() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 1,
    sender: "bot",
    text: "Welcome! I’m Dylan’s portfolio bot. Ask me about projects, skills, or how to get in touch.",
  }]);
  const [chatInput, setChatInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text || isReplying) return;
    setMessages((current) => [...current, { id: Date.now(), sender: "user", text }]);
    setChatInput("");
    setIsReplying(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, sender: "bot", text: getBotReply(text) }]);
      setIsReplying(false);
    }, 520);
  }

  return (
    <aside className="iphone" aria-label="Portfolio chatbot">
      <div className="iphone-screen">
        <div className="dynamic-island" aria-hidden="true"><span /></div>
        <header className="phone-status">
          <time>9:41</time>
          <div aria-hidden="true"><i className="signal" /><i className="wifi" /><i className="battery" /></div>
        </header>
        <div className="messages-header">
          <button type="button" aria-label="Back to conversations">‹</button>
          <div className="bot-avatar">DW</div>
          <strong>Dylan&apos;s bot</strong>
          <small>portfolio assistant</small>
        </div>
        <div className="message-thread" aria-live="polite">
          <p className="message-time">Today 9:41 AM</p>
          {messages.map((message) => (
            <p className={`message-bubble ${message.sender} ${message.id === 1 ? "welcome-message" : ""}`} key={message.id}>
              {message.text}
            </p>
          ))}
          {isReplying && <div className="typing-bubble" aria-label="Dylan's bot is typing"><i /><i /><i /></div>}
        </div>
        <form className="message-composer" onSubmit={sendMessage}>
          <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about Dylan..." aria-label="Message Dylan's portfolio bot" />
          <button type="submit" aria-label="Send message" disabled={!chatInput.trim()}>↑</button>
        </form>
        <div className="home-indicator" aria-hidden="true" />
      </div>
    </aside>
  );
}
