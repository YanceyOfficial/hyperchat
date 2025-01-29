import { Message as OllamaMessage } from 'ollama'
import {
  ContentPart,
  ContentPartType,
  Message,
  TextPrompt
} from 'src/types/conversation'

export const transformToLlama = (
  prompt: ContentPart
): OllamaMessage['content'] => {
  const content = prompt.find(
    (item) => item.type === ContentPartType.TextPrompt
  ) as TextPrompt

  return content.text
}

export const transformContextToLlama = (messages: Message[]): OllamaMessage[] =>
  messages.map((message) => ({
    role: message.role,
    content: transformToLlama(message.content)
    // FIXME:
  })) as OllamaMessage[]
