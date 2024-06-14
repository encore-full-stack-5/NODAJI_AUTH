import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './User.entity';
import { Repository } from 'typeorm';
import { RequestDTO } from './dto/RequestDTO.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[] | null> {
    const users = await this.userRepository.find();

    return users;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.userRepository.findOne({ where: { id: id } });
    const { ...result } = user;
    return user;
  }

  async findByPassword(req: RequestDTO): Promise<User | null> {
    const user = this.userRepository.findOne({
      where: { password: req.password },
    });
    const { ...result } = user;
    return user;
  }

  async findByEmail(req: RequestDTO): Promise<User | null> {
    const user = this.userRepository.findOne({ where: { email: req.email } });
    const { ...result } = user;
    return user;
  }

  async login(req: RequestDTO): Promise<string> {
    const findUser = await this.userRepository.findOne({
      where: { email: req.email },
    });
    if (!findUser) throw new UnauthorizedException();
    const isMatch = await (req.password, findUser.password);
    if (!isMatch) throw new NotAcceptableException('비밀번호가 틀렸습니다.');
    const payload = {
      sub: findUser.id,
      name: findUser.name,
      email: findUser.email,
    };
    return '로그인 성공';
  }

  async changePassword(req: RequestDTO): Promise<void> {
    const findUser = await this.userRepository.findOne({
      where: { email: req.email },
    });
    if (!findUser) throw new UnauthorizedException();
    const isMatch = await (req.password, findUser.password);
    if (isMatch)
      throw new NotAcceptableException(
        'The new password cannot be the same as the old password.',
      );

    await this.userRepository.save(findUser);
  }

  async save(req: RequestDTO): Promise<void> {
    const exist = await this.userRepository.findOne({
      where: { email: req.email },
    });
    if (exist) {
      throw new NotAcceptableException();
    }
    const saltOrRounds = 10;
    const user = new User();
    user.name = req.name;
    user.email = req.email;
    user.password = req.password;
    user.point = req.point;
    user.date = new Date();
    await this.userRepository.save(user);
  }
}
