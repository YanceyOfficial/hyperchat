import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useAtomValue } from 'jotai'
import { Ollama } from 'ollama'
import { OpenAI } from 'openai'
import { settingsAtom } from 'src/stores/global'

const useClients = () => {
  const settings = useAtomValue(settingsAtom)

  const openAiClient = new OpenAI({
    apiKey: settings?.openaiSecretKey || '',
    organization: settings?.openaiOrganizationId,
    dangerouslyAllowBrowser: true
  })

  const googleClient = new GoogleGenerativeAI(
    settings?.googleSecretKey || 'DEFAULT'
  )

  const anthropicClient = new Anthropic({
    apiKey: settings?.anthropicSecretKey || 'DEFAULT',
    dangerouslyAllowBrowser: true
  })

  const ollamaClient = new Ollama({ host: settings.ollamaUrl || '' })

  return {
    openAiClient,
    googleClient,
    anthropicClient,
    ollamaClient
  }
}

export default useClients
