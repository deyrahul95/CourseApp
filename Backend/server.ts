import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';

interface Appointment {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  name: string;
  email: string;
  phone: string;
}

const PORT = 3000;
let nextId = 104;

let appointments: Appointment[] = [
  {
    id: 101,
    title: 'Test One',
    date: '2026-11-03',
    startTime: '07:45',
    name: 'Test1',
    email: 'test1@gmail.com',
    phone: '1111111111',
  },
  {
    id: 102,
    title: 'Test Two',
    date: '2026-11-04',
    startTime: '10:45',
    name: 'Test2',
    email: 'test2@gmail.com',
    phone: '2222222222',
  },
  {
    id: 103,
    title: 'Test Three',
    date: '2026-11-05',
    startTime: '18:30',
    name: 'Test3',
    email: 'test3@gmail.com',
    phone: '3333333333',
  },
];

function log(event: string, details: Record<string, unknown> = {}): void {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      ...details,
    }),
  );
}

function sendJson(
  res: ServerResponse,
  requestId: string,
  statusCode: number,
  data: unknown,
  startedAt: number,
): void {
  const responseBody = JSON.stringify(data);

  log('response', {
    requestId,
    statusCode,
    durationMs: Date.now() - startedAt,
    body: data,
  });

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(responseBody);
}

function readJsonBody(req: IncomingMessage, requestId: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();

      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const parsedBody: unknown = body ? JSON.parse(body) : {};
        log('request_body', { requestId, body: parsedBody });
        resolve(parsedBody);
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}

const server = createServer(async (req: any, res: any) => {
  const requestId = randomUUID();
  const startedAt = Date.now();
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

  log('request', {
    requestId,
    method: req.method,
    path: url.pathname,
    query: url.search,
  });

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();

    log('response', {
      requestId,
      statusCode: 204,
      durationMs: Date.now() - startedAt,
    });
    return;
  }

  const parts = url.pathname.split('/').filter(Boolean);

  if (parts[0] !== 'api' || parts[1] !== 'appointments' || parts.length > 3) {
    sendJson(res, requestId, 404, { error: 'Route not found' }, startedAt);
    return;
  }

  const id = parts.length === 3 ? Number(parts[2]) : null;

  if (id !== null && (!Number.isInteger(id) || id < 1)) {
    sendJson(res, requestId, 400, { error: 'Invalid appointment ID' }, startedAt);
    return;
  }

  try {
    if (req.method === 'GET' && id === null) {
      sendJson(res, requestId, 200, appointments, startedAt);
      return;
    }

    if (req.method === 'GET' && id !== null) {
      const appointment = appointments.find((item) => item.id === id);

      if (!appointment) {
        sendJson(res, requestId, 404, { error: 'Appointment not found' }, startedAt);
        return;
      }

      sendJson(res, requestId, 200, appointment, startedAt);
      return;
    }

    if (req.method === 'POST' && id === null) {
      const body = (await readJsonBody(req, requestId)) as Omit<Appointment, 'id'>;
      const appointment: Appointment = { ...body, id: nextId++ };

      appointments.push(appointment);
      sendJson(res, requestId, 201, appointment, startedAt);
      return;
    }

    if ((req.method === 'PUT' || req.method === 'PATCH') && id !== null) {
      const index = appointments.findIndex((item) => item.id === id);

      if (index === -1) {
        sendJson(res, requestId, 404, { error: 'Appointment not found' }, startedAt);
        return;
      }

      const body = (await readJsonBody(req, requestId)) as Partial<Appointment>;
      appointments[index] = { ...appointments[index], ...body, id };

      sendJson(res, requestId, 200, appointments[index], startedAt);
      return;
    }

    if (req.method === 'DELETE' && id !== null) {
      const index = appointments.findIndex((item) => item.id === id);

      if (index === -1) {
        sendJson(res, requestId, 404, { error: 'Appointment not found' }, startedAt);
        return;
      }

      const [deleted] = appointments.splice(index, 1);
      sendJson(res, requestId, 200, deleted, startedAt);
      return;
    }

    sendJson(res, requestId, 405, { error: 'Method not allowed' }, startedAt);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Bad request';
    sendJson(res, requestId, 400, { error: message }, startedAt);
  }
});

server.listen(PORT, () => {
  log('server_started', {
    url: `http://localhost:${PORT}/api/appointments`,
  });
});
