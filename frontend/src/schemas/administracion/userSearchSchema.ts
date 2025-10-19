import { z } from 'zod';
import { fallback } from '@tanstack/zod-adapter';

export const userSearchSchema = z.object({
    page: fallback(z.number(), 1).optional(),
    page_size: fallback(z.number(), 10).optional(),
    ordering: fallback(
        z.enum([
            'national_id',
            '-national_id',
            'last_name',
            '-last_name',
            'email',
            '-email',
            'last_login',
            '-last_login'
        ]),
        'last_name'
    ).optional(),
    search: fallback(z.string(), '').optional(),
    is_active: fallback(z.boolean(), true).optional(),
    is_staff: fallback(z.boolean(), false).optional(),
});

export type UserSearchType = z.infer<typeof userSearchSchema>;