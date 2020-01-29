import { suite, test } from 'mocha-typescript';
import { assert } from 'chai';
import { ObjectHelper } from '../../../src/shared/ObjectHelper';
import { perseverences } from '../../../src/stress/items/StressPerseverenceItems';

@suite
// @ts-ignore
class StressPerseverenceItemsTest {

  @test
  itShould_createStressPerseverenceItems_withUniqueIds() {
    // Arrange
    const stressPerseverenceItems = perseverences;

    // Act
    const duplicates = ObjectHelper.hasDuplicates(stressPerseverenceItems)

    // Assert
    assert.strictEqual(duplicates, false);
  }
}