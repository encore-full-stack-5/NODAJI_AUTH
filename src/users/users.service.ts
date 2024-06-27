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
import { KafkaService } from 'src/kafka/kafka.service';
import { RedisService } from 'src/redis/redis.service';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly kafkaService: KafkaService,
    private readonly redisService: RedisService, 
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
      id: findUser.id,
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

  async certificationRequest(req: RequestDTO): Promise<void> {

    const exist = await this.userRepository.findOne({
      where: { email: req.email },
    });
    if (exist) {
      throw new NotAcceptableException("중복된 이메일입니다.");
    }
    await this.kafkaService.sendSinupMessge(req); // nodagi_email 서버로 인증 메일 요청 보내기
  }

  async save(req: RequestDTO): Promise<String> {
    
    const findCertification = await this.redisService.getValueByKey(req.email); // 3분 유효시간안에 Redis에서 인증 값 찾기
    const isTrue = await this.handleCertification(req.email, findCertification, req.confirmationRequest);

    if (!isTrue) {
      throw new NotAcceptableException('인증 실패');
    }

    const saltOrRounds = 10; // 해싱 코드 설정
    const hash = await bcrypt.hash(req.password, saltOrRounds); // 비밀번호 해시코딩

    const user = new User();
    user.id = uuidv4();   // UUID 값 주입
    user.name = req.name;
    user.email = req.email;
    user.password = hash;  
    user.date = new Date(); // 유저 저장 시간 

  
    await this.userRepository.save(user); // 유저 저장
    await this.kafkaService.sendUpdateMessage(user); // nodagi_email 서버로 유저 정보 전달
    await this.kafkaService.sendAccountMessage(user); // nodagi_account 서버로 유저 정보 전달
    return user.email;
  
  }

  async handleCertification(email: string, certification: string, confirmationRequest: string): Promise<boolean> {
    const trimmedCertification = certification.replace(/^"|"$/g, '');        //redis value 값에 "" 따옴표로 삭제 로직
    const trimmedConfirmationRequest = confirmationRequest.replace(/^"|"$/g, ''); 
    const isTrue = trimmedCertification === trimmedConfirmationRequest; // 두 값이 같을 경우 
    return isTrue;
}
 
async updateUserPoints(userId: string, points: number): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (user) {
    user.point = points;
    return await this.userRepository.save(user);
  }
  throw new Error('User not found');
}


}


