import { Configuration } from 'src/types/conversation'
import { Companies } from 'src/types/global'

export const models = [
  { modelName: 'llama3.3', maxInput: 128000, maxOutput: 8192 },
  { modelName: 'llama3.2', maxInput: 128000, maxOutput: 4096 },
]

export const configuration: Configuration = {
  company: Companies.Llama,
  model: 'llama3.3',
  systemMessage: 'You are an AI assistant that helps people find information.',
  maxResponse: 8192,
  temperature: 1,
  topP: 0.95,
  stop: [],
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemMessageTokensCount: 11
}
