import { TimestampedObject } from "../common/TimestampedObject";
import { User } from "../userData/User";
import { Test } from "./Test";
import { TestAnswer } from "./TestAnswer";

export type TestAssessmentSeverity =
  | 'Severo' 
  | 'Moderado' 
  | 'Leve' 
  | 'Ausencia de Ansiedad' 
  | 'Ausencia de depresión' 
  | 'Presencia de Ansiedad' 
  | 'Presencia de depresión';

export interface TestResult extends TimestampedObject {
  id: number,
  user_id: number,
  test_id: number,
  information_level_id: number,
  addiction_id: number | null,
  date: string,
  time: string,
  total: number,
  testName: string,
  resultLevel: TestAssessmentSeverity,
  user: User,
  answers: TestAnswer[],
  addiction: string | null,
  test: Test,
  information_level: {
    id: number,
    information_level_id: number | null,
    lang: "es",
    name: string
  } & TimestampedObject
}