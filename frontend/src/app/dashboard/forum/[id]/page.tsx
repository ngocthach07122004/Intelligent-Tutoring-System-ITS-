import QuestionDetail from "@/components/widgets/forum/QuestionDetail";

interface Props {
  params: { id: string };
}

export default function QuestionPage({ params }: Props) {
  const questionId = parseInt(params.id);

  // Mock question
  const question = {
    id: questionId,
    title: `Sample Question ${questionId}`,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    author: "User",
    time: "2h ago",
    tags: ["react", "javascript"],
    views: 123,
    votes: 5,
  };

  // Mock answers
  const initialAnswers = [
    {
      id: 1,
      author: "Alice",
      content: "This is an example answer.",
      votes: 3,
      time: "1h ago",
    },
    {
      id: 2,
      author: "Bob",
      content: "Another answer with details.",
      votes: 1,
      time: "30m ago",
    },
  ];

  return <QuestionDetail question={question} initialAnswers={initialAnswers} />;
}
