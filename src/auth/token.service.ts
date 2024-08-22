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
    tokenEntity.email = createTokenDto.email;
    tokenEntity.token = createTokenDto.token;
    return await this.TokenRepository.save(tokenEntity);
  }

  async getTokenByUserEmail(email: string): Promise<TokenEntity | null> {
    return await this.TokenRepository.findOneBy({ email });
  }

  async deleteTokenByEmail(id: number): Promise<void> {
    const result = await this.TokenRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Token is not found`);
    }
  }
}
