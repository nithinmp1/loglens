import { graphql } from 'graphql';
import { schema } from '../graphql/schema.ts';

describe('GraphQL Schema', () => {
  let token: string;

  it('should return health check', async () => {
    const query = `
      query {
        health
      }
    `;

    const result = await graphql({
      schema,
      source: query,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.health).toBe('LogLens API is running 🚀');
  });

  it('should register a new user', async () => {
    const mutation = `
      mutation {
        register(username: "testuser", password: "pass123") {
          id
          username
          token
        }
      }
    `;

    const result = await graphql({
      schema,
      source: mutation,
    });

    expect(result.errors).toBeUndefined();
    const registerData = result.data as { register: { username: string; token: string } };
    expect(registerData.register.username).toBe('testuser');
    expect(registerData.register.token).toBeDefined();

    token = registerData.register.token;
  });

  it('should login existing user', async () => {
    const mutation = `
      mutation {
        login(username: "testuser", password: "pass123") {
          id
          username
          token
        }
      }
    `;

    const result = await graphql({
      schema,
      source: mutation,
    });

    expect(result.errors).toBeUndefined();
    const loginData = result.data as { login: { username: string; token: string } };
    expect(loginData.login.username).toBe('testuser');
    expect(loginData.login.token).toBeDefined();
  });

  it('should add log if authorized', async () => {
    const mutation = `
      mutation {
        addLog(service: "Auth", level: "INFO", message: "Login success") {
          id
          service
          level
          message
        }
      }
    `;

    const result = await graphql({
      schema,
      source: mutation,
      contextValue: {
        user: { id: 1, username: 'testuser' }, // simulate logged-in user
      },
    });

    expect(result.errors).toBeUndefined();
    const addLogData = result.data as { addLog: { service: string; level: string; message: string } };
    expect(addLogData.addLog.service).toBe('Auth');
    expect(addLogData.addLog.level).toBe('INFO');
  });

  it('should not add log if unauthorized', async () => {
    const mutation = `
      mutation {
        addLog(service: "Auth", level: "INFO", message: "Should fail") {
          id
        }
      }
    `;

    const result = await graphql({
      schema,
      source: mutation,
      contextValue: {}, // no user
    });

    expect(result.errors?.[0].message).toBe('Unauthorized');
    expect(result.data?.addLog).toBeNull();
  });
});
