export class ObjectHelper {
  /**
   * Deep copy function for TypeScript.
   * @param T Generic type of target/copied value.
   * @param target Target value to be copied.
   * @see Source project, ts-deeply https://github.com/ykdr2017/ts-deepcopy
   * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
   */
  public static deepCopy = <T>(target: T): T => {
    if (target === null) {
      return target;
    }
    if (target instanceof Date) {
      return new Date(target.getTime()) as any;
    }
    if (target instanceof Array) {
      const cp = [] as any[];
      (target as any[]).forEach(v => {
        cp.push(v);
      });
      return cp.map((n: any) => ObjectHelper.deepCopy<any>(n)) as any;
    }
    if (typeof target === 'object' && target !== {}) {
      const cp = { ...(target as { [key: string]: any }) } as { [key: string]: any };
      Object.keys(cp).forEach(k => {
        cp[k] = ObjectHelper.deepCopy<any>(cp[k]);
      });
      return cp as T;
    }
    return target;
  };

  public static hasDuplicates(array: ItemBase[]) {
    var valuesSoFar = Object.create(null);

    for (var i = 0; i < array.length; ++i) {
      var stressItem = array[i];
      if (stressItem.id in valuesSoFar) {
        return true;
      }
      valuesSoFar[stressItem.id] = true;
    }
    return false;
  }
}
