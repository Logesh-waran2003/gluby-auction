import prisma from "@/lib/prisma";

export class MessageService {
  /**
   * Get all messages for an auction
   */
  async getAuctionMessages(auctionId: string) {
    return prisma.message.findMany({
      where: { auctionId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Get conversation between two users for an auction
   */
  async getConversation(senderId: string, recipientId: string, auctionId: string) {
    return prisma.message.findMany({
      where: {
        auctionId,
        OR: [
          {
            senderId,
            recipientId,
          },
          {
            senderId: recipientId,
            recipientId: senderId,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Send a new message
   */
  async sendMessage(data: {
    text: string;
    senderId: string;
    recipientId: string;
    auctionId: string;
  }) {
    const { text, senderId, recipientId, auctionId } = data;

    return prisma.message.create({
      data: {
        text,
        senderId,
        recipientId,
        auctionId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId: string) {
    // Get all unique conversations
    const sentMessages = await prisma.message.findMany({
      where: {
        senderId: userId,
      },
      select: {
        auctionId: true,
        recipientId: true,
      },
      distinct: ["auctionId", "recipientId"],
    });

    const receivedMessages = await prisma.message.findMany({
      where: {
        recipientId: userId,
      },
      select: {
        auctionId: true,
        senderId: true,
      },
      distinct: ["auctionId", "senderId"],
    });

    // Combine and deduplicate conversations
    const conversations = [];

    // Add sent message conversations
    for (const msg of sentMessages) {
      conversations.push({
        auctionId: msg.auctionId,
        otherUserId: msg.recipientId,
      });
    }

    // Add received message conversations
    for (const msg of receivedMessages) {
      // Check if this conversation is already included
      const exists = conversations.some(
        (conv) =>
          conv.auctionId === msg.auctionId && conv.otherUserId === msg.senderId
      );

      if (!exists) {
        conversations.push({
          auctionId: msg.auctionId,
          otherUserId: msg.senderId,
        });
      }
    }

    // Fetch details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const auction = await prisma.auction.findUnique({
          where: { id: conv.auctionId },
          select: {
            id: true,
            title: true,
            images: true,
          },
        });

        const otherUser = await prisma.user.findUnique({
          where: { id: conv.otherUserId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        const lastMessage = await prisma.message.findFirst({
          where: {
            auctionId: conv.auctionId,
            OR: [
              {
                senderId: userId,
                recipientId: conv.otherUserId,
              },
              {
                senderId: conv.otherUserId,
                recipientId: userId,
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            text: true,
            createdAt: true,
            senderId: true,
          },
        });

        return {
          auction,
          otherUser,
          lastMessage,
        };
      })
    );

    return conversationsWithDetails;
  }
}

// Export a singleton instance
export const messageService = new MessageService();
