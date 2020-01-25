function handleStressCommand(message: ChatEventData) {
  if (message.type !== 'api') {
    return;
  }

  /**
   * Add a new character to the StressState.
   * Silently ignores if character is already registered
   */
  if (message.content.indexOf('!stress') !== -1) {
    (stressManager as StressManager).addNewStressedCharacter({
      name: message.who,
      id: message.playerid
    });

    return;
  }

  /**
   * Add stress to a character. Character is based on who
   * If value given is not just numbers request is discarded
   */
  if (message.content.indexOf('!+stress') !== -1) {
    const amountToAdd = extractStressAmount(message.content);

    if (!amountToAdd) {
      return;
    }

    (stressManager as StressManager).addStress({
      name: message.who,
      id: message.playerid,
      amount: amountToAdd
    });

    return;
  }

  /**
   * Remove stress from a character.
   * If value given is not just numbers request is discarded
   */
  if (message.content.indexOf('!-stress') !== -1) {
    log(message.who);
    log(message.playerid);
    return;
  }
}

function extractStressAmount(message: string): number {
  const numbersRegex = /^[0-9]+$/;
  const amount = message.substr(message.indexOf(' ') + 1);

  if (amount.match(numbersRegex)) {
    return +amount;
  }

  return null;

  logger.error('Stress update command contained more than just numbers');
  // TODO
  // add way to inform player that his command sucks.
}
