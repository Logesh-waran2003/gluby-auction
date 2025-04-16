import prisma from "@/lib/prisma";

export class CommentService {
  /**
   * Get all comments for an auction
   */
  async getAuctionComments(auctionId: string) {
    return prisma.comment.findMany({
      where: { auctionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Create a new comment
   */
  async createComment(data: {
    text: string;
    userId: string;
    auctionId: string;
  }) {
    const { text, userId, auctionId } = data;

    return prisma.comment.create({
      data: {
        text,
        userId,
        auctionId,
      },
      include: {
        user: {
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
   * Delete a comment
   */
  async deleteComment(id: string, userId: string) {
    // First check if the user is the comment author
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("You can only delete your own comments");
    }

    return prisma.comment.delete({
      where: { id },
    });
  }

  /**
   * Get comments by user
   */
  async getUserComments(userId: string) {
    return prisma.comment.findMany({
      where: { userId },
      include: {
        auction: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

// Export a singleton instance
export const commentService = new CommentService();
