"use client";

import { useState, useEffect, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import type { WordList, AttemptData, PracticeState } from "@/lib/types";
import { NameEntry } from "./name-entry";
import { WordCard } from "./word-card";
import { PracticeComplete } from "./practice-complete";

interface PracticeSessionProps {
  wordList: WordList;
}

const MAX_ATTEMPTS = 3;

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

function checkMatch(spoken: string, target: string): boolean {
  const normalizedSpoken = normalizeText(spoken);
  const normalizedTarget = normalizeText(target);
  
  // Exact match
  if (normalizedSpoken === normalizedTarget) return true;
  
  // Check if target word is contained in spoken text
  if (normalizedSpoken.includes(normalizedTarget)) return true;
  
  // Check if spoken text is contained in target (for partial matches)
  if (normalizedTarget.includes(normalizedSpoken) && normalizedSpoken.length >= normalizedTarget.length * 0.7) return true;
  
  return false;
}

export function PracticeSession({ wordList }: PracticeSessionProps) {
  const [studentName, setStudentName] = useState<string | null>(null);
  const [state, setState] = useState<PracticeState>({
    currentWordIndex: 0,
    attempts: 0,
    results: [],
    isListening: false,
    showFeedback: false,
    feedbackType: null,
    spokenText: "",
  });
  const [isComplete, setIsComplete] = useState(false);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error: speechError,
  } = useSpeechRecognition();

  const currentWord = wordList.words[state.currentWordIndex];

  const moveToNextWord = useCallback((wasCorrect: boolean, spokenText: string) => {
    const newResult: AttemptData = {
      word_id: currentWord.id,
      word_text: currentWord.text,
      attempts: state.attempts + 1,
      correct: wasCorrect,
      spoken_text: spokenText,
    };

    const newResults = [...state.results, newResult];
    
    if (state.currentWordIndex >= wordList.words.length - 1) {
      setState(prev => ({ ...prev, results: newResults }));
      setTimeout(() => setIsComplete(true), 1500);
    } else {
      setTimeout(() => {
        setState({
          currentWordIndex: state.currentWordIndex + 1,
          attempts: 0,
          results: newResults,
          isListening: false,
          showFeedback: false,
          feedbackType: null,
          spokenText: "",
        });
        resetTranscript();
      }, 1500);
    }
  }, [currentWord, state.currentWordIndex, state.attempts, state.results, wordList.words.length, resetTranscript]);

  // Handle transcript changes
  useEffect(() => {
    if (transcript && !state.showFeedback) {
      const isMatch = checkMatch(transcript, currentWord.text);
      
      setState(prev => ({
        ...prev,
        spokenText: transcript,
      }));

      if (isMatch) {
        stopListening();
        setState(prev => ({
          ...prev,
          showFeedback: true,
          feedbackType: "correct",
          isListening: false,
        }));
        moveToNextWord(true, transcript);
      }
    }
  }, [transcript, currentWord?.text, state.showFeedback, stopListening, moveToNextWord]);

  // Handle when listening stops without a match
  useEffect(() => {
    if (!isListening && state.isListening && transcript && !state.showFeedback) {
      const isMatch = checkMatch(transcript, currentWord.text);
      
      if (!isMatch) {
        const newAttempts = state.attempts + 1;
        
        if (newAttempts >= MAX_ATTEMPTS) {
          setState(prev => ({
            ...prev,
            showFeedback: true,
            feedbackType: "incorrect",
            attempts: newAttempts,
            isListening: false,
          }));
          moveToNextWord(false, transcript);
        } else {
          setState(prev => ({
            ...prev,
            showFeedback: true,
            feedbackType: "tryAgain",
            attempts: newAttempts,
            isListening: false,
          }));
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              showFeedback: false,
              feedbackType: null,
            }));
            resetTranscript();
          }, 2000);
        }
      }
    }
  }, [isListening, state.isListening, transcript, state.showFeedback, state.attempts, currentWord?.text, moveToNextWord, resetTranscript]);

  // Sync listening state
  useEffect(() => {
    setState(prev => ({ ...prev, isListening }));
  }, [isListening]);

  const handleStartListening = () => {
    resetTranscript();
    setState(prev => ({ ...prev, showFeedback: false, feedbackType: null, spokenText: "" }));
    startListening();
  };

  const handleSkipWord = () => {
    stopListening();
    setState(prev => ({
      ...prev,
      showFeedback: true,
      feedbackType: "incorrect",
    }));
    moveToNextWord(false, state.spokenText || "(skipped)");
  };

  if (!studentName) {
    return (
      <NameEntry
        listTitle={wordList.title}
        onSubmit={setStudentName}
      />
    );
  }

  if (isComplete) {
    return (
      <PracticeComplete
        studentName={studentName}
        wordList={wordList}
        results={state.results}
      />
    );
  }

  return (
    <WordCard
      word={currentWord}
      wordIndex={state.currentWordIndex}
      totalWords={wordList.words.length}
      attempts={state.attempts}
      maxAttempts={MAX_ATTEMPTS}
      isListening={isListening}
      showFeedback={state.showFeedback}
      feedbackType={state.feedbackType}
      spokenText={state.spokenText}
      isSupported={isSupported}
      speechError={speechError}
      onStartListening={handleStartListening}
      onStopListening={stopListening}
      onSkipWord={handleSkipWord}
      studentName={studentName}
      listTitle={wordList.title}
    />
  );
}
