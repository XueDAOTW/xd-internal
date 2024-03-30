import { VoteType } from "@xd/database";
import VoteTrigger from "./abstractVote";

class AbstainVoteTrigger extends VoteTrigger {
  voteType = VoteType.ABSTAIN;

  callback = /abstain_/;

  description = "Vote abstain on a poll";
}

const abstainVoteTrigger = new AbstainVoteTrigger();

export default abstainVoteTrigger;
