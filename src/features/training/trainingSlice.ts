import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type {RootState} from "../../store/store";
import { IQuestion } from '../../interfaces/question';
import {ITrainingWord} from "../../interfaces/trainingWord";

interface ITrainingSlice {
  questions: IQuestion[];
  trainingWords: ITrainingWord[],
  currentQuestionId: number;
  isCompleted: boolean;
  correctAnswers: number,
  completedQuestions: number,
}

const initialState: ITrainingSlice = {
  questions: [],
  trainingWords: [],
  currentQuestionId: 0,
  isCompleted: false,
  correctAnswers: 0,
  completedQuestions: 0,
}

export const trainingSlice = createSlice({
  name: 'words',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<IQuestion[]>) => {
      state.questions = action.payload;
    },
    setTrainingWords: (state, action: PayloadAction<ITrainingWord[]>) => {
      state.trainingWords = action.payload;
    },
    answerQuestion: (state, action: PayloadAction<{ wordId: string, isAnsweredCorrectly: boolean }>) => {
      const question = state.questions[state.currentQuestionId];
      const { isAnsweredCorrectly } = action.payload;

      question.wasAnswered = true;
      if (isAnsweredCorrectly) {
        state.correctAnswers += 1;
      }
      question.wasAnsweredCorrectly = isAnsweredCorrectly;
    },
    nextQuestion: (state) => {
      state.completedQuestions += 1;
      if (state.currentQuestionId + 1 === 10) {
        state.isCompleted = true;
      } else {
        state.currentQuestionId += 1;
      }
    }
  },
});

export const { setTrainingWords ,setQuestions, answerQuestion, nextQuestion } = trainingSlice.actions;

export const selectTraining = (state: RootState) => state.training;

export const selectCurrentQuestion = (state: RootState) => (
  state.training.questions[state.training.currentQuestionId]
);

export const trainingReducer = trainingSlice.reducer;