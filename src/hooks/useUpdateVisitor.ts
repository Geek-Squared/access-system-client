// hooks/useUpdateUser.js
import useSWR, { mutate } from 'swr'
import axios from 'axios'
import { apiUrl } from '../utils/apiUrl'

const useUpdateVisitor = (userId: string) => {
  const { data, error } = useSWR(userId ? `${apiUrl}/visitor/${userId}` : null, fetcher)

  // Fetcher function for SWR
  async function fetcher(url: string) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return response.data
  }

  // Update user function
  const updateUser = async (updatedData: any) => {
    try {
      // Perform the PATCH request to update user data
      const response = await axios.patch(
        `${apiUrl}/visitor/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      )
      
      // Update SWR cache for the user
      mutate(`${apiUrl}/visitor/${userId}`, { ...data, ...updatedData }, false)

      // Optionally revalidate data after mutation to refresh SWR cache with fresh data
      await mutate(`${apiUrl}/visitor/${userId}`)
      
      return response.data
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  }

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    updateUser,
  }
}

export default useUpdateVisitor
