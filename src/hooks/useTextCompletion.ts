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
import { OpenAIError } from 'src/types/global'

const useTextCompletion = (
  question: string,
  clearTextarea: () => void,
  showScrollToBottomBtn: () => void
) => {
  const [loading, setLoading] = useState(false)
  const setErrorAlertState = useSetRecoilState(errorAlertState)
  const currConversationId = useRecoilValue(currConversationIdState)
  const currConversation = useLiveQuery(
    () => db.text.get(currConversationId),
    [currConversationId]
  )
  const setTempMessage = useSetRecoilState(tempMessageState)

  const createTextCompletion = async () => {
    if (loading) return

    setLoading(true)
    const tempMessage = generateEmptyMessage(question)
    setTempMessage(tempMessage)
    clearTextarea()

    try {
      const {
        data: { id, choices }
      } = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: question
      })

      const newMessage = produce(tempMessage, (draft) => {
        draft.answer_created_at = +new Date()
        draft.answer = choices[0].text || ''
        draft.message_id = id
      })

      await db.text.update(currConversationId, {
        messages: currConversation
          ? [...currConversation.messages, newMessage]
          : [newMessage]
      })

      showScrollToBottomBtn()
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

  return { loading, createTextCompletion }
}

export default useTextCompletion
