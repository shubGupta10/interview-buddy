import React, { useState } from 'react';
import { Book, X, List, Lightbulb, Code, FileText, Loader2, Copy, Check, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

type ExplanationData = {
  actionable_insights: string[];
  examples: string[];
  explanation: string;
  key_points: string[];
};

type ExplainQuestionProps = {
  question: string;
  questionId: string;
  isOpen: boolean;
  onClose: () => void;
};

const ExplainQuestionComponent: React.FC<ExplainQuestionProps> = ({
  question,
  questionId,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'explanation' | 'keyPoints' | 'insights' | 'examples'
  >('explanation');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExplanationData | null>(null);
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  React.useEffect(() => {
    const fetchExplanation = async () => {
      if (!isOpen || !questionId || !question) return;

      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/question/explain-questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionId,
            question,
          }),
        });

        const result = await response.json();

        if (result.status === 200) {
          setData(result.explanation);
        } else {
          toast.error('Failed to fetch explanation');
          setData({
            explanation:
              "We're having trouble generating an explanation for this question. Please try again later.",
            key_points: ['This feature is currently experiencing issues.'],
            actionable_insights: ['Try refreshing the page or try again later.'],
            examples: ['Example not available at this time.'],
          });
        }
      } catch (error) {
        toast.error('Error loading explanation');
        setData({
          explanation:
            "We're having trouble generating an explanation for this question. Please try again later.",
          key_points: ['This feature is currently experiencing issues.'],
          actionable_insights: ['Try refreshing the page or try again later.'],
          examples: ['Example not available at this time.'],
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchExplanation();
    }
  }, [isOpen, questionId, question, backendUrl]);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMap(prev => ({ ...prev, [key]: true }));
      toast.success('Copied to clipboard!');
      setTimeout(() => {
        setCopiedMap(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  if (!isOpen) return null;

  const modalClass = loading
    ? 'fixed inset-0 flex items-center justify-center z-50'
    : 'fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8';

  const contentClass = loading
    ? 'bg-gradient-to-br from-[#1A1040] to-[#231651] p-8 rounded-lg border border-[#9D4EDD]/30 shadow-xl w-full max-w-lg transform transition-all'
    : 'bg-gradient-to-br from-[#1A1040] to-[#231651] rounded-lg border border-[#9D4EDD]/30 shadow-xl w-full max-w-[90vw] md:max-w-4xl transform transition-all flex flex-col h-[85vh]';

  const TabButton = ({
    isActive,
    onClick,
    icon: Icon,
    label,
  }: {
    isActive: boolean;
    onClick: () => void;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-sm transition-all duration-200 cursor-pointer whitespace-nowrap
        ${
          isActive
            ? 'text-[#05FFF8] border-b-2 border-[#05FFF8]'
            : 'text-[#D1D7E0]/70 hover:text-[#D1D7E0] hover:bg-[#9D4EDD]/10'
        }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </button>
  );

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => handleCopy(text, id)}
      className="p-2 hover:bg-[#9D4EDD]/20 rounded-full transition-colors"
      title="Copy to clipboard"
    >
      {copiedMap[id] ? (
        <Check className="h-4 w-4 text-green-400" />
      ) : (
        <Copy className="h-4 w-4 text-[#05FFF8]" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className={modalClass}>
        <div className={contentClass}>
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#05FFF8] animate-spin mb-4" />
            <p className="text-[#D1D7E0]">Generating explanation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={modalClass}>
      <div className={contentClass}>
        {/* Header */}
        <div className="border-b border-[#9D4EDD]/20 p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center text-[#05FFF8] text-lg font-medium">
            <Book className="h-5 w-5 mr-2" />
            Detailed Explanation
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#9D4EDD]/20 text-[#D1D7E0]/70 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg mx-4 mt-4 p-3 flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-500 text-sm">
            Please note: Your explanation data will not be saved. If you close this window, you'll need to generate the explanation again.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#9D4EDD]/20 overflow-x-auto shrink-0 mt-4">
          <div className="flex">
            <TabButton
              isActive={activeTab === 'explanation'}
              onClick={() => setActiveTab('explanation')}
              icon={FileText}
              label="Explanation"
            />
            <TabButton
              isActive={activeTab === 'keyPoints'}
              onClick={() => setActiveTab('keyPoints')}
              icon={List}
              label="Key Points"
            />
            <TabButton
              isActive={activeTab === 'insights'}
              onClick={() => setActiveTab('insights')}
              icon={Lightbulb}
              label="Actionable Insights"
            />
            <TabButton
              isActive={activeTab === 'examples'}
              onClick={() => setActiveTab('examples')}
              icon={Code}
              label="Examples"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'explanation' && (
            <div className="bg-[#1A1040]/40 border border-[#9D4EDD]/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-[#05FFF8] font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Detailed Explanation:
                </h3>
                <CopyButton
                  text={data?.explanation || ''}
                  id="explanation"
                />
              </div>
              <div className="text-[#D1D7E0]/90 whitespace-pre-line">
                {data?.explanation || 'No explanation available.'}
              </div>
            </div>
          )}

          {activeTab === 'keyPoints' && (
            <div className="bg-[#1A1040]/40 border border-[#9D4EDD]/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-[#05FFF8] font-medium flex items-center">
                  <List className="h-4 w-4 mr-2" />
                  Key Points:
                </h3>
                <CopyButton
                  text={data?.key_points?.join('\n') || ''}
                  id="keyPoints"
                />
              </div>
              <ul className="space-y-2">
                {data?.key_points && data.key_points.length > 0 ? (
                  data.key_points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#9D4EDD]/20 text-[#05FFF8] text-xs mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-[#D1D7E0]/90">{point}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#D1D7E0]/90">No key points available.</li>
                )}
              </ul>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="bg-[#1A1040]/40 border border-[#9D4EDD]/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-[#05FFF8] font-medium flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Actionable Insights:
                </h3>
                <CopyButton
                  text={data?.actionable_insights?.join('\n') || ''}
                  id="insights"
                />
              </div>
              <ul className="space-y-2">
                {data?.actionable_insights && data.actionable_insights.length > 0 ? (
                  data.actionable_insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#9D4EDD]/20 text-[#05FFF8] text-xs mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-[#D1D7E0]/90">{insight}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#D1D7E0]/90">
                    No actionable insights available.
                  </li>
                )}
              </ul>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="bg-[#1A1040]/40 border border-[#9D4EDD]/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-[#05FFF8] font-medium flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  Examples:
                </h3>
                <CopyButton
                  text={data?.examples?.join('\n\n') || ''}
                  id="examples"
                />
              </div>
              <div className="space-y-4">
                {data?.examples && data.examples.length > 0 ? (
                  data.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-[#1A1040]/60 border border-[#9D4EDD]/20 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#05FFF8] text-sm">
                          Example {index + 1}
                        </span>
                        <CopyButton
                          text={example}
                          id={`example-${index}`}
                        />
                      </div>
                      <pre className="text-[#D1D7E0]/90 whitespace-pre-wrap text-sm font-mono overflow-x-auto">
                        {example}
                      </pre>
                    </div>
                  ))
                ) : (
                  <div className="text-[#D1D7E0]/90">No examples available.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#9D4EDD]/20 p-4 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#9D4EDD]/20 text-[#9D4EDD] border border-[#9D4EDD]/30 rounded-md hover:bg-[#9D4EDD]/30 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplainQuestionComponent;