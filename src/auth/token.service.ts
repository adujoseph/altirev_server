import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from './entities/token.entity';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private TokenRepository: Repository<TokenEntity>,
  ) {}

  async createToken(createTokenDto: TokenDto) {
    const tokenEntity = new TokenEntity();
    tokenEntity.userAltirevId = createTokenDto.userAltirevId;
    tokenEntity.token = createTokenDto.token;
    return await this.TokenRepository.save(tokenEntity);
  }

  async getTokenByUserAltirevId(userAltirevId: string): Promise<TokenEntity> {
    const found = await this.TokenRepository.findOneBy({ userAltirevId });
    if (!found) {
      throw new NotFoundException(
        `Token with ID ${userAltirevId} is not found`,
      );
    } else {
      return found;
    }
  }

  async deleteNotificationById(altirevId: string): Promise<void> {
    const result = await this.TokenRepository.delete(altirevId);
    if (result.affected === 0) {
      throw new NotFoundException(`Token with ID ${altirevId} is not found`);
    }
  }
}
