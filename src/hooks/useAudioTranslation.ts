import { isAxiosError } from 'axios'
import { useLiveQuery } from 'dexie-react-hooks'
import produce from 'immer'
import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { db } from 'src/models/db'
import { openai } from 'src/openai'
import { generateEmptyMessage } from 'src/shared/utils'
import {
  currConversationIdState,
  tempMessageState
} from 'src/stores/conversation'
import { errorAlertState } from 'src/stores/global'
import { HashFile, OpenAIError } from 'src/types/global'
import { v4 } from 'uuid'

const useAudioTranslation = (
  question: string,
  clearTextarea: () => void,
  hashFile: HashFile | null
) => {
  const [loading, setLoading] = useState(false)
  const setErrorAlertState = useSetRecoilState(errorAlertState)
  const currConversationId = useRecoilValue(currConversationIdState)
  const currConversation = useLiveQuery(
    () => db.audio_translation.get(currConversationId),
    [currConversationId]
  )
  const setTempMessage = useSetRecoilState(tempMessageState)

  const createTranslation = async () => {
    if (loading) return
    if (!hashFile) return

    setLoading(true)
    const tempMessage = {
      ...generateEmptyMessage(question),
      file_name: hashFile.hashName
    }
    setTempMessage(tempMessage)
    clearTextarea()

    try {
      const transcription = await openai.createTranslation(
        hashFile.file,
        'whisper-1',
        question
      )

      const newMessage = produce(tempMessage, (draft) => {
        draft.answer_created_at = +new Date()
        draft.answer = transcription.data.text
        draft.message_id = v4()
      })

      await db.audio_translation.update(currConversationId, {
        messages: currConversation
          ? [...currConversation.messages, newMessage]
          : [newMessage]
      })
    } catch (error: unknown) {
      if (isAxiosError<OpenAIError, Record<string, unknown>>(error)) {
        setErrorAlertState({
          code: error.response?.status || 0,
          message: error.response?.data.error.message || ''
        })
      }
    } finally {
      setTempMessage(null)
      setLoading(false)
    }
  }

  return { loading, createTranslation }
}

export default useAudioTranslation