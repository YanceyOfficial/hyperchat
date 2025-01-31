import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useDB } from 'src/hooks'
import { settingsState } from 'src/stores/settings'
import { Companies, ThemeMode } from 'src/types/global'
import { Settings } from 'src/types/settings'
import { v4 } from 'uuid'
import useAppData from './useAppData'

const useSettings = () => {
  const { transformFilenameToSrc } = useAppData()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useRecoilState(settingsState)
  const { updateOneById, insertOne, toArray } = useDB('settings')

  const initialSettings = async () => {
    const defaultData: Settings = {
      settingsId: v4(),
      company: Companies.OpenAI,
      openaiSecretKey: '',
      openaiOrganizationId: '',
      openaiAuthorName: '',
      azureSecretKey: '',
      azureEndPoint: '',
      azureDeploymentNameChatCompletion: '',
      azureDeploymentNameCompletion: '',
      azureDeploymentNameTextToImage: '',
      azureDeploymentNameEmbedding: '',
      azureDeploymentNameAudioGeneration: '',
      themeMode: ThemeMode.system,
      assistantAvatarFilename: '',
      azureSpeechSecretKey: '',
      azureSpeechRegion: ''
    }

    await insertOne(defaultData)
    setSettings(defaultData)
  }

  const updateSettings = async (newSettings: Settings) => {
    if (!settings) return

    await updateOneById(settings.settingsId, newSettings)

    if (
      !settings.assistantAvatarFilename.endsWith(
        newSettings.assistantAvatarFilename
      )
    ) {
      const src = await transformFilenameToSrc(
        newSettings.assistantAvatarFilename
      )
      if (src) {
        setSettings({ ...newSettings, assistantAvatarFilename: src })
      }
    } else {
      setSettings(newSettings)
    }

    enqueueSnackbar('Settings updated successfully.', { variant: 'success' })
  }

  const getSettings = async () => {
    setLoading(true)
    try {
      const settings = (await toArray()) as Settings[]
      const currSettings = settings[0]

      if (!currSettings) {
        initialSettings()
        return
      }

      if (currSettings.assistantAvatarFilename) {
        try {
          const src = await transformFilenameToSrc(
            currSettings.assistantAvatarFilename
          )

          if (src) {
            setSettings({ ...currSettings, assistantAvatarFilename: src })
          }
        } catch {
          // if transform is error
          setSettings(currSettings)
        }
      } else {
        setSettings(currSettings)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!settings) {
      getSettings()
    }
  }, [settings])

  return { settings, loading, initialSettings, updateSettings }
}

export default useSettings
