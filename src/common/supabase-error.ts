import { InternalServerErrorException, Logger } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';

export function throwOnSupabaseError(
  logger: Logger,
  action: string,
  error: PostgrestError | null,
): void {
  if (!error) return;
  logger.error(`Failed to ${action}: ${error.message} (code ${error.code})`);
  throw new InternalServerErrorException('Something went wrong. Please try again later.');
}
