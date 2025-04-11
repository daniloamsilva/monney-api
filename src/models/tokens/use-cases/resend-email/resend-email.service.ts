import { Inject, Injectable } from '@nestjs/common';

import { Providers } from '@/repositories/providers.enum';
import { TokensRepositoryInterface } from '@/repositories/tokens/tokens.repository.interface';
import { SendEmailService } from '../send-email/send-email.service';
import { ResendEmailResponseDto } from './resend-email.response.dto';
import { ResendEmailRequestDto } from './resend-email.request.dto';

@Injectable()
export class ResendEmailService {
  constructor(
    @Inject(Providers.TOKENS_REPOSITORY)
    private readonly tokensRepository: TokensRepositoryInterface,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async execute(data: ResendEmailRequestDto): Promise<ResendEmailResponseDto> {
    const oldTokens =
      await this.tokensRepository.findValidTokensByUserIdAndType(
        data.userId,
        data.tokenType,
      );

    if (oldTokens.length) {
      await Promise.all(
        oldTokens.map((token) => {
          token.deletedAt = new Date();
          return this.tokensRepository.save(token);
        }),
      );
    }

    await this.sendEmailService.execute(data);

    return {
      statusCode: 200,
      message: 'Email resent successfully',
    };
  }
}
