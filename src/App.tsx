/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  GraduationCap, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  Volume2,
  Trophy,
  Star
} from 'lucide-react';
import { GRADE_3_WORDS } from './constants';
import { Word, AppMode, QuizQuestion } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentWord = GRADE_3_WORDS[currentIndex];

  // Initialize Quiz
  const startQuiz = () => {
    const shuffled = [...GRADE_3_WORDS].sort(() => 0.5 - Math.random());
    const questions = shuffled.slice(0, 10).map(word => {
      const others = GRADE_3_WORDS.filter(w => w.id !== word.id);
      const distractors = others.sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.translation);
      const options = [word.translation, ...distractors].sort(() => 0.5 - Math.random());
      return { word, options, correctAnswer: word.translation };
    });
    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setMode('quiz');
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleNextWord = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % GRADE_3_WORDS.length);
  };

  const handlePrevWord = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + GRADE_3_WORDS.length) % GRADE_3_WORDS.length);
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const correct = option === quizQuestions[currentQuizIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-2xl flex flex-col items-center mb-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="p-3 bg-orange-400 rounded-2xl shadow-lg">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-orange-600 tracking-tight">三年级单词宝</h1>
        </motion.div>
        <p className="text-slate-500 font-medium">每天进步一点点，快乐学英语</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm mb-8">
        <button 
          onClick={() => setMode('learn')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-semibold ${mode === 'learn' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-white/50'}`}
        >
          <BookOpen size={18} />
          <span>学习模式</span>
        </button>
        <button 
          onClick={startQuiz}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-semibold ${mode === 'quiz' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-white/50'}`}
        >
          <Trophy size={18} />
          <span>闯关测试</span>
        </button>
        <button 
          onClick={() => setMode('list')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-semibold ${mode === 'list' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-white/50'}`}
        >
          <List size={18} />
          <span>单词列表</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {mode === 'learn' && (
            <motion.div 
              key="learn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex flex-col items-center"
            >
              {/* Progress Bar */}
              <div className="w-full mb-6">
                <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                  <span>学习进度</span>
                  <span>{currentIndex + 1} / {GRADE_3_WORDS.length}</span>
                </div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-white/20 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / GRADE_3_WORDS.length) * 100}%` }}
                    className="h-full bg-orange-400"
                  />
                </div>
              </div>

              {/* Flashcard */}
              <div className="relative w-full aspect-[4/3] max-w-md perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div 
                  className="w-full h-full transition-all duration-500 preserve-3d relative"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 border-b-8 border-orange-100 backface-hidden">
                    <div className="absolute top-6 right-6 text-orange-200">
                      <Star size={40} fill="currentColor" />
                    </div>
                    <h2 className="text-6xl font-bold text-orange-600 mb-4">{currentWord.word}</h2>
                    <p className="text-xl text-slate-400 font-mono mb-8">{currentWord.phonetic}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); speak(currentWord.word); }}
                      className="p-4 bg-orange-50 rounded-full text-orange-500 hover:bg-orange-100 transition-colors"
                    >
                      <Volume2 size={32} />
                    </button>
                    <p className="absolute bottom-6 text-slate-300 text-sm font-bold uppercase tracking-widest">点击翻转查看释义</p>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 w-full h-full bg-orange-500 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 border-b-8 border-orange-700 backface-hidden rotate-y-180">
                    <h2 className="text-5xl font-bold text-white mb-6">{currentWord.translation}</h2>
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 w-full text-white">
                      <p className="text-lg font-medium mb-2 opacity-90 italic">"{currentWord.example}"</p>
                      <p className="text-base opacity-80">{currentWord.exampleTranslation}</p>
                    </div>
                    <p className="absolute bottom-6 text-white/50 text-sm font-bold uppercase tracking-widest">点击翻转回到正面</p>
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="flex gap-6 mt-10">
                <button 
                  onClick={handlePrevWord}
                  className="p-4 bg-white rounded-2xl text-slate-600 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
                <button 
                  onClick={() => speak(currentWord.word)}
                  className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 hover:-translate-y-1 transition-all flex items-center gap-2"
                >
                  <Volume2 size={24} />
                  <span>朗读单词</span>
                </button>
                <button 
                  onClick={handleNextWord}
                  className="p-4 bg-white rounded-2xl text-slate-600 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <ChevronRight size={28} />
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col items-center"
            >
              {!quizFinished ? (
                <div className="w-full max-w-md">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-slate-600">问题 {currentQuizIndex + 1} / 10</span>
                    <span className="px-4 py-1 bg-orange-100 text-orange-600 rounded-full font-bold">得分: {score}</span>
                  </div>
                  
                  <div className="bg-white p-10 rounded-3xl shadow-xl border-b-8 border-orange-100 mb-8 text-center">
                    <h3 className="text-5xl font-bold text-orange-600 mb-4">{quizQuestions[currentQuizIndex].word.word}</h3>
                    <button 
                      onClick={() => speak(quizQuestions[currentQuizIndex].word.word)}
                      className="text-orange-400 hover:text-orange-600 transition-colors"
                    >
                      <Volume2 size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {quizQuestions[currentQuizIndex].options.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      const isCorrectAnswer = option === quizQuestions[currentQuizIndex].correctAnswer;
                      
                      let buttonClass = "w-full p-5 rounded-2xl text-xl font-bold transition-all border-2 text-left flex justify-between items-center ";
                      
                      if (!selectedOption) {
                        buttonClass += "bg-white border-slate-100 text-slate-700 hover:border-orange-400 hover:bg-orange-50";
                      } else if (isCorrectAnswer) {
                        buttonClass += "bg-emerald-50 border-emerald-500 text-emerald-700";
                      } else if (isSelected && !isCorrectAnswer) {
                        buttonClass += "bg-rose-50 border-rose-500 text-rose-700";
                      } else {
                        buttonClass += "bg-white border-slate-100 text-slate-300";
                      }

                      return (
                        <motion.button
                          key={idx}
                          whileHover={!selectedOption ? { scale: 1.02 } : {}}
                          whileTap={!selectedOption ? { scale: 0.98 } : {}}
                          onClick={() => handleQuizAnswer(option)}
                          className={buttonClass}
                        >
                          <span>{option}</span>
                          {selectedOption && isCorrectAnswer && <CheckCircle2 className="text-emerald-500" />}
                          {selectedOption && isSelected && !isCorrectAnswer && <XCircle className="text-rose-500" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md w-full border-b-8 border-orange-100"
                >
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy size={48} className="text-orange-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">测试完成!</h2>
                  <p className="text-slate-500 mb-8">你真棒！继续加油哦！</p>
                  
                  <div className="text-6xl font-black text-orange-500 mb-10">
                    {score * 10}<span className="text-2xl ml-2 text-slate-400">分</span>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={startQuiz}
                      className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={20} />
                      <span>再测一次</span>
                    </button>
                    <button 
                      onClick={() => setMode('learn')}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      回到学习
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {mode === 'list' && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border-b-8 border-orange-100"
            >
              <div className="p-6 bg-orange-500 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold">单词表 ({GRADE_3_WORDS.length})</h3>
                <div className="text-sm opacity-80 font-medium">三年级必背</div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {GRADE_3_WORDS.map((word, idx) => (
                  <div 
                    key={word.id}
                    className={`p-5 flex items-center justify-between border-b border-slate-50 hover:bg-orange-50 transition-colors group ${idx === currentIndex ? 'bg-orange-50/50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-slate-300 font-bold w-6">{idx + 1}</span>
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{word.word}</h4>
                        <p className="text-sm text-slate-400 font-mono">{word.phonetic}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-medium text-slate-600">{word.translation}</span>
                      <button 
                        onClick={() => speak(word.word)}
                        className="p-2 text-slate-300 hover:text-orange-500 transition-colors"
                      >
                        <Volume2 size={20} />
                      </button>
                      <button 
                        onClick={() => { setCurrentIndex(idx); setMode('learn'); }}
                        className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-sm font-bold hover:bg-orange-500 hover:text-white transition-all"
                      >
                        去学习
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-12 text-slate-400 text-sm font-medium flex items-center gap-2">
        <span>Made with</span>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Star size={16} fill="#fb923c" className="text-orange-400" />
        </motion.div>
        <span>for Grade 3 Students</span>
      </footer>
    </div>
  );
}
