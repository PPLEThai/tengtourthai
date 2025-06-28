import { ref } from 'vue'

interface GraphQLResponse {
  data?: {
    pages?: {
      singleByPath?: {
        id: string
        content: string
      }
    }
  }
  errors?: any[]
}

interface UseGraphQLOptions {
  token?: string
  baseUrl?: string
}

export const useGraphQL = (options: UseGraphQLOptions = {}) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<any>(null)

  const config = useRuntimeConfig()
  
  const defaultToken = config.public.graphqlApiToken || options.token
  const defaultBaseUrl = config.public.graphqlApiUrl || options.baseUrl || 'https://km.pplethai.org/graphql'

  const fetchContent = async (fullname: string) => {
    loading.value = true
    error.value = null
    data.value = null

    try {
      const query = `
        query {
          pages {
            singleByPath(path: "คน/${fullname}/content-1", locale: "th") {
              id
              content
            }
          }
        }
      `

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (defaultToken) {
        headers['Authorization'] = `Bearer ${defaultToken}`
      }

      if (!defaultBaseUrl) {
        throw new Error('GraphQL API URL is not configured')
      }

      const response = await fetch(defaultBaseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: GraphQLResponse = await response.json()

      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
      }

      data.value = result.data?.pages?.singleByPath
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเรียก API'
      console.error('GraphQL API Error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    data,
    fetchContent
  }
} 