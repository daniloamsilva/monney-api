import { HttpStatus, Inject, Injectable } from '@nestjs/common';

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

  async execute(
    userId: string,
    data: ResendEmailRequestDto,
  ): Promise<ResendEmailResponseDto> {
    const oldTokens =
      await this.tokensRepository.findValidTokensByUserIdAndType(
        userId,
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

    await this.sendEmailService.execute({
      userId,
      tokenType: data.tokenType,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Email resent successfully',
    };
  }
}
