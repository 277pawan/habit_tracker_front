// API Client (function-based)

const BASE_URL = "http://localhost:5000/api";

// token helpers
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const setToken = (token: string) => {
  if (typeof window !== "undefined") localStorage.setItem("token", token);
};

const clearToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem("token");
};

// base request
const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  const response = await fetch(url, { ...options, headers });

  let json;
  try {
    json = await response.json();
  } catch {
    json = { message: "Request failed" };
  }

  if (!response.ok) {
    throw new Error(json.message || "Request failed");
  }

  return json;
};

// API object
export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: async (data: { email: string; password: string }) => {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.token) setToken(res.token);
    return res;
  },

  logout: () => clearToken(),
  getMe: () => request("/auth/me"),

  // Identity
  getIdentities: () => request("/identity"),
  selectIdentity: (data: {
    primaryIdentity: string;
    secondaryIdentity?: string;
  }) =>
    request("/identity/select", { method: "POST", body: JSON.stringify(data) }),
  getUserIdentity: () => request("/identity/user"),

  // Habits
  createHabit: (data: any) =>
    request("/habits", { method: "POST", body: JSON.stringify(data) }),

  getHabits: () => request("/habits"),
  getHabit: (id: string) => request(`/habits/${id}`),

  updateHabit: (id: string, data: any) =>
    request(`/habits/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteHabit: (id: string) => request(`/habits/${id}`, { method: "DELETE" }),

  completeHabit: (id: string) =>
    request(`/habits/${id}/complete`, { method: "POST" }),

  uncompleteHabit: (id: string) =>
    request(`/habits/${id}/uncomplete`, { method: "POST" }),

  getHabitAnalytics: () => request("/habits/analytics"),

  // Boosts
  sendBoost: (identityId: string) =>
    request("/boost/send", {
      method: "POST",
      body: JSON.stringify({ identityId }),
    }),

  getMyBoosts: () => request("/boost/me"),

  // Reports
  getWeeklyReport: () => request("/report/weekly"),
  getOverview: () => request("/report/overview"),

  // Reflections
  createReflection: (data: { content: string; mood?: string }) =>
    request("/reflection", { method: "POST", body: JSON.stringify(data) }),

  getReflections: () => request("/reflection"),
};
