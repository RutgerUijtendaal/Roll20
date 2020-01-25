function handleRoll(message: ChatEventData) {
  if(message.type !== 'rollresult' && message.type !== 'gmrollresult') {
      return;
  }

  const rollResultMessage = message as RollResultChatEventData;

  log(rollResultMessage.origRoll);
}
