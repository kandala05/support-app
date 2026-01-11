import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Send, Sparkles, FileText, User, Bot, ThumbsUp, ExternalLink, CheckCircle2, XCircle, MessageSquare, LayoutList, BookOpen, Lightbulb, GraduationCap } from 'lucide-react';

// Mock data for customers/environments/planes (same as before)
const CUSTOMERS = [
  { id: '1', name: 'Customer Alpha' },
  { id: '2', name: 'Customer Beta' }
];

const ENVIRONMENTS = {
  '1': [
    { id: 'e1', name: 'alpha-dev-01', type: 'dev' },
    { id: 'e2', name: 'alpha-qa-01', type: 'qa' }
  ],
  '2': [
    { id: 'e5', name: 'beta-dev-02', type: 'dev' }
  ]
};

const PLANES = [
  { id: 'p1', name: 'App CI/CD', slug: 'app-cicd' },
  { id: 'p2', name: 'EKS', slug: 'eks' }
];

const DIATAXIS_CONFIG = {
  'how-to': {
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'How-To'
  },
  'explanation': {
    icon: Lightbulb,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    label: 'Explanation'
  },
  'tutorial': {
    icon: GraduationCap,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    label: 'Tutorial'
  }
};

// Mock chat responses with doc snippets
const MOCK_RESPONSES = {
  initial: {
    type: 'assistant',
    text: "Hi! I'm here to help you report and troubleshoot your issue. Could you describe what's happening?",
    timestamp: new Date()
  },
  timeout: {
    type: 'assistant',
    text: "I understand you're experiencing pipeline timeouts during deployment. Let me help you with that.",
    docs: [
      {
        type: 'explanation',
        title: 'Understanding Pipeline Timeouts',
        excerpt: 'Timeouts occur when stages exceed configured limits, often due to network latency or resource constraints.',
        url: 'https://happycloud.com/docs/app-cicd/explanations/pipeline-timeouts'
      },
      {
        type: 'how-to',
        title: 'How to Adjust Timeout Settings',
        excerpt: 'Navigate to your pipeline YAML and set the timeout parameter under stage configuration.',
        url: 'https://happycloud.com/docs/app-cicd/how-to/configure-timeouts'
      }
    ],
    suggestions: [
      "Which customer environment is this happening in?",
      "What stage is timing out?",
      "Have you checked the pipeline logs?"
    ],
    timestamp: new Date()
  },
  context: {
    type: 'assistant',
    text: "Got it - Customer Alpha's QA environment during the deployment stage. Based on this information, it looks like this is an **App CI/CD - Application Deployment** issue. Does that sound right?",
    suggestedFields: {
      customer: 'Customer Alpha',
      environment: 'alpha-qa-01',
      plane: 'App CI/CD',
      context: 'Application Deployment'
    },
    timestamp: new Date()
  },
  final: {
    type: 'assistant',
    text: "Perfect! I've gathered all the information needed. Here's what I'll create for you:",
    issuePreview: {
      title: 'Pipeline timeout during deployment to QA environment',
      customer: 'Customer Alpha',
      environment: 'alpha-qa-01',
      plane: 'App CI/CD',
      context: 'Application Deployment',
      description: 'Deployment pipeline consistently times out after 25 minutes during the deployment stage to the QA environment.'
    },
    timestamp: new Date()
  }
};

function DocSnippetCard({ doc }) {
  const config = DIATAXIS_CONFIG[doc.type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border-2 border-gray-200 rounded-lg p-3 hover:shadow-md transition-all`}>
      <div className="flex items-start gap-2 mb-2">
        <Icon className={`w-4 h-4 ${config.color} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <span className={`text-xs font-semibold ${config.color} uppercase tracking-wide block mb-1`}>
            {config.label}
          </span>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">{doc.title}</h4>
          <p className="text-xs text-gray-700 leading-relaxed mb-2">{doc.excerpt}</p>
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Read more
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`flex-1 max-w-2xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-gray-900 text-white' 
            : 'bg-white border border-gray-200'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Doc Snippets */}
        {message.docs && message.docs.length > 0 && (
          <div className="mt-3 space-y-2 w-full">
            <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Related Documentation
            </p>
            {message.docs.map((doc, idx) => (
              <DocSnippetCard key={idx} doc={doc} />
            ))}
          </div>
        )}

        {/* Suggested Fields */}
        {message.suggestedFields && (
          <div className="mt-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 w-full">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-semibold text-blue-900">AI Suggestion</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-blue-700 font-medium">Customer:</span>
                <p className="text-blue-900 font-semibold">{message.suggestedFields.customer}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Environment:</span>
                <p className="text-blue-900 font-semibold">{message.suggestedFields.environment}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Plane:</span>
                <p className="text-blue-900 font-semibold">{message.suggestedFields.plane}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Stage:</span>
                <p className="text-blue-900 font-semibold">{message.suggestedFields.context}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Looks good
              </button>
              <button className="flex-1 bg-white text-blue-900 text-xs font-medium py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 border border-blue-200">
                <XCircle className="w-3.5 h-3.5" />
                Let me edit
              </button>
            </div>
          </div>
        )}

        {/* Issue Preview */}
        {message.issuePreview && (
          <div className="mt-3 bg-green-50 border-2 border-green-200 rounded-lg p-4 w-full">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-sm font-semibold text-green-900">Ready to Submit</p>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-green-700 font-medium">Title:</span>
                <p className="text-green-900 font-semibold">{message.issuePreview.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-green-700">Customer:</span>
                  <p className="text-green-900">{message.issuePreview.customer}</p>
                </div>
                <div>
                  <span className="text-green-700">Environment:</span>
                  <p className="text-green-900">{message.issuePreview.environment}</p>
                </div>
              </div>
              <div>
                <span className="text-green-700 font-medium">Description:</span>
                <p className="text-green-900">{message.issuePreview.description}</p>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors mt-3 flex items-center justify-center gap-2">
              Submit Issue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Suggestions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
}

function ConversationalInterface() {
  const [messages, setMessages] = useState([MOCK_RESPONSES.initial]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response;
      const lowerInput = input.toLowerCase();
      
      if (messages.length === 1) {
        // First user message - about timeout
        response = MOCK_RESPONSES.timeout;
      } else if (messages.length === 3) {
        // Second user message - providing context
        response = MOCK_RESPONSES.context;
      } else if (messages.length === 5) {
        // Third user message - final
        response = MOCK_RESPONSES.final;
      } else {
        response = {
          type: 'assistant',
          text: "I see. Can you tell me more about that?",
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Support Assistant</h3>
            <p className="text-xs text-gray-600">I'll help you create a detailed issue report</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, idx) => (
          <ChatMessage key={idx} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              messages.length === 1 
                ? "Try: 'My deployment keeps timing out...'"
                : messages.length === 3
                ? "Try: 'Customer Alpha QA environment, deployment stage'"
                : "Type your message..."
            }
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 The AI will ask follow-up questions to gather all necessary details
        </p>
      </div>
    </div>
  );
}

export default function Phase3Conversational() {
  const [mode, setMode] = useState(null); // null, 'form', 'chat'

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Submit Support Issue</h1>
            <p className="text-gray-600 text-lg">Phase 3.0 - Hybrid Approach</p>
            <p className="text-gray-500 mt-2">Choose how you'd like to report your issue</p>
          </div>

          {/* Mode Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form Mode */}
            <button
              onClick={() => setMode('form')}
              className="group bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 text-left hover:border-gray-900 hover:shadow-2xl transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LayoutList className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Structured Form</h2>
              <p className="text-gray-600 mb-4">
                Fill out a guided form with dropdown menus and text fields. Best for straightforward issues.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4" />
                Quick and organized
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <CheckCircle2 className="w-4 h-4" />
                Smart doc suggestions
              </div>
            </button>

            {/* Chat Mode */}
            <button
              onClick={() => setMode('chat')}
              className="group bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 text-left hover:border-blue-500 hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity" />
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Conversational AI</h2>
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  NEW
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Describe your issue naturally. The AI will ask questions and help you troubleshoot.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4 text-blue-500" />
                AI-powered assistance
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Embedded documentation
              </div>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Both methods create the same structured issue - choose what feels more comfortable
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'chat') {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conversational Issue Submission</h1>
              <p className="text-sm text-gray-600 mt-1">Phase 3.0 - AI-Powered Support</p>
            </div>
            <button
              onClick={() => setMode(null)}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to options
            </button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-5xl mx-auto h-full">
            <ConversationalInterface />
          </div>
        </div>
      </div>
    );
  }

  // Form mode would render the original form here
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setMode(null)}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          ← Back to options
        </button>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Structured Form Mode</h2>
          <p className="text-gray-600">This would show the original form with smart sidebar (Phase 2.0)</p>
        </div>
      </div>
    </div>
  );
}
