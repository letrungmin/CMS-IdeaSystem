export const getRoleFromToken = (): string | null => {
  if (typeof window === "undefined") return null; // SSR safety check
  
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (!token) return null;

  try {
    // Extract JWT payload (second part)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode Base64 to JSON string
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);

    // Extract role based on common backend structures (roles or authorities)
    const role = payload.roles?.[0] || payload.role || payload.authorities?.[0]?.authority || payload.authorities?.[0];
    
    return role || null;
  } catch (error) {
    console.error("JWT decoding error:", error);
    return null;
  }
};