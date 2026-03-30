import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw,
  BookOpen,
  Play,
  User,
  Map as MapIcon,
  Building2,
  ArrowRight,
  ArrowLeft,
  School,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Data ---

const THEORY_DIRECTIONS = [
  {
    term: "A la derecha",
    translation: "Դեպի աջ",
    description: "Օգտագործվում է, երբ պետք է թեքվել աջ կողմ:",
    example: "Gira a la derecha en el semáforo.",
    icon: <ArrowRight className="w-12 h-12 text-orange-500" />
  },
  {
    term: "A la izquierda",
    translation: "Դեպի ձախ",
    description: "Օգտագործվում է, երբ պետք է թեքվել ձախ կողմ:",
    example: "El banco está a la izquierda.",
    icon: <ArrowLeft className="w-12 h-12 text-blue-500" />
  },
  {
    term: "Todo recto",
    translation: "Ամբողջն ուղիղ",
    description: "Օգտագործվում է, երբ պետք է շարունակել ճանապարհը առանց թեքվելու:",
    example: "Sigue todo recto por esta calle.",
    icon: <Navigation className="w-12 h-12 text-green-500" />
  },
  {
    term: "En el centro",
    translation: "Կենտրոնում",
    description: "Օգտագործվում է, երբ ինչ-որ բան գտնվում է մեջտեղում կամ կենտրոնական մասում:",
    example: "El museo está en el centro de la plaza.",
    icon: <Building2 className="w-12 h-12 text-red-500" />
  }
];

const DIRECTIONS_GAME_LEVELS = [
  {
    scenario: "Դու տեսնում ես լուսացույցը և պետք է թեքվես աջ:",
    question: "En el semáforo, gira _____.",
    options: ["a la derecha", "a la izquierda", "todo recto"],
    answer: "a la derecha",
    icon: "🚦"
  },
  {
    scenario: "Ճանապարհը շատ պարզ է, պետք չէ թեքվել:",
    question: "Sigue _____, no te gires.",
    options: ["todo recto", "en el centro", "a la derecha"],
    answer: "todo recto",
    icon: "🛣️"
  },
  {
    scenario: "Բանկը գտնվում է քո ձախ կողմում:",
    question: "El banco está _____.",
    options: ["a la derecha", "a la izquierda", "todo recto"],
    answer: "a la izquierda",
    icon: "🏦"
  },
  {
    scenario: "Շատրվանը գտնվում է հրապարակի մեջտեղում:",
    question: "La fuente está _____ de la plaza.",
    options: ["en el centro", "todo recto", "a la izquierda"],
    answer: "en el centro",
    icon: "⛲"
  },
  {
    scenario: "Հիվանդանոցը գտնվում է աջ կողմում:",
    question: "El hospital está _____.",
    options: ["a la derecha", "a la izquierda", "en el centro"],
    answer: "a la derecha",
    icon: "🏥"
  },
  {
    scenario: "Դպրոցը գտնվում է հենց ուղիղ ճանապարհին:",
    question: "La escuela está _____.",
    options: ["todo recto", "a la derecha", "a la izquierda"],
    answer: "todo recto",
    icon: "🏫"
  },
  {
    scenario: "Սուպերմարկետը ձախ կողմում է:",
    question: "El supermercado está _____.",
    options: ["a la izquierda", "todo recto", "en el centro"],
    answer: "a la izquierda",
    icon: "🛒"
  },
  {
    scenario: "Այգին գտնվում է քաղաքի կենտրոնում:",
    question: "El parque está _____.",
    options: ["en el centro", "a la derecha", "todo recto"],
    answer: "en el centro",
    icon: "🌳"
  },
  {
    scenario: "Թատրոնը գտնվում է աջ կողմում:",
    question: "El teatro está _____.",
    options: ["a la derecha", "a la izquierda", "todo recto"],
    answer: "a la derecha",
    icon: "🎭"
  },
  {
    scenario: "Սրճարանը գտնվում է ուղիղ ճանապարհի վրա:",
    question: "La cafetería está _____.",
    options: ["todo recto", "en el centro", "a la izquierda"],
    answer: "todo recto",
    icon: "☕"
  }
];

const USEFUL_WORDS = [
  { sp: "¿Cómo llego?", am: "Ինչպե՞ս հասնեմ" },
  { sp: "Justo en frente", am: "Հենց դիմացը" },
  { sp: "No está lejos", am: "Հեռու չէ" },
  { sp: "Cerca de", am: "Մոտիկ" }
];

const GAME_LEVELS = [
  {
    question: "¿_____ llego al museo?",
    options: ["Cómo", "Dónde", "Qué"],
    answer: "Cómo",
    hint: "Ինչպե՞ս"
  },
  {
    question: "Sigue todo _____ por esta calle.",
    options: ["recto", "derecha", "lejos"],
    answer: "recto",
    hint: "Ուղիղ"
  },
  {
    question: "En el semáforo, gira a la _____.",
    options: ["derecha", "banco", "recto"],
    answer: "derecha",
    hint: "Աջ"
  },
  {
    question: "El museo está justo en _____ del banco.",
    options: ["frente", "cerca", "lejos"],
    answer: "frente",
    hint: "Դիմացը"
  },
  {
    question: "No está _____, está cerca.",
    options: ["lejos", "recto", "derecha"],
    answer: "lejos",
    hint: "Հեռու"
  },
  {
    question: "Gira a la _____ en la esquina.",
    options: ["izquierda", "recto", "frente"],
    answer: "izquierda",
    hint: "Ձախ"
  },
  {
    question: "El museo está _____ de aquí.",
    options: ["cerca", "lejos", "recto"],
    answer: "cerca",
    hint: "Մոտիկ"
  },
  {
    question: "¿_____ está la plaza?",
    options: ["Dónde", "Cómo", "Qué"],
    answer: "Dónde",
    hint: "Որտե՞ղ"
  },
  {
    question: "Camina dos _____ más.",
    options: ["cuadras", "museos", "bancos"],
    answer: "cuadras",
    hint: "Թաղամաս"
  },
  {
    question: "El museo abre a las _____.",
    options: ["diez", "recto", "cerca"],
    answer: "diez",
    hint: "Տասը"
  }
];

const MATCHING_WORDS = [
  { am: "Թանգարան", sp: "Museo" },
  { am: "Լուսացույց", sp: "Semáforo" },
  { am: "Բանկ", sp: "Banco" },
  { am: "Աջ", sp: "Derecha" },
  { am: "Ձախ", sp: "Izquierda" },
  { am: "Ուղիղ", sp: "Recto" },
  { am: "Հեռու", sp: "Lejos" },
  { am: "Մոտիկ", sp: "Cerca" },
  { am: "Հրապարակ", sp: "Plaza" },
  { am: "Փողոց", sp: "Calle" }
];

// --- Main Component ---

export default function MuseumDialogueApp() {
  const [view, setView] = useState<'intro' | 'game1' | 'game2' | 'theory' | 'directionsGame' | 'result'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [directionsLevel, setDirectionsLevel] = useState(0);
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [characterMood, setCharacterMood] = useState<'happy' | 'thinking' | 'sad' | 'neutral'>('neutral');
  
  // Game 2 State
  const [selectedAm, setSelectedAm] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [shuffledSp, setShuffledSp] = useState<string[]>([]);

  const startMatchingGame = () => {
    setShuffledSp([...MATCHING_WORDS.map(w => w.sp)].sort(() => Math.random() - 0.5));
    setView('game2');
    setMatchedPairs([]);
    setSelectedAm(null);
    setCharacterMood('neutral');
  };

  const handleAnswer = (option: string) => {
    if (feedback) return;

    if (option === GAME_LEVELS[currentLevel].answer) {
      setFeedback('correct');
      setCharacterMood('happy');
      setPoints(prev => prev + 1);
    } else {
      setFeedback('wrong');
      setCharacterMood('sad');
    }

    setTimeout(() => {
      if (currentLevel < GAME_LEVELS.length - 1) {
        setCurrentLevel(prev => prev + 1);
        setFeedback(null);
        setCharacterMood('neutral');
      } else {
        setFeedback(null);
        startMatchingGame();
      }
    }, 1500);
  };

  const handleDirectionsAnswer = (option: string) => {
    if (feedback) return;

    if (option === DIRECTIONS_GAME_LEVELS[directionsLevel].answer) {
      setFeedback('correct');
      setCharacterMood('happy');
      setPoints(prev => prev + 1);
    } else {
      setFeedback('wrong');
      setCharacterMood('sad');
    }

    setTimeout(() => {
      if (directionsLevel < DIRECTIONS_GAME_LEVELS.length - 1) {
        setDirectionsLevel(prev => prev + 1);
        setFeedback(null);
        setCharacterMood('neutral');
      } else {
        setFeedback(null);
        setView('result');
      }
    }, 1500);
  };

  const handleMatch = (sp: string) => {
    if (!selectedAm || feedback) return;

    const correctSp = MATCHING_WORDS.find(w => w.am === selectedAm)?.sp;

    if (sp === correctSp) {
      setFeedback('correct');
      setCharacterMood('happy');
      setPoints(prev => prev + 1);
      setMatchedPairs(prev => [...prev, sp]);
      setSelectedAm(null);
      
      if (matchedPairs.length + 1 === MATCHING_WORDS.length) {
        setTimeout(() => {
          setView('result');
          setFeedback(null);
        }, 1500);
      } else {
        setTimeout(() => {
          setFeedback(null);
          setCharacterMood('neutral');
        }, 1000);
      }
    } else {
      setFeedback('wrong');
      setCharacterMood('thinking');
      setTimeout(() => {
        setFeedback(null);
        setCharacterMood('neutral');
        setSelectedAm(null);
      }, 1500);
    }
  };

  const reset = () => {
    setView('intro');
    setCurrentLevel(0);
    setDirectionsLevel(0);
    setPoints(0);
    setFeedback(null);
    setCharacterMood('neutral');
    setMatchedPairs([]);
    setSelectedAm(null);
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-slate-900 selection:bg-orange-200">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border-b-4 border-orange-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Navigation className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-orange-600 uppercase">¿CÓMO LLEGO?</h1>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Ինչպե՞ս հասնել թանգարան</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-amber-100 px-4 py-2 rounded-full border-2 border-amber-200">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-lg font-black text-amber-700">{points}</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-1 rounded-[40px] shadow-2xl">
                <div className="bg-white rounded-[38px] p-8 md:p-12 text-center space-y-8">
                  <div className="flex justify-center gap-4">
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-5xl shadow-inner">📸</div>
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-5xl shadow-inner">🚶‍♂️</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                      ՃԱՆԱՊԱՐՀ ԴԵՊԻ <br/> <span className="text-orange-500 italic">ԹԱՆԳԱՐԱՆ</span>
                    </h2>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                      Սովորիր իսպաներենով հարցնել ճանապարհը և օգնիր զբոսաշրջիկին հասնել թանգարան:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => setView('theory')}
                      className="bg-blue-500 text-white px-6 py-4 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200"
                    >
                      <School className="w-6 h-6" /> ՏԵՍՈՒԹՅՈՒՆ
                    </button>
                    <button 
                      onClick={() => setView('game1')}
                      className="bg-red-500 text-white px-6 py-4 rounded-2xl font-black text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-200"
                    >
                      <Play className="w-6 h-6" /> ՍԿՍԵԼ ԽԱՂԸ (2 ՓՈՒԼ)
                    </button>
                    <button 
                      onClick={() => setView('directionsGame')}
                      className="bg-green-500 text-white px-6 py-4 rounded-2xl font-black text-lg hover:bg-green-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-200"
                    >
                      <Compass className="w-6 h-6" /> ՈՒՂՂՈՒԹՅՈՒՆՆԵՐԻ ԽԱՂ
                    </button>
                  </div>
                </div>
              </div>

              {/* Useful Words */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {USEFUL_WORDS.map((word, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border-2 border-amber-100 shadow-sm text-center">
                    <p className="text-orange-600 font-black text-sm">{word.sp}</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">{word.am}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'theory' && (
            <motion.div 
              key="theory"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border-t-8 border-blue-500">
                <div className="flex items-center justify-between mb-8 border-b-2 border-amber-50 pb-4">
                  <h2 className="text-2xl font-black text-slate-800 uppercase italic">ՏԵՍՈՒԹՅՈՒՆ • ՈՒՂՂՈՒԹՅՈՒՆՆԵՐ</h2>
                  <button onClick={() => setView('directionsGame')} className="text-blue-500 font-black text-sm hover:underline">ԽԱՂԱԼ →</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {THEORY_DIRECTIONS.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-slate-50 p-6 rounded-3xl border-2 border-amber-50 hover:border-blue-200 transition-all"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-blue-600">{item.term}</h3>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.translation}</p>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-4">{item.description}</p>
                      <div className="bg-white p-3 rounded-xl border border-amber-100">
                        <p className="text-xs font-black text-slate-400 uppercase mb-1">Օրինակ:</p>
                        <p className="text-sm font-bold text-slate-700 italic">"{item.example}"</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={() => setView('intro')}
                    className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-black hover:bg-slate-900 transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" /> ՀԵՏ ԴԵՊԻ ԳԼԽԱՎՈՐ
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'directionsGame' && (
            <motion.div 
              key="directionsGame"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border-b-8 border-green-500 relative overflow-hidden">
                {/* Progress */}
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((directionsLevel + 1) / DIRECTIONS_GAME_LEVELS.length) * 100}%` }}
                    className="h-full bg-green-500"
                  />
                </div>

                <div className="flex flex-col items-center gap-12 pt-4">
                  {/* Character Reaction */}
                  <motion.div 
                    animate={
                      characterMood === 'happy' 
                        ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } 
                        : (characterMood === 'thinking' || characterMood === 'sad') 
                          ? { x: [0, -5, 5, -5, 5, 0] } 
                          : {}
                    }
                    className="text-6xl"
                  >
                    {characterMood === 'happy' ? '🏆' : characterMood === 'sad' ? '😢' : characterMood === 'thinking' ? '🧐' : '🗺️'}
                  </motion.div>

                  <div className="text-center space-y-4">
                    <div className="inline-block px-4 py-1 bg-green-100 rounded-full text-[10px] font-black text-green-600 uppercase tracking-widest">
                      ՈՒՂՂՈՒԹՅՈՒՆՆԵՐԻ ԽԱՂ • ՄԱԿԱՐԴԱԿ {directionsLevel + 1} / {DIRECTIONS_GAME_LEVELS.length}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-4xl">{DIRECTIONS_GAME_LEVELS[directionsLevel].icon}</span>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                        {DIRECTIONS_GAME_LEVELS[directionsLevel].question}
                      </h2>
                    </div>
                    <p className="text-green-600 font-bold italic">({DIRECTIONS_GAME_LEVELS[directionsLevel].scenario})</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {DIRECTIONS_GAME_LEVELS[directionsLevel].options.map((opt) => (
                      <motion.button
                        key={opt}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDirectionsAnswer(opt)}
                        className={`p-6 rounded-2xl font-black text-xl transition-all border-2 ${
                          feedback === 'correct' && opt === DIRECTIONS_GAME_LEVELS[directionsLevel].answer
                            ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-200'
                            : feedback === 'wrong' && opt === opt // Just to keep it simple
                              ? 'bg-red-50 border-red-100 text-red-600'
                              : 'bg-white border-amber-100 text-slate-700 hover:border-green-500 hover:text-green-600 shadow-sm'
                        }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>

                  {/* Visual Feedback (Directions Game) */}
                  <div className="h-12 flex items-center justify-center">
                    {feedback === 'correct' && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-green-600 font-black uppercase italic"
                      >
                        <CheckCircle2 className="w-6 h-6" /> ՃԻՇՏ Է! +1 ✨
                      </motion.div>
                    )}
                    {feedback === 'wrong' && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-red-600 font-black uppercase italic"
                      >
                        <AlertTriangle className="w-6 h-6" /> ՍԽԱԼ Է! 🧐
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {view === 'game1' && (
            <motion.div 
              key="game1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border-b-8 border-red-500 relative overflow-hidden">
                {/* Progress */}
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentLevel + 1) / GAME_LEVELS.length) * 100}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>

                <div className="flex flex-col items-center gap-12 pt-4">
                  {/* Character Reaction */}
                  <motion.div 
                    animate={
                      characterMood === 'happy' 
                        ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } 
                        : (characterMood === 'thinking' || characterMood === 'sad') 
                          ? { x: [0, -5, 5, -5, 5, 0] } 
                          : {}
                    }
                    className="text-6xl"
                  >
                    {characterMood === 'happy' ? '🤩' : characterMood === 'sad' ? '😢' : characterMood === 'thinking' ? '🤔' : '🧒'}
                  </motion.div>

                  <div className="text-center space-y-4">
                    <div className="inline-block px-4 py-1 bg-amber-100 rounded-full text-[10px] font-black text-amber-600 uppercase tracking-widest">
                      ՓՈՒԼ 1 • ՄԱԿԱՐԴԱԿ {currentLevel + 1} / {GAME_LEVELS.length}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
                      {GAME_LEVELS[currentLevel].question}
                    </h2>
                    <p className="text-orange-500 font-bold italic">({GAME_LEVELS[currentLevel].hint})</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {GAME_LEVELS[currentLevel].options.map((opt) => (
                      <motion.button
                        key={opt}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(opt)}
                        className={`p-6 rounded-2xl font-black text-xl transition-all border-2 ${
                          feedback === 'correct' && opt === GAME_LEVELS[currentLevel].answer
                            ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-200'
                            : feedback === 'wrong' && opt === opt // Just to keep it simple
                              ? 'bg-red-50 border-red-100 text-red-600'
                              : 'bg-white border-amber-100 text-slate-700 hover:border-orange-500 hover:text-orange-600 shadow-sm'
                        }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>

                  {/* Visual Feedback (Game 1) */}
                  <div className="h-12 flex items-center justify-center">
                    {feedback === 'correct' && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-green-600 font-black uppercase italic"
                      >
                        <CheckCircle2 className="w-6 h-6" /> ՃԻՇՏ Է! +1 ✨
                      </motion.div>
                    )}
                    {feedback === 'wrong' && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-red-600 font-black uppercase italic"
                      >
                        <AlertTriangle className="w-6 h-6" /> ՍԽԱԼ Է! 🧐
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'game2' && (
            <motion.div 
              key="game2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border-b-8 border-orange-500 relative overflow-hidden">
                <div className="flex flex-col items-center gap-8">
                  {/* Character Reaction */}
                  <motion.div 
                    animate={characterMood === 'happy' ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : characterMood === 'thinking' ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                    className="text-6xl"
                  >
                    {characterMood === 'happy' ? '🌟' : characterMood === 'thinking' ? '🧐' : '🎒'}
                  </motion.div>

                  <div className="text-center space-y-2">
                    <div className="inline-block px-4 py-1 bg-amber-100 rounded-full text-[10px] font-black text-amber-600 uppercase tracking-widest">
                      ՓՈՒԼ 2 • ԲԱՌԵՐԻ ՀԱՄԱՊԱՏԱՍԽԱՆՈՒՄ
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">Գտիր ճիշտ թարգմանությունը</h2>
                    <p className="text-slate-400 text-sm">Ընտրիր հայերեն բառը, ապա դրա իսպաներեն թարգմանությունը:</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 w-full">
                    {/* Armenian Column */}
                    <div className="space-y-3">
                      <p className="text-center font-black text-xs text-slate-400 uppercase tracking-widest mb-4">ՀԱՅԵՐԵՆ</p>
                      {MATCHING_WORDS.map((word) => (
                        <button
                          key={word.am}
                          disabled={matchedPairs.includes(word.sp)}
                          onClick={() => setSelectedAm(word.am)}
                          className={`w-full p-4 rounded-xl font-bold text-sm transition-all border-2 text-left flex justify-between items-center ${
                            matchedPairs.includes(word.sp)
                              ? 'bg-green-50 border-green-200 text-green-600 opacity-50'
                              : selectedAm === word.am
                                ? 'bg-orange-500 border-orange-400 text-white shadow-md'
                                : 'bg-white border-amber-100 text-slate-700 hover:border-orange-300'
                          }`}
                        >
                          {word.am}
                          {matchedPairs.includes(word.sp) && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>

                    {/* Spanish Column */}
                    <div className="space-y-3">
                      <p className="text-center font-black text-xs text-slate-400 uppercase tracking-widest mb-4">ESPAÑOL</p>
                      {shuffledSp.map((sp) => (
                        <button
                          key={sp}
                          disabled={matchedPairs.includes(sp) || !selectedAm}
                          onClick={() => handleMatch(sp)}
                          className={`w-full p-4 rounded-xl font-bold text-sm transition-all border-2 text-left flex justify-between items-center ${
                            matchedPairs.includes(sp)
                              ? 'bg-green-50 border-green-200 text-green-600 opacity-50'
                              : !selectedAm
                                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                                : 'bg-white border-amber-100 text-slate-700 hover:border-orange-300'
                          }`}
                        >
                          {sp}
                          {matchedPairs.includes(sp) && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Feedback (Game 2) */}
                  <div className="h-12 flex items-center justify-center">
                    {feedback === 'correct' && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-green-600 font-black uppercase italic"
                      >
                        <CheckCircle2 className="w-6 h-6" /> ՃԻՇՏ Է! +1 ✨
                      </motion.div>
                    )}
                    {feedback === 'wrong' && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-red-600 font-black uppercase italic"
                      >
                        <AlertTriangle className="w-6 h-6" /> ՓՈՐՁԻՐ ՆՈՐԻՑ! 🧐
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12"
            >
              <div className="relative inline-block">
                <div className="w-48 h-48 bg-yellow-400 rounded-[40px] flex items-center justify-center shadow-2xl rotate-6 border-8 border-white">
                  <Trophy className="w-24 h-24 text-orange-600 fill-orange-200" />
                </div>
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shadow-lg border-4 border-white">
                  {points}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">ՀՐԱՇԱԼԻ Է!</h2>
                  <p className="text-xl font-bold text-slate-500 max-w-md mx-auto">
                    Դուք հաջողությամբ հասաք թանգարան և հավաքեցիք {points} միավոր:
                  </p>
              </div>

              <button 
                onClick={reset}
                className="bg-orange-500 text-white px-16 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-4 mx-auto border-b-8 border-orange-700"
              >
                <RotateCcw className="w-8 h-8" /> ԿՐԿՆԵԼ
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-16 py-12 text-center border-t border-amber-200">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-full border-2 border-amber-100 shadow-sm">
            <Compass className="w-5 h-5 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600">
              SPANISH LEARNING • MUSEUM QUEST
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
