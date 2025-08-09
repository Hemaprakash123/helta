import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodeMailer.js";
import Story from '../models/Story.js'
import Message from "../models/Message.js";

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
      throw error;
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
  { event: 'clerk/user.deleted' },
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

const sendNewConnectionRequestReminder = inngest.createFunction(
  { id: "send-new-connection-request-reminder" },
  { event: "app/connection-request" },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run('send-connection-request-mail', async () => {
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
      const subject = `👍 New Connection Request`;
      const body = `
      <div style="font-family:Arial,sans-serif; padding:20px;">
          <h2>Hi ${connection.to_user_id.full_name},</h2>
          <p>You have a new Connection request from ${connection.from_user_id.full_name}-@${connection.from_user_id.username}</p>
          <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a> to accept or reject the request</p>
          <br/>
          <p>Thanks,<br/> Helta-stay Connected</p>
      </div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body
      });
    });

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-for-24hours", in24Hours);

    await step.run('send-connection-request-reminder', async () => {
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');

      if (connection.status === 'accepted') {
        return { message: "Already accepted" };
      }

      const subject = `👍 Reminder: Connection Request`;
      const body = `
      <div style="font-family:Arial,sans-serif; padding:20px;">
          <h2>Hi ${connection.to_user_id.full_name},</h2>
          <p>You still have a pending connection request from ${connection.from_user_id.full_name}-@${connection.from_user_id.username}</p>
          <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a> to accept or reject the request</p>
          <br/>
          <p>Thanks,<br/> Helta-stay Connected</p>
      </div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body
      });

      return { message: "Reminder sent" };
    });
  }
);

//to delete story after 24 hrs

const deleteStory = inngest.createFunction(
  { id: 'story-delete' },
  { event: 'app/story.delete' },
  async ({ event, step }) => {
    const { storyId } = event.data;
    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await step.sleepUntil('wait-for-24-hours', in24Hours)
    await step.run("delete-story", async () => {
      await Story.findByIdAndDelete(storyId)
      return { message: "story deleted" }
    })
  }
)

const sendNotificationOfUnseenMessages = inngest.createFunction(
  { id: "send-unseen-messages-notification" },
  { cron: "TZ=America/New_York 0 9 * * *" },//every day 9 am
  async ({ step }) => {
    const messages = await Message.find({ seen: false }).populate('to_user_id');
    const unseenCount = {}

    messages.map(message => {
      unseenCount[message.to_user_id._id] = (unseenCount[message.to_user_id._id] || 0) + 1;
    })

    for (const userId in unseenCount) {
      const user = await User.findById(userId)
      const subject = `you have ${unseenCount[userId]} unseen messages`;
      const body = `
      <div style='font-family:Arial,sans-serif;padding:20px'>
          <h2>Hi ${user.full_name},</h2>
          <p>You have ${unseenCount[userId]} unseen messages</p>
          <p>Click <a href="${process.env.FRONTEND_URL}/messages" style="color: #10b981">here</a>to view them</p>
          <br/>
          <p>Thanks,<br/>Helta-stay connected</p>
      </div>      
      `;

      await sendEmail({
        to:user.email,
        subject,
        body
      })
    }

    return {message:'Notification sent.'}

  })



export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendNewConnectionRequestReminder,
  deleteStory,
  sendNotificationOfUnseenMessages
];

