import { InlineKeyboard } from "grammy";
import prisma from "./prisma";
import { PollStatus } from "@xd/database";

export const createNewPollKeyboard = new InlineKeyboard().text(
  "Create new poll",
  "createNewPoll",
);

export const cancelNewPollKeyboard = new InlineKeyboard().text(
  "Cancel",
  "cancelNewPoll",
);

export const getNewPollCreatedKeyboard = (pollId: string) => {
  return new InlineKeyboard()
    .switchInline("Share Poll", `poll ${pollId}`)
    .row()
    .text("Manage Poll", `view_${pollId}`);
};

export const getVoteKeyboard = (pollId: string) =>
  new InlineKeyboard()
    .text("🙋 Yes", `yes_${pollId}`)
    .row()
    .text("🙅 No", `no_${pollId}`)
    .row()
    .text("🤷 Abstain", `abstain_${pollId}`);

export const getManagePollKeyboard = async (pollId: string) => {
  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
  });
  if (!poll) {
    throw new Error(`Poll ${pollId} not found`);
  }
  switch (poll.pollStatus) {
    case PollStatus.CLOSED:
      return new InlineKeyboard().switchInline(
        `Poll closed. Share results.`,
        `results ${poll.id}`,
      );
    case PollStatus.CANCELED:
      return new InlineKeyboard().text(
        `Poll cancelled. Create new poll.`,
        "createNewPoll",
      );
    case PollStatus.OPEN:
      return new InlineKeyboard()
        .switchInline(`Share Poll`, `poll ${poll.id}`)
        .row()
        .switchInline(`Share Results`, `results ${poll.id}`)
        .row()
        .text(`Close`, `closePoll_${poll.id}`)
        .text(`Cancel`, `cancelPoll_${poll.id}`);
    default:
      throw new Error(`Unknown poll status ${poll.pollStatus}`);
  }
};
