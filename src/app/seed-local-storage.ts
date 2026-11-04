import { environment } from '../environments/environment';

export function seedLocalStorage(): void {
  if (!environment.seedLocalStorage) {
    return;
  }

  const key = 'appointments';

  // Seed only if there's no existing data
  if (localStorage.getItem(key) === null) {
    const data = [
      {
        title: 'Test One',
        date: '2026-11-03',
        startTime: '07:45',
        name: 'Test1',
        email: 'test1@gmail.com',
        phone: '1111111111',
        id: 1793801827816,
      },
      {
        id: 1793801865755,
        title: 'Test Two',
        date: '2026-11-04',
        startTime: '10:45',
        name: 'Test2',
        email: 'test2@gmail.com',
        phone: '2222222222',
      },
      {
        id: 1793805265177,
        title: 'Test Three',
        date: '2026-11-05',
        startTime: '18:30',
        name: 'Test3',
        email: 'test3@gmail.com',
        phone: '3333333333',
      },
    ];

    localStorage.setItem(key, JSON.stringify(data));
  }
}
