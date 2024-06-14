import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RequestDTO } from './dto/RequestDTO.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllUser() {
    const users = await this.userService.getAllUsers();
    return users;
  }
  @HttpCode(HttpStatus.OK)
  @Get('id')
  async findById(@Body() id: string) {
    const users = await this.userService.findById(id);
    return users;
  }
  @HttpCode(HttpStatus.OK)
  @Get('password')
  async findByPassword(@Body() req: RequestDTO) {
    const users = await this.userService.findByPassword(req);
    return users;
  }
  @HttpCode(HttpStatus.OK)
  @Get('email')
  async findByEmail(@Body() req: RequestDTO) {
    const users = await this.userService.findByEmail(req);
    return users;
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() req: RequestDTO) {
    const user = await this.userService.login(req);
    return user;
  }
  @HttpCode(HttpStatus.OK)
  @Post('password')
  async changePassword(@Body() req: RequestDTO) {
    const sucess = await this.userService.changePassword(req);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async saveUser(@Body() req: RequestDTO) {
    await this.userService.save(req);
  }
}
