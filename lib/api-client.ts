// Função helper para fazer requests autenticados
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token")
  
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }
  
    const response = await fetch(url, {
      ...options,
      headers,
    })
  
    // Se o token expirou, redirecionar para login
    if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 401 && errorData.message === 'Token inválido ou expirado') {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("role")
      window.location.href = "/login"
      throw new Error("Token expirado")
    }
}
  
    return response
  }
  
  // Função para fazer requests GET autenticados
  export async function apiGet(endpoint: string) {
    const response = await authenticatedFetch(endpoint)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }
  
  // Função para fazer requests POST autenticados
  export async function apiPost(endpoint: string, data: any) {
    const response = await authenticatedFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }
  
  // Função para fazer requests PUT/PATCH autenticados
  export async function apiPut(endpoint: string, data: any) {
    const response = await authenticatedFetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }
  
  // Função para fazer requests DELETE autenticados
  export async function apiDelete(endpoint: string) {
    const response = await authenticatedFetch(endpoint, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }
  