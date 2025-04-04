// Helper function to make API requests with proper headers and error handling
export async function apiRequest(method, url, data = undefined) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['x-auth-token'] = token;
  }
  
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });
    
    if (!response.ok) {
      // Try to parse error message from response
      const errorData = await response.json().catch(() => null);
      
      // Create error with status code and message
      const error = new Error(
        errorData?.message || `Request failed with status ${response.status}`
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    
    return response;
  } catch (error) {
    // Re-throw for handling in components
    throw error;
  }
}

export default apiRequest;
