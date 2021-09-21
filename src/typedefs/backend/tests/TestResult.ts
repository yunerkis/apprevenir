import { TimestampedObject } from "../common/TimestampedObject";
import { User } from "../userData/User";
import { Test } from "./Test";
import { TestAnswer } from "./TestAnswer";

export enum TestAssessmentSeverity {
  Severe = 'Severo',
  Moderate = 'Moderado',
  Minor = 'Leve',
  AbsenceAnxiety = 'Ausencia de Ansiedad',
  AbsenceDepression = 'Ausencia de depresión',
  PresenseAnxiety = 'Presencia de Ansiedad',
  PresenceDepression = 'Presencia de depresión'
}

export interface TestResult extends TimestampedObject {
  id: number,
  user_id: number,
  test_id: number,
  information_level_id: number,
  addiction_id: number | null,
  zone: any,
  university: any,
  company: any,
  institution: any,
  city: string,
  date: string,
  time: string,
  total: number,
  testName: string,
  resultLevel: TestAssessmentSeverity,
  user: User,
  answers: TestAnswer[],
  questions: [],
  addiction: string | null,
  test: Test,
  information_level: {
    id: number,
    information_level_id: number | null,
    lang: "es",
    name: string
  } & TimestampedObject
}