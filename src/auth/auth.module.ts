import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../modules/users/entities';
import { UsersService } from '../modules/users/users.service';
import { JwtStrategy } from './jwt.strategy';



@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      async useFactory(config: ConfigService) {
        const jwtConfig = {
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: '24h'}
        }

        return jwtConfig;
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy]
})
export class AuthModule {}
