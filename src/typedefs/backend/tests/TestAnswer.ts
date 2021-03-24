import { TimestampedObject } from "../common/TimestampedObject";
import { TestQuestion } from "./TestQuestion";

export interface TestAnswer extends TimestampedObject {
  id: number,
  question_id: number,
  answer_id: number | null,
  lang: "es",
  answer: string,
  value: number,
  pivot: { result_id: number, answer_id: number },
  question: TestQuestion
}