import { FC } from 'react'
import {
  LinearHomeIcon,
  BoldMessageIcon,
  LinearChatIcon,
  LinearSearchnormalIcon,
  LinearCalendarIcon,
  LinearSettingIcon
} from 'src/components/Svgs'

const items = [
  {
    icon: <LinearHomeIcon />
  },
  {
    icon: <BoldMessageIcon />
  },
  {
    icon: <LinearChatIcon />
  },
  {
    icon: <LinearSearchnormalIcon />
  },
  {
    icon: <LinearCalendarIcon />
  }
]

const Siderbar: FC = () => {
  return (
    <section className="w-22 h-full shadow-sidebar flex-1 flex flex-col items-center p-4 justify-between">
      <div className="flex flex-col items-center">
        <div className="rounded-14 w-14 h-14 bg-main-purple flex items-center justify-center text-white font-medium">
          Q
        </div>
        <section className="mt-12 cursor-pointer">
          {items.map((item) => (
            <div className="mb-8">{item.icon}</div>
          ))}
        </section>
      </div>
      <LinearSettingIcon />
    </section>
  )
}

export default Siderbar
