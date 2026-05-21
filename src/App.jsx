import { useState } from 'react';
import { useProgress } from './hooks/useProgress';
import { useUser } from './hooks/useUser';
import { modules } from './data/modules';
import { Flame, ArrowLeft, ArrowRight, Check, User, Copy, ArrowRightLeft, Heart, X, ChevronDown } from 'lucide-react';

function UserBadge({ userId, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 transition-all"
    >
      <User size={12} />
      <span className="text-[11px] font-mono tracking-wider">{userId}</span>
    </button>
  );
}

function UserSwitcher({ userId, onSwitch, onClose }) {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSwitch = () => {
    if (input.trim().length >= 4) {
      onSwitch(input);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl p-6 animate-fade-up">
        <h3 className="text-white font-semibold mb-4">用户身份</h3>

        {/* 当前用户 */}
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <p className="text-slate-500 text-xs mb-1">当前用户码</p>
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-mono text-xl tracking-widest font-bold">{userId}</span>
            <button onClick={handleCopy} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-all">
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-slate-600 text-[10px] mt-2">记下此码，可在其他设备继续进度</p>
        </div>

        {/* 切换用户 */}
        <p className="text-slate-400 text-xs mb-2">输入其他用户码切换</p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="如 A3K7NP"
            maxLength={10}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono tracking-wider placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <button
            onClick={handleSwitch}
            disabled={input.trim().length < 4}
            className="px-4 py-2.5 rounded-xl bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-semibold text-sm transition-all"
          >
            切换
          </button>
        </div>

        <button onClick={onClose} className="w-full mt-4 py-2.5 text-slate-500 text-sm hover:text-white transition-colors">
          关闭
        </button>
      </div>
    </div>
  );
}

function IntroScreen({ onStart, userId, onOpenUser }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center animate-fade-up">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Flame size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">轻松戒烟</h1>
        <p className="text-amber-400/80 text-sm mb-6 font-medium">认知重构之旅</p>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto mb-10">
          破除对香烟的 20 个错误认知，重获自由
        </p>
        <button
          onClick={onStart}
          className="group px-10 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 active:scale-95"
        >
          开始旅程
          <ArrowRight size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={onOpenUser}
          className="flex items-center gap-1.5 mx-auto mt-6 text-slate-600 text-xs hover:text-slate-400 transition-colors"
        >
          <ArrowRightLeft size={12} />
          切换用户
        </button>
        <p className="mt-2 text-slate-700 text-[10px]">
          用户码 <span className="font-mono tracking-wider text-slate-500">{userId}</span>
        </p>
      </div>
    </div>
  );
}

function ProgressDots({ current, total, completed, poppingId }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const id = i + 1;
        const isDone = completed.includes(id);
        const isCurrent = id === current;
        const isPopping = id === poppingId;
        return (
          <div
            key={id}
            className={`rounded-full transition-all duration-300 ${
              isPopping ? 'animate-dot-pop' : ''
            } ${
              isCurrent
                ? 'w-6 h-2 bg-amber-400'
                : isDone
                ? 'w-2 h-2 bg-emerald-500'
                : 'w-2 h-2 bg-slate-700'
            }`}
          />
        );
      })}
    </div>
  );
}

/* 粒子爆炸效果 */
function SuccessBurst() {
  const colors = ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'];
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist = 20 + Math.random() * 30;
    return {
      id: i,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      size: 4 + Math.random() * 4,
      color: colors[i % colors.length],
      delay: Math.random() * 0.1,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function DonatePanel({ compact = false }) {
  const [open, setOpen] = useState(false);

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 text-pink-400 text-xs hover:from-pink-500/30 hover:to-rose-500/30 hover:border-pink-500/50 transition-all"
        >
          <Heart size={12} className="fill-pink-400" />
          <span>打赏支持</span>
        </button>
        {open && (
          <div className="absolute top-full right-0 mt-3 w-72 bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl shadow-black/50 animate-fade-up z-50">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white text-sm font-semibold">请作者喝杯咖啡</p>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="bg-white rounded-xl p-2 mb-2">
                  <img src="/donate/微信收款码.jpg" alt="微信收款码" className="w-full aspect-square object-cover rounded-lg" />
                </div>
                <span className="text-emerald-400 text-[10px] font-medium">微信支付</span>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-xl p-2 mb-2">
                  <img src="/donate/支付宝收款码.jpg" alt="支付宝收款码" className="w-full aspect-square object-cover rounded-lg" />
                </div>
                <span className="text-blue-400 text-[10px] font-medium">支付宝</span>
              </div>
            </div>
            <p className="text-slate-600 text-[10px] text-center mt-3">感谢每一份支持 ❤️</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="group/link inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 hover:from-pink-500/20 hover:to-rose-500/20 hover:border-pink-500/40 transition-all duration-300"
      >
        <Heart size={14} className="text-pink-400 fill-pink-400 group-hover/link:scale-110 transition-transform" />
        <span className="text-pink-300/80 text-sm">如果对你有帮助，请作者喝杯咖啡</span>
        <ChevronDown size={14} className={`text-pink-400/60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-4 bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm animate-fade-up">
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-2.5 shadow-lg shadow-black/20 group-hover:shadow-pink-500/10 group-hover:scale-105 transition-all duration-300">
                <img src="/donate/微信收款码.jpg" alt="微信收款码" className="w-full aspect-square object-cover rounded-xl" />
              </div>
              <span className="inline-block mt-2.5 text-emerald-400 text-xs font-medium">微信支付</span>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-2.5 shadow-lg shadow-black/20 group-hover:shadow-blue-500/10 group-hover:scale-105 transition-all duration-300">
                <img src="/donate/支付宝收款码.jpg" alt="支付宝收款码" className="w-full aspect-square object-cover rounded-xl" />
              </div>
              <span className="inline-block mt-2.5 text-blue-400 text-xs font-medium">支付宝</span>
            </div>
          </div>
          <p className="text-slate-600 text-[10px] text-center mt-4">感谢每一份支持 ❤️</p>
        </div>
      )}
    </div>
  );
}

function CardView({ module, revealed, onReveal, quizAnswer, showResult, onAnswer, completed, animClass, showBurst }) {
  const isCorrect = quizAnswer === module.answer;

  return (
    <div className={`relative ${animClass}`}>
      {showBurst && <SuccessBurst />}

      <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
        isCorrect ? 'border-emerald-500/50 shadow-emerald-500/10' : 'border-slate-700/50'
      }`}>
        {/* 顶部标签 */}
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {completed ? '已掌握' : `第${module.id}组`}
            </span>
            <span className="text-slate-600 text-xs">·</span>
            <span className="text-slate-400 text-xs">{module.title}</span>
          </div>
        </div>

        {/* 误区 */}
        <div className="px-6 pb-4">
          <div className="bg-red-950/30 border border-red-900/30 rounded-2xl p-4">
            <span className="text-red-500 text-[10px] font-bold tracking-widest uppercase">误区</span>
            <p className="text-red-100/90 text-sm leading-relaxed mt-2">{module.myth}</p>
          </div>
        </div>

        {/* 按钮 / 真相 */}
        {!revealed ? (
          <div className="px-6 pb-6">
            <button
              onClick={onReveal}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              揭示真相
            </button>
          </div>
        ) : (
          <div className="animate-fade-up">
            {/* 真相 */}
            <div className="px-6 pb-4">
              <div className="bg-emerald-950/30 border border-emerald-900/30 rounded-2xl p-4">
                <span className="text-emerald-500 text-[10px] font-bold tracking-widest uppercase">真相</span>
                <p className="text-emerald-100/90 text-sm leading-relaxed mt-2">{module.truth}</p>
              </div>
            </div>

            {/* 测验 */}
            <div className="px-6 pb-6">
              <p className="text-white/80 text-xs font-medium mb-3">{module.quiz}</p>
              <div className="space-y-2">
                {module.options.map((opt, idx) => {
                  const isWrong = showResult && !isCorrect && idx === quizAnswer;
                  const isRight = showResult && idx === module.answer;
                  let cls = 'w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ';
                  if (isRight) {
                    cls += 'bg-emerald-600/30 border border-emerald-500/60 text-emerald-200 animate-answer-glow ';
                  } else if (isWrong) {
                    cls += 'bg-red-600/20 border border-red-500/40 text-red-300 ';
                  } else if (showResult && isCorrect) {
                    cls += 'bg-slate-800/50 border border-slate-800 text-slate-600 ';
                  } else {
                    cls += 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-amber-500/50 hover:bg-slate-700/80 active:scale-[0.98] ';
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (isCorrect) return;
                        if (isWrong) return;
                        onAnswer(idx);
                      }}
                      className={cls}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {showResult && (
                <p className={`mt-3 text-xs font-medium ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCorrect ? '✓ 正确！继续下一组' : '✗ 不对，再想想'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CompletionScreen({ onReset }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 relative overflow-y-auto">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 text-center animate-fade-up w-full max-w-sm mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Check size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">你自由了</h1>
        <p className="text-emerald-400 text-sm mb-6">你已看清所有关于香烟的谎言</p>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left space-y-2.5 mb-5">
          <p className="text-amber-400 text-xs font-semibold mb-3">核心真相</p>
          {[
            '戒烟是摆脱骗局，不是放弃好东西',
            '你从未真正享受过吸烟',
            '戒断反应极其轻微',
            '一根烟都不要碰',
            '你不需要意志力',
          ].map((t, i) => (
            <p key={i} className="text-slate-300 text-xs flex gap-2.5 leading-relaxed">
              <span className="text-emerald-400 shrink-0">✓</span> {t}
            </p>
          ))}
        </div>

        <div className="mb-5">
          <DonatePanel />
        </div>

        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-sm hover:text-white hover:border-slate-600 transition-all"
        >
          重新开始
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { user, switchUser } = useUser();
  const { progress, isCompleted, completeModule, setStep, resetProgress } = useProgress(user.id);
  const [currentCard, setCurrentCard] = useState(1);
  const [revealed, setRevealed] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [animClass, setAnimClass] = useState('animate-card-enter');
  const [showBurst, setShowBurst] = useState(false);
  const [poppingDot, setPoppingDot] = useState(null);
  const [showUserPanel, setShowUserPanel] = useState(false);

  const module = modules[currentCard - 1];
  const cardCompleted = isCompleted(currentCard);
  const isCorrect = showResult && quizAnswer === module.answer;

  const handleStart = () => {
    setStep('cards');
    const firstUnfinished = modules.find((m) => !isCompleted(m.id));
    if (firstUnfinished) setCurrentCard(firstUnfinished.id);
    setRevealed(false);
    setQuizAnswer(null);
    setShowResult(false);
    setAnimClass('animate-card-enter');
  };

  const goTo = (id) => {
    if (id < 1 || id > 20) return;
    setCurrentCard(id);
    setRevealed(isCompleted(id));
    setQuizAnswer(null);
    setShowResult(false);
    setAnimClass('animate-card-enter');
    setShowBurst(false);
  };

  const handleAnswer = (idx) => {
    setQuizAnswer(idx);
    setShowResult(true);
    if (idx === module.answer) {
      // 答对了！播放庆祝动画序列
      setAnimClass('animate-card-celebrate');
      setShowBurst(true);
      setPoppingDot(module.id);

      setTimeout(() => {
        setShowBurst(false);
        setPoppingDot(null);
        setAnimClass('animate-card-exit');

        setTimeout(() => {
          completeModule(module.id);
          if (currentCard >= 20) {
            setStep('complete');
          } else {
            goTo(currentCard + 1);
          }
        }, 280);
      }, 500);
    }
  };

  const handleReset = () => {
    resetProgress();
    setCurrentCard(1);
    setRevealed(false);
    setQuizAnswer(null);
    setShowResult(false);
    setAnimClass('animate-card-enter');
    setShowBurst(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white select-none">
      {progress.currentStep === 'intro' && (
        <IntroScreen onStart={handleStart} userId={user.id} onOpenUser={() => setShowUserPanel(true)} />
      )}

      {progress.currentStep === 'cards' && (
        <div className="h-screen flex flex-col">
          {/* 顶部栏 */}
          <div className="px-5 pt-5 pb-3 flex items-center justify-between shrink-0">
            <button
              onClick={() => setStep('intro')}
              className="text-slate-500 text-xs"
            >
              首页
            </button>
            <div className="flex items-center gap-2">
              <DonatePanel compact />
              <UserBadge userId={user.id} onClick={() => setShowUserPanel(true)} />
            </div>
          </div>

          {/* 进度点 */}
          <div className="px-5 pb-4 shrink-0">
            <ProgressDots
              current={currentCard}
              total={20}
              completed={progress.completed}
              poppingId={poppingDot}
            />
          </div>

          {/* 卡片区域 */}
          <div className="flex-1 px-5 overflow-y-auto pb-4">
            <CardView
              module={module}
              revealed={revealed || cardCompleted}
              onReveal={() => setRevealed(true)}
              quizAnswer={quizAnswer}
              showResult={showResult}
              onAnswer={handleAnswer}
              completed={cardCompleted}
              animClass={animClass}
              showBurst={showBurst}
            />
          </div>

          {/* 底部导航 */}
          <div className="px-5 py-4 flex items-center justify-between shrink-0 border-t border-slate-800/50">
            <button
              onClick={() => goTo(currentCard - 1)}
              disabled={currentCard <= 1}
              className="flex items-center gap-1 text-sm text-slate-500 disabled:opacity-30 transition-all"
            >
              <ArrowLeft size={16} />
              上一组
            </button>
            <span className="text-slate-600 text-xs">
              {currentCard} / 20
            </span>
            <button
              onClick={() => goTo(currentCard + 1)}
              disabled={currentCard >= 20 || !isCompleted(currentCard)}
              className="flex items-center gap-1 text-sm text-slate-500 disabled:opacity-30 transition-all"
            >
              下一组
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {progress.currentStep === 'complete' && <CompletionScreen onReset={handleReset} />}

      {showUserPanel && (
        <UserSwitcher
          userId={user.id}
          onSwitch={switchUser}
          onClose={() => setShowUserPanel(false)}
        />
      )}
    </div>
  );
}
