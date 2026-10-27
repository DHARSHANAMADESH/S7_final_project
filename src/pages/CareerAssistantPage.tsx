import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User as UserIcon,
  FileText,
  Briefcase,
  Layers,
  Compass,
  Target,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/common/UIComponents';
import { useProfileStore, useAuthStore } from '../store';
import { askCareerAssistantApi } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    link: string;
  };
}

export const CareerAssistantPage: React.FC = () => {
  const { profile, fetchProfile } = useProfileStore();
  const { currentUser } = useAuthStore();

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const studentName = profile.name || currentUser?.name || 'Student';
    const skillsCount = (profile.skills || []).length;
    const cgpaDisplay = profile.cgpa && Number(profile.cgpa) > 0 ? `CGPA: ${profile.cgpa}` : 'CGPA not set';

    setMessages([
      {
        id: 'msg-init',
        sender: 'assistant',
        text: `Hello ${studentName}! I am your AI Placement & Career Copilot. I've analyzed your verified profile (${cgpaDisplay}, ${skillsCount} technical skills) against our active campus recruiters. How can I assist your placement preparation today?`,
        timestamp: 'Just now'
      }
    ]);
  }, [profile.name, profile.cgpa, profile.skills?.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await askCareerAssistantApi(textToSend.trim());
      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: response.text,
        timestamp: 'Just now',
        suggestedAction: response.action
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: err.message === 'Unauthorized'
          ? 'Session expired. Please log in again to use the Career Assistant.'
          : 'Unable to process guidance at this moment. Please ensure your profile is updated and try again.',
        timestamp: 'Just now',
        suggestedAction: { label: 'Update Profile', link: '/profile' }
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (promptText: string) => {
    sendMessage(promptText);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputPrompt);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Career Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Concise AI career advisory and preparation guidance tailored to your verified placement profile.
        </p>
      </div>

      {/* Quick Action Chips */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-subtle space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          How can I help you today?
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickAction('Improve my resume')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Improve my resume</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAction('Prepare for an interview')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
            <span>Prepare for an interview</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAction('Find suitable companies')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>Find suitable companies</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAction('Create a skill roadmap')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>Create a skill roadmap</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAction('Analyze my skill gaps')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Target className="w-3.5 h-3.5 text-amber-500" />
            <span>Analyze my skill gaps</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-subtle min-h-[380px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl rounded-xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white font-medium ml-8'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              {msg.text}

              {msg.suggestedAction && (
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <a
                    href={msg.suggestedAction.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Analyzing authenticated profile & recruiter data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask anything about interviews, skill preparation, or company cutoffs..."
          className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={loading}
          rightIcon={<Send className="w-4 h-4" />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
