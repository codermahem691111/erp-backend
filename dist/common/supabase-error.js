"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwOnSupabaseError = throwOnSupabaseError;
const common_1 = require("@nestjs/common");
function throwOnSupabaseError(logger, action, error) {
    if (!error)
        return;
    logger.error(`Failed to ${action}: ${error.message} (code ${error.code})`);
    throw new common_1.InternalServerErrorException('Something went wrong. Please try again later.');
}
//# sourceMappingURL=supabase-error.js.map