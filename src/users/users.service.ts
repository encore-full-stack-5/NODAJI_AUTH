import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RequestDTO } from './dto/RequestDTO.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly kafkaService: KafkaService,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    return user;
  }

  async findByPassword(req: RequestDTO): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { password: req.password },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }

  async login(req: RequestDTO): Promise<{ authorization: string }> {
    const findUser = await this.userRepository.findOne({
      where: { email: req.email },
    });
    if (!findUser) throw new UnauthorizedException();
    const isMatch = await bcrypt.compare(req.password, findUser.password);
    if (!isMatch) throw new NotAcceptableException('비밀번호가 틀렸습니다.');
    const payload = {
      sub: findUser.id,
      name: findUser.name,
      email: findUser.email,
    };
    const token = await this.jwtService.signAsync(payload);
    return { authorization: `Bearer ${token}` };
  }

  async changePassword(req: RequestDTO): Promise<void> {
    const findUser = await this.userRepository.findOne({
      where: { email: req.email },
    });
    if (!findUser) throw new UnauthorizedException();
    const isMatch = await bcrypt.compare(req.password, findUser.password);
    if (isMatch)
      throw new NotAcceptableException(
        '비밀번호가 동일합니다.',
      );
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(req.password, saltOrRounds);
    findUser.password = hash;
    await this.userRepository.save(findUser);
  }

  async save(req: RequestDTO): Promise<void> {
    const exist = await this.userRepository.findOne({
      where: { email: req.email },
    });
    if (exist) {
      throw new NotAcceptableException();
    }

    const findCertification = req.certification;
    await this.handleCertification(req.email, findCertification);

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(req.password, saltOrRounds);
    const user = new User();
    user.name = req.name;
    user.email = req.email;
    user.password = hash;
    user.point = req.point;
    user.date = new Date();
    await this.userRepository.save(user);

    await this.kafkaService.sendUpdateMessage(user, findCertification);
  }

  async handleCertification(email: string, certification: string): Promise<void> {
    const isTrue = certification === 'expectedCertificationValue';
    console.log(`Handling certification for ${email}:`, certification);
    console.log(`Certification match: ${isTrue}`);

    if (!isTrue) {
      throw new NotAcceptableException('인증 실패');
    }

    console.log('인증 성공');
  }
}
