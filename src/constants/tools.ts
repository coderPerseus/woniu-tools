import { Box, Brain, Code2, Gamepad2, Image as ImageIcon } from 'lucide-react';

export const iconMap = {
  ImageIcon,
  Brain,
  Code2,
  Gamepad2,
  Box,
} as const;

export const categoryIds = ['image-tools', 'ai-tools', 'dev-tools', 'fun-tools', 'other-tools'] as const;

export type CategoryId = (typeof categoryIds)[number];

export const categoryIcons: Record<CategoryId, keyof typeof iconMap> = {
  'image-tools': 'ImageIcon',
  'ai-tools': 'Brain',
  'dev-tools': 'Code2',
  'fun-tools': 'Gamepad2',
  'other-tools': 'Box',
};

export const toolKeys = {
  'image-tools': ['image-compress', 'format-converter', 'bg-remover', 'image-watermark', 'chrome-icon-generator'],
  'ai-tools': ['chatGPT', 'Gemini', 'claude', 'qwen', 'deepseek', 'kimi', 'minimax'],
  'dev-tools': ['vscode', 'claudeCode', 'codex', 'keyboard-logger'],
  'fun-tools': ['jsdate'],
  'other-tools': ['freeCodeCamp'],
} as const satisfies Record<CategoryId, readonly string[]>;

export type ToolKey = (typeof toolKeys)[CategoryId][number];

export const toolUrlMap: Partial<Record<ToolKey, string>> = {
  'image-compress': 'https://squoosh.app/',
  'format-converter': 'https://squoosh.app/',
  'bg-remover': 'https://www.remove.bg/',
  chatGPT: 'https://chatgpt.com/',
  Gemini: 'https://gemini.google.com/',
  claude: 'https://claude.ai/',
  qwen: 'https://tongyi.aliyun.com/qianwen/',
  deepseek: 'https://chat.deepseek.com/',
  kimi: 'https://kimi.moonshot.cn/',
  minimax: 'https://agent.minimax.io/',
  vscode: 'https://vscode.dev/',
  claudeCode: 'https://www.claude.com/product/claude-code',
  codex: 'https://developers.openai.com/codex/cli/',
  jsdate: 'https://jsdate.wtf/',
  freeCodeCamp: 'https://www.freecodecamp.org/',
};
