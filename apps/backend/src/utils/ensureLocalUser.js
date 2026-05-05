import { clerkClient } from '@clerk/express';
import User from '../../../../database/models/user.model.js';

export async function ensureLocalUser(clerkUserId) {
    let user = await User.findOne({ clerkUserId });
    if (user) return user;

    // fetch from Clerk once
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    const name = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(' ');

    user = await User.create({ clerkUserId, email, name });
    return user;
}
