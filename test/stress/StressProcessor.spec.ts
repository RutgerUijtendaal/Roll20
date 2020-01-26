import { suite, test } from 'mocha-typescript';
import { StressProcessor } from '../../src/stress/StressProcessor';
import { StressItemManager } from '../../src/stress/StressItemManager';
import { mock, verify, when, instance, deepEqual, anything } from 'ts-mockito';
import { StressStateManager } from '../../src/stress/StressStateManager';
import { Logger } from '../../src/shared/Logger';
import { TestBase } from '../TestBase';
import { Chatter } from '../../src/shared/Chatter';

@suite
class StressProcessorTest {
  // @ts-ignore
  mockStressItemManager: StressItemManager;
  // @ts-ignore
  mockStressStateManager: StressStateManager;
  // @ts-ignore
  mockChatter: Chatter;
  // @ts-ignore
  mockLogger: Logger;
  // @ts-ignore
  stressProcessor: StressProcessor;

  before() {
    this.mockStressItemManager = mock(StressItemManager);
    this.mockStressStateManager = mock(StressStateManager);
    this.mockChatter = mock(Chatter);
    this.mockLogger = mock(Logger);

    this.stressProcessor = new StressProcessor(
      instance(this.mockStressItemManager),
      instance(this.mockStressStateManager),
      instance(this.mockChatter)
    );

    this.stressProcessor.setLogger(instance(this.mockLogger));
  }

  @test
  itShould_discardSilently_whenStressCharacterIsNull() {
    // Arrange
    const stressUpdate = TestBase.stressUpdateBase();

    when(this.mockStressStateManager.getStressedCharacter(stressUpdate)).thenReturn(null);

    // Act
    this.stressProcessor.processStressAddition(stressUpdate);

    // Assert
    verify(this.mockStressStateManager.updateStressedCharacter(anything())).never();
  }

  @test
  itShould_updateStressValue_whenAddingLessThanStepBreakpoint() {
    // Arrange
    const stressUpdate = TestBase.stressUpdateBase();
    const stressedCharacter = TestBase.stressedCharacterBase();
    stressUpdate.amount = 3;

    const expected: StressedCharacter = {
      id: 'uuid-string',
      name: 'Bolvar',
      stressValue: 3,
      stresses: []
    };

    when(this.mockStressStateManager.getStressedCharacter(stressUpdate)).thenReturn(
      stressedCharacter
    );

    when(this.mockStressItemManager.getRandomStresses(0)).thenReturn([]);

    // Act
    this.stressProcessor.processStressAddition(stressUpdate);

    // Assert
    verify(this.mockStressStateManager.updateStressedCharacter(deepEqual(expected))).once();
  }

  @test 
  itShould_updateStresses_whenAddingMoreThanStepBreakpoint() {
    // Arrange
    const stressUpdate = TestBase.stressUpdateBase();
    const stressedCharacter = TestBase.stressedCharacterBase();
    const stress = TestBase.stressItemBase();
    stressUpdate.amount = 6;

    const expected: StressedCharacter = {
      id: 'uuid-string',
      name: 'Bolvar',
      stressValue: 6,
      stresses: [stress]
    };

    when(this.mockStressStateManager.getStressedCharacter(stressUpdate)).thenReturn(
      stressedCharacter
    );

    when(this.mockStressItemManager.getRandomStresses(1)).thenReturn([stress]);

    // Act
    this.stressProcessor.processStressAddition(stressUpdate);

    // Assert
    verify(this.mockStressStateManager.updateStressedCharacter(deepEqual(expected))).once();
  }

  @test 
  itShould_notGoBelowZero_whenRemovingStress_fromGreaterThanZeroAmount() {
    // Arrange
    const stressUpdate = TestBase.stressUpdateBase();
    const stressedCharacter = TestBase.stressedCharacterBase();
    stressedCharacter.stressValue = 3;
    stressUpdate.amount = -6;

    const expected: StressedCharacter = {
      id: 'uuid-string',
      name: 'Bolvar',
      stressValue: 0,
      stresses: []
    };

    when(this.mockStressStateManager.getStressedCharacter(stressUpdate)).thenReturn(
      stressedCharacter
    );

    when(this.mockStressItemManager.getRandomStresses(0)).thenReturn([]);

    // Act
    this.stressProcessor.processStressRemoval(stressUpdate);

    // Assert
    verify(this.mockStressStateManager.updateStressedCharacter(deepEqual(expected))).once();
  }

  @test 
  itShould_notGoBelowZero_whenRemovingStress_fromZeroAmount() {
    // Arrange
    const stressUpdate = TestBase.stressUpdateBase();
    const stressedCharacter = TestBase.stressedCharacterBase();
    stressedCharacter.stressValue = 0;
    stressUpdate.amount = -6;

    const expected: StressedCharacter = {
      id: 'uuid-string',
      name: 'Bolvar',
      stressValue: 0,
      stresses: []
    };

    when(this.mockStressStateManager.getStressedCharacter(stressUpdate)).thenReturn(
      stressedCharacter
    );

    when(this.mockStressItemManager.getRandomStresses(0)).thenReturn([]);

    // Act
    this.stressProcessor.processStressRemoval(stressUpdate);

    // Assert
    verify(this.mockStressStateManager.updateStressedCharacter(deepEqual(expected))).once();
  }
}
