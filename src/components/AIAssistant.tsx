import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, MessageCircle, Send, Lightbulb, BookOpen, 
  HelpCircle, Zap, X, Minimize2, Maximize2, Sparkles,
  ChevronUp, ChevronDown
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  currentSubject?: string;
  studyContext?: string;
  isMinimized?: boolean;
  onToggleMinimize?: (minimized: boolean) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  currentSubject = '',
  studyContext = '',
  isMinimized = false,
  onToggleMinimize
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hi! I'm your AI study assistant. I'm here to help you with ${currentSubject || 'your studies'}. What would you like to work on?`,
      timestamp: new Date(),
      suggestions: ['Explain a concept', 'Practice problems', 'Study tips', 'Quick quiz']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: 'Ask AI', icon: Brain, action: 'ask' },
    { label: 'Explain Concept', icon: Lightbulb, action: 'explain' },
    { label: 'Get Hints', icon: HelpCircle, action: 'hints' },
    { label: 'Practice Problems', icon: BookOpen, action: 'practice' }
  ];

  const aiSuggestions = [
    `${currentSubject || 'Math'} practice problems for your level`,
    'Quick review of today\'s topics',
    'Study break recommendations',
    'Memory techniques for better retention'
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(content),
        timestamp: new Date(),
        suggestions: generateSuggestions(content)
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      `Great question about ${currentSubject}! Let me break this down for you...`,
      `I can help you understand this concept better. Here's a step-by-step explanation...`,
      `That's an excellent topic to focus on. Let me provide some insights...`,
      `I notice you're working on ${currentSubject}. Here are some key points to remember...`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateSuggestions = (userInput: string): string[] => {
    return [
      'Can you explain this differently?',
      'Give me a practice problem',
      'What should I study next?',
      'How can I remember this better?'
    ];
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      ask: 'I have a question about this topic...',
      explain: `Can you explain the key concepts in ${currentSubject}?`,
      hints: 'I need some hints to solve this problem',
      practice: `Give me some practice problems for ${currentSubject}`
    };
    handleSendMessage(actionMessages[action as keyof typeof actionMessages] || '');
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="btn-study-focus rounded-full w-14 h-14 shadow-glow animate-pulse"
        >
          <Brain className="h-6 w-6" />
        </Button>
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -left-2 bg-study-success text-white animate-bounce"
        >
          AI
        </Badge>
      </div>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-6 right-6 w-80 h-16' 
        : 'bottom-6 right-6 w-96 h-[600px]'
    }`}>
      <Card className="h-full bg-card/95 backdrop-blur-sm border-study-focus/20 shadow-glow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="p-2 bg-study-focus/10 rounded-lg">
                <Brain className="h-5 w-5 text-study-focus" />
              </div>
              <span>AI Study Assistant</span>
              <Sparkles className="h-4 w-4 text-study-energy animate-pulse" />
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleMinimize?.(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {currentSubject && (
            <Badge variant="outline" className="w-fit">
              Helping with: {currentSubject}
            </Badge>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-full space-y-4 pb-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs hover:bg-study-focus/10"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {action.label}
                  </Button>
                );
              })}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-study-focus text-white' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs h-auto p-1 hover:bg-white/20"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* AI Suggestions Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">AI Suggestions:</h4>
              <div className="space-y-1">
                {aiSuggestions.slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSendMessage(suggestion)}
                    className="w-full justify-start text-xs text-muted-foreground hover:bg-study-calm/10"
                  >
                    <Lightbulb className="h-3 w-3 mr-2" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="btn-study-focus"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}

        {isMinimized && (
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-study-success rounded-full animate-pulse" />
              <span className="text-sm font-medium">AI Assistant Ready</span>
            </div>
            <Badge variant="secondary">{messages.length - 1}</Badge>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIAssistant;