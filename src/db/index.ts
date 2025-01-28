import Dexie, { Table } from 'dexie'
import { configuration as anthropicConfiguration } from 'src/configurations/anthropic'
import { configuration as googleConfiguration } from 'src/configurations/google'
import { configuration as llamaConfiguration } from 'src/configurations/llama'
import { configuration as openAiConfiguration } from 'src/configurations/openAI'
import { Configuration, Conversation } from 'src/types/conversation'
import { Companies, ThemeMode } from 'src/types/global'
import { Settings } from 'src/types/settings'
import { v4 } from 'uuid'

export class HyperChatDB extends Dexie {
  conversations!: Table<Conversation>
  configurations!: Table<Configuration>
  settings!: Table<Settings>

  constructor() {
    super('hyperchat')
    this.version(1).stores({
      conversations:
        '&id, summary, fileName, company, createdAt, updatedAt, *messages',
      configurations:
        '&company, model, systemMessage, maxResponse, temperature, topP, *stop, frequencyPenalty, presencePenalty, systemMessageTokensCount',
      settings:
        '&id, company, openaiSecretKey, openaiOrganizationId, openaiAuthorName, geminiSecretKey, anthropicSecretKey, ollamaUrl, themeMode, assistantAvatarFilename'
    })
  }
}
export const db = new HyperChatDB()

export async function init() {
  const configurations: Configuration[] = await db
    .table('configurations')
    .toArray()

  if (configurations.length === 0) {
    await db
      .table('configurations')
      .bulkAdd([
        anthropicConfiguration,
        googleConfiguration,
        openAiConfiguration,
        llamaConfiguration
      ])
  }

  const settings: Settings[] = await db.table('settings').toArray()
  if (settings.length === 0) {
    await db.table('settings').add({
      id: v4(),
      company: Companies.OpenAI,
      openaiSecretKey: '',
      openaiOrganizationId: '',
      openaiAuthorName: '',
      googleSecretKey: '',
      anthropicSecretKey: '',
      ollamaUrl: '',
      themeMode: ThemeMode.system,
      assistantAvatarFilename: ''
    })
  }
}
