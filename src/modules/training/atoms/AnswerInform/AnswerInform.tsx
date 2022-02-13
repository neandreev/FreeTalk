import { useAppSelector } from "../../../../hooks";
import { selectCurrentQuestion } from "../../../../features/training/trainingSlice";

export const AnswerInform: React.FC = () => {
  const question = useAppSelector(selectCurrentQuestion);
  const informText = question.wasAnsweredCorrectly ? "Correct!" : "Incorrect!";

  return (
    <span>
      {informText}
    </span>
  )
};
