import React, { useEffect, useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../services/api';

export default function MCQScreen({ route }) {
  const { taskType } = route.params;
  const [mcqs, setMcqs] = useState([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => { api.get(`/mcqs/${taskType._id}`).then((r) => setMcqs(r.data)); }, [taskType._id]);

  const current = mcqs[index];
  if (!current) return <View style={{ padding: 16 }}><Text>Loading...</Text></View>;

  const submit = async (selected_option) => {
    const { data } = await api.post('/mcq/attempt', { mcq_id: current._id, selected_option });
    setFeedback(data);
  };

  return <View style={{ padding: 16 }}>
    <Text>{current.question}</Text>
    {['A', 'B', 'C', 'D'].map((k) => <TouchableOpacity key={k} onPress={() => !feedback && submit(k)}><Text>{k}. {current[`option_${k.toLowerCase()}`]}</Text></TouchableOpacity>)}
    {feedback && <>
      <Text>{feedback.is_correct ? 'Correct' : `Wrong, correct: ${feedback.correct_option}`}</Text>
      <Text>{feedback.explanation}</Text>
      <Button title="Next" onPress={() => { setFeedback(null); setIndex((v) => v + 1); }} />
    </>}
  </View>;
}
