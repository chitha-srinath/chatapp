import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashingService {
  /**
   * Hash a plain text value (e.g., password).
   * @param plainText - The plain text string to hash.
   * @returns The hashed value.
   */
  async hash(plainText: string): Promise<string> {
    return await argon2.hash(plainText, argon2Options);
  }

  /**
   * Verify a plain text value against a hashed value.
   * @param hashed - The previously hashed value.
   * @param plainText - The plain text to compare.
   * @returns Boolean indicating if values match.
   */
  async compare(hashed: string, plainText: string): Promise<boolean> {
    return await argon2.verify(hashed, plainText);
  }
}

const argon2Options = {
  // Memory cost: 32 MiB (default is 65536 KiB = 64 MiB)
  memoryCost: 32768,
  // Time cost: 3 iterations (default is 3)
  timeCost: 3,
  // Parallelism: number of threads (adjust based on CPU cores)
  parallelism: 2,
  // Type of Argon2: 'argon2id' combines security against side-channel attacks (argon2i)
  // and resistance against GPU cracking (argon2d)
  type: argon2.argon2id,
  // Output hash length
  hashLength: 32,
};
