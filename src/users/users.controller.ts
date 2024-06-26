import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UserGuard } from './users.guard';
import { Response } from 'express';
import { RequestDTO } from './dto/RequestDTO.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  @Get('id')
  async findById(@Body('id') id: string) {
    const user = await this.userService.findById(id);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  @Get('password')
  async findByPassword(@Body() req: RequestDTO) {
    const user = await this.userService.findByPassword(req);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  @Get('email')
  async findByEmail(@Body('email') email: string) {
    const user = await this.userService.findByEmail(email);
    return user;
  }

  @Post('login')
  async login(@Body() req: RequestDTO, @Res() res: Response) {
    const result = await this.userService.login(req);
    res.setHeader('Authorization', result.authorization);
    res.sendStatus(HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  @Post('password')
  async changePassword(@Body() req: RequestDTO) {
    await this.userService.changePassword(req);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signUp')
  async saveUser(@Body() req: RequestDTO) {
    console.log("회원가입 요청 반응")
    const userEmail = await this.userService.save(req);
    return userEmail;
  }

  @HttpCode(HttpStatus.OK)
  @Post('certification')
  async certificationRequest(@Body() req: RequestDTO, @Res() res: Response) {
    await this.userService.certificationRequest(req);
  }

  @HttpCode(HttpStatus.OK)
  @Post('certification/request')
  async emailCertification(@Body() req: RequestDTO, @Res() res: Response) {
    const result = await this.userService.emailCertification(req);
    return res.json(result);
  }
  




}