import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { User, Subscriber } = models;

export default {
    /**
     * Handle user.created webhook
     * Creates User in MongoDB and auto-subscribes to newsletter
     */
    handleUserCreated: async (clerkUser) => {
        try {
            const email = clerkUser.email_addresses?.[0]?.email_address;
            const name =
                `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() ||
                'User';
            const profileImage = clerkUser.image_url;

            if (!email) {
                logger.error('User created without email', {
                    clerkUserId: clerkUser.id,
                });
                return;
            }

            const existingUser = await User.findOne({
                clerkUserId: clerkUser.id,
            });

            if (existingUser) {
                if (!existingUser.isActive) {
                    existingUser.isActive = true;
                    existingUser.updatedAt = new Date();
                    await existingUser.save();

                    logger.info('Reactivated existing user', {
                        clerkUserId: clerkUser.id,
                    });
                } else {
                    logger.info('User already exists, skipping', {
                        clerkUserId: clerkUser.id,
                    });
                }

                return;
            }

            // Create user in MongoDB
            const user = await User.create({
                clerkUserId: clerkUser.id,
                email,
                name,
                profileImage,
                isActive: true,
                createdAt: new Date(),
            });

            logger.info('User created in MongoDB', {
                clerkUserId: clerkUser.id,
                mongoId: user._id,
            });

            // Auto-subscribe to newsletter
            let subscriber = await Subscriber.findOne({ email });

            if (subscriber) {
                // Link existing subscriber to user
                subscriber.userId = user._id;
                if (!subscriber.isActive) {
                    subscriber.isActive = true;
                    subscriber.unsubscribedAt = null;
                    subscriber.subscribedAt = new Date();
                }
                await subscriber.save();

                logger.info('Linked subscriber to user', {
                    email,
                    userId: user._id,
                });
            } else {
                // Create new subscriber
                await Subscriber.create({
                    email,
                    userId: user._id,
                    isActive: true,
                    subscribedAt: new Date(),
                    source: 'user_signup',
                });

                logger.info('Auto-subscribed user to newsletter', { email });
            }
        } catch (error) {
            logger.error('Handle user.created failed', {
                error: error.message,
                clerkUserId: clerkUser.id,
            });
        }
    },

    /**
     * Handle user.updated webhook
     * Updates User in MongoDB
     */
    handleUserUpdated: async (clerkUser) => {
        try {
            const email = clerkUser.email_addresses?.[0]?.email_address;
            const name =
                `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() ||
                'User';
            const profileImage = clerkUser.image_url;

            const user = await User.findOne({ clerkUserId: clerkUser.id });

            if (!user) {
                logger.warn('User.updated for non-existent user, creating', {
                    clerkUserId: clerkUser.id,
                });
                await this.handleUserCreated(clerkUser);
                return;
            }

            // Update fields
            user.email = email;
            user.name = name;
            user.profileImage = profileImage;
            user.updatedAt = new Date();

            await user.save();

            // Update subscriber email if changed
            if (email !== user.email) {
                await Subscriber.findOneAndUpdate(
                    { userId: user._id },
                    { email },
                );
            }

            logger.info('User updated in MongoDB', {
                clerkUserId: clerkUser.id,
            });
        } catch (error) {
            logger.error('Handle user.updated failed', {
                error: error.message,
                clerkUserId: clerkUser.id,
            });
        }
    },

    /**
     * Handle user.deleted webhook
     * Soft deletes User in MongoDB
     */
    handleUserDeleted: async (clerkUser) => {
        try {
            const user = await User.findOne({ clerkUserId: clerkUser.id });

            if (!user) {
                logger.warn('User.deleted for non-existent user', {
                    clerkUserId: clerkUser.id,
                });
                return;
            }

            // Soft delete (keep data for referential integrity)
            user.isActive = false;
            user.updatedAt = new Date();
            await user.save();

            // Optionally unsubscribe from newsletter
            await Subscriber.findOneAndUpdate(
                { userId: user._id },
                { isActive: false, unsubscribedAt: new Date() },
            );

            logger.info('User soft-deleted', { clerkUserId: clerkUser.id });
        } catch (error) {
            logger.error('Handle user.deleted failed', {
                error: error.message,
                clerkUserId: clerkUser.id,
            });
        }
    },
};
