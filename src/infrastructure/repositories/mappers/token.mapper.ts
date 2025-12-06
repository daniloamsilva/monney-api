import { Token, TokenType } from '@src/domain/users/entities/token.entity';

export interface TokenDbRow {
  id: string;
  user_id: string;
  type: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export type ToPersist = Token & { userId: string };

export class TokenMapper {
  public static toPersistence(toPersist: ToPersist): TokenDbRow {
    return {
      id: toPersist.value,
      user_id: toPersist.userId,
      type: toPersist.type,
      expires_at: toPersist.expiresAt,
      used_at: toPersist.usedAt !== undefined ? toPersist.usedAt : null,
      created_at: toPersist.createdAt,
      updated_at: toPersist.updatedAt,
      deleted_at:
        toPersist.deletedAt !== undefined ? toPersist.deletedAt : null,
    };
  }

  public static toDomain(raw: TokenDbRow): Token {
    const tokenProps = {
      id: raw.id,
      type: raw.type as TokenType,
      expiresAt: raw.expires_at,
      usedAt: raw.used_at !== null ? raw.used_at : undefined,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      deletedAt: raw.deleted_at !== null ? raw.deleted_at : undefined,
    };

    return Token.hydrate(tokenProps);
  }
}
