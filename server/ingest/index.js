import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "helta-app" });

const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      
      // Validate required fields
      if (!email_addresses?.[0]?.email_address) {
        throw new Error('No email address provided');
      }

      let username = email_addresses[0].email_address.split('@')[0];
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        // More robust username generation
        username = `${username}-${Math.random().toString(36).substring(2, 8)}`;
      }

      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        full_name: `${first_name} ${last_name}`.trim(),
        profile_picture: image_url,
        username
      };

      await User.create(userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw to mark the function as failed
    }
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      if (!id) {
        throw new Error('No user ID provided');
      }

      const updatedUserData = {
        email: email_addresses?.[0]?.email_address,
        full_name: `${first_name} ${last_name}`.trim(),
        profile_picture: image_url
      };

      await User.findByIdAndUpdate(id, updatedUserData, { new: true });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: 'clerk/user.deleted' }, // Fixed event name (was 'deletion')
  async ({ event }) => {
    try {
      const { id } = event.data;
      
      if (!id) {
        throw new Error('No user ID provided');
      }

      await User.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
);

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion
];
