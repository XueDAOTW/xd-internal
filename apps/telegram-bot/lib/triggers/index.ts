import { BotTrigger } from "../utils/types";
import cancelNewPollTrigger from "./cancelNewPoll";
import createPollTrigger from "./createPoll";
import helpTrigger from "./help";
import listPollsTrigger from "./listPolls";
import cancelPollTrigger from "./manage/cancelPoll";
import closePollTrigger from "./manage/closePoll";
import queryPollsTrigger from "./query/queryPolls";
import queryResultsTrigger from "./query/queryResults";
import startTrigger from "./start";
import viewPollTrigger from "./viewPoll";
import abstainVoteTrigger from "./vote/abstainVote";
import noVoteTrigger from "./vote/noVote";
import yesVoteTrigger from "./vote/yesVote";

const triggers: BotTrigger[] = [
  // Create new poll
  createPollTrigger,
  cancelNewPollTrigger,
  // Manage poll
  cancelPollTrigger,
  closePollTrigger,
  // View list of polls caller created
  listPollsTrigger,
  // View and manage specific poll caller created
  viewPollTrigger,
  // Handle votes on polls
  yesVoteTrigger,
  noVoteTrigger,
  abstainVoteTrigger,
  // Inline queries
  queryPollsTrigger,
  queryResultsTrigger,
  // Misc
  helpTrigger,
  startTrigger,
];

export default triggers;
