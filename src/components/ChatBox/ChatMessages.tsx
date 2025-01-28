import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { FC, memo, useEffect, useMemo, useRef } from 'react'
import NoDataIllustration from 'src/assets/illustrations/no-data.svg'
import { conversationAtom } from 'src/stores/conversation'
import { loadingAtom } from 'src/stores/global'
import { Roles } from 'src/types/conversation'
import ChatBubble from './ChatBubble'
import MessageSpinner from './MessageSpinner'

const ChatMessages: FC = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const conversation = useAtomValue(conversationAtom)
  const loading = useAtomValue(loadingAtom)
  const hasMessages = useMemo(
    () => conversation && conversation.messages.length > 0,
    [conversation?.messages?.length]
  )

  const scrollToBottom = () => {
    if (!chatBoxRef.current) return
    const $el = chatBoxRef.current

    if ($el.scrollHeight > $el.scrollTop + $el.clientHeight + 24) {
      $el.scrollTo({
        top: $el.scrollHeight,
        left: 0
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [loading, conversation])

  return (
    <section
      className={classNames(
        'no-scrollbar relative h-[calc(100vh_-_8.25rem)] overflow-y-scroll p-6',
        { 'flex items-center justify-center': !hasMessages }
      )}
      ref={chatBoxRef}
    >
      {hasMessages ? (
        <>
          {conversation?.messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {loading &&
            conversation?.messages[conversation?.messages.length - 1].role !==
              Roles.Assistant && (
              <div className="mb-4">
                <MessageSpinner />
              </div>
            )}
        </>
      ) : (
        <img
          src={NoDataIllustration}
          alt="NoDataIllustration"
          className="h-96 w-96 dark:opacity-80"
        />
      )}
    </section>
  )
}

export default memo(ChatMessages)
