import { TimestampedObject } from "../common/TimestampedObject";

export interface TestQuestion extends TimestampedObject {
  id: number,
  test_id: number,
  question_id: number | null,
  lang: "es",
  order: number,
  question: string
}