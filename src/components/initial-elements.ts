
export const initialNodes = [
  {
    id: 'system-1',
    type: 'system',
    position: { x: 250, y: 50 },
    data: {
      label: 'System Prompt',
      description: 'Defines AI behavior & personality',
      content: 'You are a helpful AI assistant.',
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
    id: 'output-1',
    type: 'output',
    position: { x: 250, y: 350 },
    data: {
      label: 'AI Response',
      description: 'Generate AI reply',
      outputName: 'aiResponse',
    },
  },
];

export const initialEdges = [
  {
    id: 'e1-2',
    source: 'system-1',
    target: 'input-1',
    animated: true,
  },
  {
    id: 'e2-3',
    source: 'input-1',
    target: 'output-1',
    animated: true,
  },
];
