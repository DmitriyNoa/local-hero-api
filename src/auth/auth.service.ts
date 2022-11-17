import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jose from 'jose';
import axios from 'axios';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return { username, pass };
  }

  async login(credentials: any) {
    const { username, password, token } = credentials;
    if (token) {
      return await this.loginWithToken(token);
    }

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
    console.log('accessToken', accessToken);
    const url = `${process.env.KEYCLOAK_BASE_URL}/realms/hero/protocol/openid-connect/userinfo`;

    try {
      const response = await axios.get(url, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('response', response.data);

      return {
        id: response.data.sub,
        username: response.data.preferred_username,
      };
    } catch (e) {
      console.log('auth error', e);
      throw new UnauthorizedException(e.message);
    }
  }

  async loginWithToken(token) {
    const loginData = await this.authenticate(token);
    const tokenData = jose.decodeJwt(token);

    if (tokenData && loginData) {
      const existingUser = await this.userService.findOne({
        where: { userId: loginData.id },
      });

      if (!existingUser) {
        console.log('creating user');
        await this.userService.addPureUser(loginData.id);
      }

      return {
        access_token: token,
      };
    }
  }
}
