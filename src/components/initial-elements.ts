export const initialNodes = [
  {
    id: 'system-1',
    type: 'system',
    position: { x: 250, y: 50 },
    data: {
      label: 'AI Personality',
      description: 'Define AI behavior',
      content: 'You are a helpful AI assistant that provides clear and concise answers.',
    },
  },
  {
    id: 'input-1',
    type: 'input',
    position: { x: 250, y: 200 },
    data: {
      label: 'User Input',
      description: 'Process user messages',
      inputName: 'userMessage',
    },
  },
  {
    id: 'aimodel-1',
    type: 'aimodel',
    position: { x: 250, y: 350 },
    data: {
      label: 'AI Processor',
      description: 'Process with AI',
      instructions: 'Provide a helpful and concise response to the user\'s question.',
      provider: 'OpenAI',
      model: 'gpt-4o-mini',
      temperature: '0.7',
      maxTokens: '1000',
    },
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 250, y: 500 },
    data: {
      label: 'AI Response',
      description: 'Return the result',
      outputName: 'aiResponse',
    },
  },
];

export const initialEdges = [
  {
    id: 'e1',
    source: 'system-1',
    target: 'aimodel-1',
    animated: true,
  },
  {
    id: 'e2',
    source: 'input-1',
    target: 'aimodel-1',
    animated: true,
  },
  {
    id: 'e3',
    source: 'aimodel-1',
    target: 'output-1',
    animated: true,
  },
];
