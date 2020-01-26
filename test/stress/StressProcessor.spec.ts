import { suite, test } from 'mocha-typescript';
import { StressProcessor } from '../../src/stress/StressProcessor';
import { StressItemManager } from '../../src/stress/StressItemManager';
import { mock, verify, when, instance, deepEqual, anything } from 'ts-mockito';
import { StressStateManager } from '../../src/stress/StressStateManager';
import { Logger } from '../../src/shared/Logger';
import { stressUpdateBase, stressedCharacterBase } from './../util';

@suite
class StressProcessorTest {
  mockStressItemManager: StressItemManager;
  mockStressStateManager: StressStateManager;
  mockLogger: Logger;
  stressProcessor: StressProcessor;

  before() {
    this.mockStressItemManager = mock(StressItemManager);
    this.mockStressStateManager = mock(StressStateManager);
    this.mockLogger = mock(Logger);

    this.stressProcessor = new StressProcessor(
      instance(this.mockStressItemManager),
      instance(this.mockStressStateManager)
    );

    this.stressProcessor.setLogger(instance(this.mockLogger));
  }

  @test itShould_discardSilently_whenStressCharacterIsNull() {
    // Arrange
    const stressUpdate = stressUpdateBase;

    when(
      this.mockStressStateManager.getStressedCharacter(stressUpdate)
    ).thenReturn(null);

    // Act
    this.stressProcessor.processStressAddition(stressUpdate);

    // Assert
    verify(
      this.mockStressStateManager.updateStressedCharacter(anything())
    ).never();
  }

  @test itShould_updateStressValue_whenAddingLessThanStepBreakpoint() {
    // Arrange
    const stressUpdate = stressUpdateBase;
    stressUpdate.amount = 3;
    const stressedCharacter = stressedCharacterBase;

    const expected: StressedCharacter = {
      id: 'uuid-string',
      name: 'Bolvar',
      stressValue: 3,
      stresses: []
    };

    when(
      this.mockStressStateManager.getStressedCharacter(stressUpdate)
    ).thenReturn(stressedCharacter);

    when(this.mockStressItemManager.getRandomStresses(0)).thenReturn([]);

    // Act
    this.stressProcessor.processStressAddition(stressUpdate);

    // Assert
    verify(
      this.mockStressStateManager.updateStressedCharacter(deepEqual(expected))
    ).once();
  }

  @test itShould_updateStresses_whenAddingMoreThanStepBreakpoint() {
    // Arrange
    const stressUpdate = stressUpdateBase;
    stressUpdate.amount = 6;
    const stressedCharacter = stressedCharacterBase;

    when(
      this.mockStressStateManager.getStressedCharacter(stressUpdate)
    ).thenReturn(stressedCharacter);

    when(this.mockStressItemManager.getRandomStresses(1)).thenReturn();

    // Act

    // Assert
  }

  @test itShould_notGoBelowZero_whenRemovingStress() {
    // Arrange
    const stressUpdate = stressUpdateBase;
    stressUpdate.amount = -6;
    const stressedCharacter = stressedCharacterBase;
    stressedCharacter.stressValue = 3;

    const expected: StressedCharacter = {
      id: 'uuid-string',
      name: 'Bolvar',
      stressValue: 0,
      stresses: []
    };

    when(
      this.mockStressStateManager.getStressedCharacter(stressUpdate)
    ).thenReturn(stressedCharacter);

    when(this.mockStressItemManager.getRandomStresses(0)).thenReturn([]);

    // Act
    this.stressProcessor.processStressRemoval(stressUpdate);

    // Assert
    verify(
      this.mockStressStateManager.updateStressedCharacter(deepEqual(expected))
    ).once();
  }
}
