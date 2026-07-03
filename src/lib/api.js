// API Integration Module - Google Sheets / Email Backend
const API_URL = process.env.REACT_APP_API_URL || '';
export async function submitCollaboration(data) {
  console.log('Sending Collaboration Proposal:', data);

  if (!API_URL) {
    console.warn('API URL (REACT_APP_API_URL) is not defined. Simulating local API submission.');
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem('kafeinarts-mock-collabs') || '[]');
        stored.push({ id: `collab-${Date.now()}`, timestamp: new Date().toISOString(), ...data });
        localStorage.setItem('kafeinarts-mock-collabs', JSON.stringify(stored));
        resolve({ success: true, message: 'Simulation: Data logged successfully' });
      }, 1000);
    });
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'collaboration',
        timestamp: new Date().toISOString(),
        ...data
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API submission failed:', error);
    throw error;
  }
}
export async function fetchCollaborators() {
  if (!API_URL) {
    console.warn('API URL is not defined. Loading mock collaborators from local storage.');
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem('kafeinarts-mock-collabs') || '[]');
        if (stored.length === 0) {
          // Provide some high-quality mock collaborators so it looks premium immediately!
          const defaultMocks = [
            {
              id: 'mock-1',
              name: 'Arif Alexander',
              email: 'arif@kafeinarts.com',
              phone: '6285817048266',
              idea: 'A multiplayer 16-bit RPG about coffee shop management using Roblox Studio.',
              timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
            }
          ];
          localStorage.setItem('kafeinarts-mock-collabs', JSON.stringify(defaultMocks));
          resolve(defaultMocks);
        } else {
          resolve(stored);
        }
      }, 800);
    });
  }

  try {
    const response = await fetch(`${API_URL}?action=getCollaborators`);
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch collaborators:', error);
    throw error;
  }
}
export async function submitContactMessage(data) {
  console.log('Sending Contact Message:', data);

  if (!API_URL) {
    console.warn('API URL (REACT_APP_API_URL) is not defined. Simulating local API submission.');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Simulation: Data logged successfully' });
      }, 1000);
    });
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'contact',
        timestamp: new Date().toISOString(),
        ...data
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API submission failed:', error);
    throw error;
  }
}
