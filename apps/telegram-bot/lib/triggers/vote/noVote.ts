import { VoteType } from "@xd/database";
import VoteTrigger from "./abstractVote";

class NoVoteTrigger extends VoteTrigger {
  voteType = VoteType.NO;

  callback = /no_/;

  description = "Vote no on a poll";
}

const noVoteTrigger = new NoVoteTrigger();

export default noVoteTrigger;
