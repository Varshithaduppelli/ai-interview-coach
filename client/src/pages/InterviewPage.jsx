import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mic, MicOff, Send, ChevronRight, StopCircle, Loader2, CheckCircle, RefreshCw, Volume2 } from 'lucide-react';

const STEPS = { SETUP: 'setup', INTERVIEW: 'interview', FEEDBACK: 'feedback', COMPLETE: 'complete' };

function ScoreBar({ label, value, max = 10 }) {
  const pct = (value / max) * 100;
  const color = value >= 7 ? 'bg-green-500' : value >= 5 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">{value}/{max}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full"><div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export default function InterviewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.SETUP);
  const [config, setConfig] = useState({ type: 'mixed', difficulty: 'medium', numQuestions: 5 });
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [inputMode, setInputMode] = useState('text');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [followUp, setFollowUp] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (step === 'interview') {
      setTimeLeft(120);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step, currentIdx]);

  const currentQ = questions[currentIdx];
  const isLastQ = currentIdx === questions.length - 1;

  const startSession = async () => {
    try {
      const { data } = await api.post('/interview/start', config);
      setSessionId(data.sessionId);
      setQuestions(data.questions);
      setStep(STEPS.INTERVIEW);
      setStartTime(Date.now());
      await api.get('/questions/seed');
    } catch {
      toast.error('Failed to start session. Check your connection.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      recorder.ondataavailable = e => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      mediaRef.current = recorder;
      setIsRecording(true);
    } catch {
      toast.error('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setIsRecording(false);
  };

  const submitAnswer = async () => {
    if (inputMode === 'text' && textAnswer.trim().length < 20) {
      return toast.error('Please write a more detailed answer (at least 20 characters)');
    }
    if (inputMode === 'voice' && !audioBlob) {
      return toast.error('Please record your answer first');
    }

    setIsSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    try {
      let res;
      if (inputMode === 'text') {
        res = await api.post('/interview/answer/text', {
          sessionId,
          questionId: currentQ._id,
          questionText: currentQ.text,
          answerText: textAnswer,
          category: currentQ.category,
          timeTaken
        });
      } else {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'answer.webm');
        formData.append('sessionId', sessionId);
        formData.append('questionId', currentQ._id);
        formData.append('questionText', currentQ.text);
        formData.append('category', currentQ.category);
        formData.append('timeTaken', timeTaken);
        res = await api.post('/interview/answer/voice', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.transcribedText) setTextAnswer(res.data.transcribedText);
      }
      setFeedback(res.data.feedback);
      setStep(STEPS.FEEDBACK);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFollowUp = async () => {
    try {
      const { data } = await api.post('/interview/followup', { question: currentQ.text, answer: textAnswer });
      setFollowUp(data.followUpQuestion);
    } catch {
      toast.error('Could not generate follow-up');
    }
  };

  const nextQuestion = () => {
    if (isLastQ) {
      completeSession();
    } else {
      setCurrentIdx(idx => idx + 1);
      setTextAnswer('');
      setAudioBlob(null);
      setFeedback(null);
      setFollowUp(null);
      setStep(STEPS.INTERVIEW);
      setStartTime(Date.now());
    }
  };

  const completeSession = async () => {
    try {
      await api.post('/interview/complete', { sessionId });
      navigate(`/results/${sessionId}`);
    } catch {
      navigate(`/results/${sessionId}`);
    }
  };

  if (step === STEPS.SETUP) return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Configure your interview</h1>
      <p className="text-slate-400 mb-8">Customize to match your target role and current skill level.</p>
      <div className="card space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-300 mb-3 block">Interview type</label>
          <div className="grid grid-cols-2 gap-3">
            {['mixed', 'technical', 'behavioral', 'system-design'].map(t => (
              <button key={t} onClick={() => setConfig({...config, type: t})}
                className={`p-3 rounded-xl border text-sm font-medium transition-all capitalize ${config.type === t ? 'border-blue-500 bg-blue-600/20 text-blue-300' : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                {t.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-3 block">Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {['easy', 'medium', 'hard'].map(d => (
              <button key={d} onClick={() => setConfig({...config, difficulty: d})}
                className={`p-3 rounded-xl border text-sm font-medium transition-all capitalize ${config.difficulty === d ? 'border-blue-500 bg-blue-600/20 text-blue-300' : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-3 block">Number of questions: <span className="text-blue-400">{config.numQuestions}</span></label>
          <input type="range" min="3" max="10" value={config.numQuestions} onChange={e => setConfig({...config, numQuestions: parseInt(e.target.value)})}
            className="w-full accent-blue-500" />
          <div className="flex justify-between text-xs text-slate-500 mt-1"><span>3</span><span>10</span></div>
        </div>
        <button onClick={startSession} className="btn-primary w-full text-base py-3">
          Start interview →
        </button>
      </div>
    </div>
  );

  if (step === STEPS.INTERVIEW) return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-slate-400">Question <span className="text-white font-semibold">{currentIdx + 1}</span> of {questions.length}</div>
        <div className="flex gap-1">
          {questions.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < currentIdx ? 'bg-green-500' : i === currentIdx ? 'bg-blue-500' : 'bg-slate-600'}`} />)}
        </div>
        <span className={`text-sm font-mono font-bold px-3 py-1 rounded-lg ${timeLeft <= 30 ? "bg-red-900/40 text-red-300" : "bg-slate-700 text-slate-300"}`}>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}</span>
        <span className={`badge capitalize text-xs ${currentQ?.difficulty === 'hard' ? 'bg-red-900/40 text-red-300' : currentQ?.difficulty === 'medium' ? 'bg-yellow-900/40 text-yellow-300' : 'bg-green-900/40 text-green-300'}`}>{currentQ?.difficulty}</span>
      </div>

      <div className="card mb-6">
        <span className="badge bg-blue-900/40 text-blue-300 text-xs mb-4 capitalize">{currentQ?.category?.replace('-', ' ')}</span>
        <h2 className="text-xl font-semibold text-white leading-relaxed">{currentQ?.text}</h2>
      </div>

      <div className="card">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setInputMode('text')} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${inputMode === 'text' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>
            <Send className="w-3.5 h-3.5" /> Type
          </button>
          <button onClick={() => setInputMode('voice')} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${inputMode === 'voice' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>
            <Mic className="w-3.5 h-3.5" /> Voice
          </button>
        </div>

        {inputMode === 'text' ? (
          <textarea className="input h-40 resize-none" placeholder="Type your answer here... Be detailed and use the STAR method for behavioral questions." value={textAnswer} onChange={e => setTextAnswer(e.target.value)} />
        ) : (
          <div className="flex flex-col items-center py-8 gap-4">
            {!isRecording && !audioBlob && (
              <button onClick={startRecording} className="w-20 h-20 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-all">
                <Mic className="w-8 h-8 text-white" />
              </button>
            )}
            {isRecording && (
              <button onClick={stopRecording} className="w-20 h-20 bg-red-600 recording-pulse rounded-full flex items-center justify-center">
                <StopCircle className="w-8 h-8 text-white" />
              </button>
            )}
            {audioBlob && !isRecording && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-green-400"><CheckCircle className="w-5 h-5" /> Recording ready</div>
                <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
                <button onClick={() => setAudioBlob(null)} className="text-sm text-slate-400 hover:text-white flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Re-record</button>
              </div>
            )}
            <p className="text-sm text-slate-400">{isRecording ? 'Recording... click to stop' : audioBlob ? '' : 'Click to start recording'}</p>
          </div>
        )}

        <button onClick={submitAnswer} disabled={isSubmitting} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
          {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting AI feedback...</> : <><Send className="w-4 h-4" /> Submit answer</>}
        </button>
      </div>
    </div>
  );

  if (step === STEPS.FEEDBACK && feedback) return (
    <div className="max-w-3xl mx-auto px-6 py-8 feedback-slide">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">AI Feedback</h2>
        <div className={`text-4xl font-bold ${feedback.score >= 7 ? 'text-green-400' : feedback.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>{feedback.score}/10</div>
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold text-slate-300 mb-2 text-sm uppercase tracking-wide">Overall assessment</h3>
        <p className="text-white">{feedback.overall}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="card bg-slate-800/50 space-y-2">
          <ScoreBar label="Confidence" value={feedback.confidenceScore} />
          <ScoreBar label="Clarity" value={feedback.clarityScore} />
          <ScoreBar label="Relevance" value={feedback.relevanceScore} />
        </div>

        <div className="card bg-green-900/20 border-green-800/40">
          <h3 className="font-semibold text-green-400 mb-3 text-sm">✓ Strengths</h3>
          <ul className="space-y-1.5">{feedback.strengths?.map((s, i) => <li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-green-400 mt-0.5">•</span>{s}</li>)}</ul>
        </div>

        <div className="card bg-amber-900/20 border-amber-800/40">
          <h3 className="font-semibold text-amber-400 mb-3 text-sm">↗ Improve</h3>
          <ul className="space-y-1.5">{feedback.improvements?.map((s, i) => <li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-amber-400 mt-0.5">•</span>{s}</li>)}</ul>
        </div>
      </div>

      {feedback.sampleAnswer && (
        <div className="card bg-blue-900/20 border-blue-800/40 mb-4">
          <h3 className="font-semibold text-blue-400 mb-2 text-sm flex items-center gap-1.5"><Volume2 className="w-4 h-4" /> Model answer</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{feedback.sampleAnswer}</p>
        </div>
      )}

      {followUp ? (
        <div className="card bg-purple-900/20 border-purple-800/40 mb-4">
          <h3 className="font-semibold text-purple-400 mb-2 text-sm">AI Follow-up question</h3>
          <p className="text-white italic">"{followUp}"</p>
        </div>
      ) : (
        <button onClick={getFollowUp} className="btn-secondary text-sm mb-4 flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Generate follow-up question
        </button>
      )}

      <button onClick={nextQuestion} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3">
        {isLastQ ? 'Complete interview →' : <><ChevronRight className="w-4 h-4" /> Next question</>}
      </button>
    </div>
  );

  return null;
}

