// Mock Authentication Service for DockNova
// Simulated JWT and in-memory/localStorage user registry

export const INITIAL_MOCK_USERS = [
  {
    id: 'usr_mgr_01',
    name: 'Capt. Vance Alexander',
    email: 'captain@docknova.com',
    role: 'manager',
    company: 'Port of Singapore Authority',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    passwordHash: 'Maritime2026!',
  },
  {
    id: 'usr_ops_02',
    name: 'Elena Rostova',
    email: 'operator@docknova.com',
    role: 'user',
    company: 'Maersk Line Operations',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    passwordHash: 'Maritime2026!',
  },
  {
    id: 'usr_adm_03',
    name: 'Marcus Drake',
    email: 'admin@docknova.com',
    role: 'admin',
    company: 'DockNova Systems Admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    passwordHash: 'Maritime2026!',
  },
];

const STORAGE_KEY_USERS = 'docknova_registered_users';

export const getMockUsers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_MOCK_USERS));
      return INITIAL_MOCK_USERS;
    }
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_USERS;
  }
};

export const generateMockJWT = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iss: 'docknova-auth-gateway',
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  );
  const signature = btoa(`sig_${user.id}_${Date.now()}`).slice(0, 32);
  return `${header}.${payload}.${signature}`;
};

export const authService = {
  async login(credentials) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getMockUsers();
    const cleanEmail = credentials.email.trim().toLowerCase();

    const matched = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === credentials.password
    );

    if (!matched) {
      if (credentials.password === 'Maritime2026!') {
        let role = 'manager';
        if (cleanEmail.includes('admin')) role = 'admin';
        else if (cleanEmail.includes('operator') || cleanEmail.includes('vessel') || cleanEmail.includes('user')) role = 'user';

        const fallbackUser = {
          id: `usr_${Date.now()}`,
          name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          email: cleanEmail,
          role,
          company: 'DockNova Maritime Alliance',
        };
        const token = generateMockJWT(fallbackUser);
        return { user: fallbackUser, token };
      }
      throw new Error('Invalid maritime credentials. Please check your email and password.');
    }

    const { passwordHash, ...userWithoutPassword } = matched;
    const token = generateMockJWT(userWithoutPassword);
    return { user: userWithoutPassword, token };
  },

  async signup(data) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getMockUsers();
    const cleanEmail = data.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('A maritime account with this email address already exists.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: data.fullName.trim(),
      email: cleanEmail,
      role: data.role,
      company: data.company.trim(),
      passwordHash: data.password,
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));

    const { passwordHash, ...userWithoutPassword } = newUser;
    const token = generateMockJWT(userWithoutPassword);
    return { user: userWithoutPassword, token };
  },
};

export default authService;
