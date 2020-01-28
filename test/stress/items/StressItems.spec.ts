import { suite, test } from 'mocha-typescript';
import { stresses } from '../../../src/stress/items/StressItems';
import { assert } from 'chai';
import { ObjectHelper } from '../../../src/shared/ObjectHelper';

@suite
class StressItemsTest {

  @test
  itShould_createStressItems_withUniqueIds() {
    // Arrange
    const stressItems = stresses;

    // Act
    const duplicates = ObjectHelper.hasDuplicates(stressItems)

    // Assert
    assert.strictEqual(duplicates, false);
  }
}
