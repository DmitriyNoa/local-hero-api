import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor() {}

  async validateUser(username: string, pass: string): Promise<any> {
    return { username, pass };
  }

  async login(credentials: any) {
    const { username, password } = credentials;

    const formBody2 = new URLSearchParams();
    formBody2.append('username', username);
    formBody2.append('password', password);
    formBody2.append('grant_type', 'password');
    formBody2.append('client_id', process.env.KEYCLOAK_CLIENT_ID);
    formBody2.append('client_secret', process.env.KEYCLOAK_SECRET);

    try {
      const authResult = await axios.post(
        process.env.KEYCLOAK_TOKEN_URL,
        formBody2.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return authResult.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async authenticate(accessToken: string): Promise<any> {
    const url = `${process.env.KEYCLOAK_BASE_URL}/realms/hero/protocol/openid-connect/userinfo`;

    try {
      const response = await axios.get(url, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        id: response.data.sub,
        username: response.data.preferred_username,
      };
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
