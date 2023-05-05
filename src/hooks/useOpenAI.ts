import { Configuration, OpenAIApi } from 'openai'
import { useSettings } from 'src/hooks'

class CustomFormData extends FormData {
  getHeaders() {
    return {}
  }
}

const useOpenAI = () => {
  const { settings } = useSettings()

  const configuration = new Configuration({
    apiKey: settings?.secret_key,
    formDataCtor: CustomFormData
  })

  const openai = new OpenAIApi(configuration)
  return openai
}

export default useOpenAI
