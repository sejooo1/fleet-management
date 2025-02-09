export const login = async (username, password) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ username, role: data.role }));
      return { username, role: data.role };
    }
    return null;
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  
  export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };  