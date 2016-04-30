import { IterableDiffers } from './differs/iterable_differs';
import { DefaultIterableDifferFactory } from './differs/default_iterable_differ';
import { KeyValueDiffers } from './differs/keyvalue_differs';
import { DefaultKeyValueDifferFactory } from './differs/default_keyvalue_differ';
export { DefaultKeyValueDifferFactory, KeyValueChangeRecord } from './differs/default_keyvalue_differ';
export { DefaultIterableDifferFactory, CollectionChangeRecord } from './differs/default_iterable_differ';
export { ChangeDetectionStrategy, CHANGE_DETECTION_STRATEGY_VALUES, ChangeDetectorState, CHANGE_DETECTOR_STATE_VALUES, isDefaultChangeDetectionStrategy } from './constants';
export { ChangeDetectorRef } from './change_detector_ref';
export { IterableDiffers } from './differs/iterable_differs';
export { KeyValueDiffers } from './differs/keyvalue_differs';
export { WrappedValue, ValueUnwrapper, SimpleChange, devModeEqual, looseIdentical, uninitialized } from './change_detection_util';
/**
 * Structural diffing for `Object`s and `Map`s.
 */
export const keyValDiff = 
/*@ts2dart_const*/ [new DefaultKeyValueDifferFactory()];
/**
 * Structural diffing for `Iterable` types such as `Array`s.
 */
export const iterableDiff = 
/*@ts2dart_const*/ [new DefaultIterableDifferFactory()];
export const defaultIterableDiffers = new IterableDiffers(iterableDiff);
export const defaultKeyValueDiffers = new KeyValueDiffers(keyValDiff);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgteTgxYTY0UVcudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLGVBQWUsRUFBd0IsTUFBTSw0QkFBNEI7T0FDMUUsRUFBQyw0QkFBNEIsRUFBQyxNQUFNLG1DQUFtQztPQUN2RSxFQUFDLGVBQWUsRUFBd0IsTUFBTSw0QkFBNEI7T0FDMUUsRUFDTCw0QkFBNEIsRUFFN0IsTUFBTSxtQ0FBbUM7QUFFMUMsU0FDRSw0QkFBNEIsRUFDNUIsb0JBQW9CLFFBQ2YsbUNBQW1DLENBQUM7QUFDM0MsU0FDRSw0QkFBNEIsRUFDNUIsc0JBQXNCLFFBQ2pCLG1DQUFtQyxDQUFDO0FBRTNDLFNBQ0UsdUJBQXVCLEVBQ3ZCLGdDQUFnQyxFQUNoQyxtQkFBbUIsRUFDbkIsNEJBQTRCLEVBQzVCLGdDQUFnQyxRQUMzQixhQUFhLENBQUM7QUFDckIsU0FBUSxpQkFBaUIsUUFBTyx1QkFBdUIsQ0FBQztBQUN4RCxTQUNFLGVBQWUsUUFJViw0QkFBNEIsQ0FBQztBQUNwQyxTQUFRLGVBQWUsUUFBOEMsNEJBQTRCLENBQUM7QUFHbEcsU0FDRSxZQUFZLEVBQ1osY0FBYyxFQUNkLFlBQVksRUFDWixZQUFZLEVBQ1osY0FBYyxFQUNkLGFBQWEsUUFDUix5QkFBeUIsQ0FBQztBQUVqQzs7R0FFRztBQUNILE9BQU8sTUFBTSxVQUFVO0FBQ25CLGtCQUFrQixDQUFBLENBQUMsSUFBSSw0QkFBNEIsRUFBRSxDQUFDLENBQUM7QUFFM0Q7O0dBRUc7QUFDSCxPQUFPLE1BQU0sWUFBWTtBQUNyQixrQkFBa0IsQ0FBQSxDQUFDLElBQUksNEJBQTRCLEVBQUUsQ0FBQyxDQUFDO0FBRTNELE9BQU8sTUFBTSxzQkFBc0IsR0FBc0IsSUFBSSxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFM0YsT0FBTyxNQUFNLHNCQUFzQixHQUFzQixJQUFJLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SXRlcmFibGVEaWZmZXJzLCBJdGVyYWJsZURpZmZlckZhY3Rvcnl9IGZyb20gJy4vZGlmZmVycy9pdGVyYWJsZV9kaWZmZXJzJztcbmltcG9ydCB7RGVmYXVsdEl0ZXJhYmxlRGlmZmVyRmFjdG9yeX0gZnJvbSAnLi9kaWZmZXJzL2RlZmF1bHRfaXRlcmFibGVfZGlmZmVyJztcbmltcG9ydCB7S2V5VmFsdWVEaWZmZXJzLCBLZXlWYWx1ZURpZmZlckZhY3Rvcnl9IGZyb20gJy4vZGlmZmVycy9rZXl2YWx1ZV9kaWZmZXJzJztcbmltcG9ydCB7XG4gIERlZmF1bHRLZXlWYWx1ZURpZmZlckZhY3RvcnksXG4gIEtleVZhbHVlQ2hhbmdlUmVjb3JkXG59IGZyb20gJy4vZGlmZmVycy9kZWZhdWx0X2tleXZhbHVlX2RpZmZlcic7XG5cbmV4cG9ydCB7XG4gIERlZmF1bHRLZXlWYWx1ZURpZmZlckZhY3RvcnksXG4gIEtleVZhbHVlQ2hhbmdlUmVjb3JkXG59IGZyb20gJy4vZGlmZmVycy9kZWZhdWx0X2tleXZhbHVlX2RpZmZlcic7XG5leHBvcnQge1xuICBEZWZhdWx0SXRlcmFibGVEaWZmZXJGYWN0b3J5LFxuICBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkXG59IGZyb20gJy4vZGlmZmVycy9kZWZhdWx0X2l0ZXJhYmxlX2RpZmZlcic7XG5cbmV4cG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDSEFOR0VfREVURUNUSU9OX1NUUkFURUdZX1ZBTFVFUyxcbiAgQ2hhbmdlRGV0ZWN0b3JTdGF0ZSxcbiAgQ0hBTkdFX0RFVEVDVE9SX1NUQVRFX1ZBTFVFUyxcbiAgaXNEZWZhdWx0Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lcbn0gZnJvbSAnLi9jb25zdGFudHMnO1xuZXhwb3J0IHtDaGFuZ2VEZXRlY3RvclJlZn0gZnJvbSAnLi9jaGFuZ2VfZGV0ZWN0b3JfcmVmJztcbmV4cG9ydCB7XG4gIEl0ZXJhYmxlRGlmZmVycyxcbiAgSXRlcmFibGVEaWZmZXIsXG4gIEl0ZXJhYmxlRGlmZmVyRmFjdG9yeSxcbiAgVHJhY2tCeUZuXG59IGZyb20gJy4vZGlmZmVycy9pdGVyYWJsZV9kaWZmZXJzJztcbmV4cG9ydCB7S2V5VmFsdWVEaWZmZXJzLCBLZXlWYWx1ZURpZmZlciwgS2V5VmFsdWVEaWZmZXJGYWN0b3J5fSBmcm9tICcuL2RpZmZlcnMva2V5dmFsdWVfZGlmZmVycyc7XG5leHBvcnQge1BpcGVUcmFuc2Zvcm19IGZyb20gJy4vcGlwZV90cmFuc2Zvcm0nO1xuXG5leHBvcnQge1xuICBXcmFwcGVkVmFsdWUsXG4gIFZhbHVlVW53cmFwcGVyLFxuICBTaW1wbGVDaGFuZ2UsXG4gIGRldk1vZGVFcXVhbCxcbiAgbG9vc2VJZGVudGljYWwsXG4gIHVuaW5pdGlhbGl6ZWRcbn0gZnJvbSAnLi9jaGFuZ2VfZGV0ZWN0aW9uX3V0aWwnO1xuXG4vKipcbiAqIFN0cnVjdHVyYWwgZGlmZmluZyBmb3IgYE9iamVjdGBzIGFuZCBgTWFwYHMuXG4gKi9cbmV4cG9ydCBjb25zdCBrZXlWYWxEaWZmOiBLZXlWYWx1ZURpZmZlckZhY3RvcnlbXSA9XG4gICAgLypAdHMyZGFydF9jb25zdCovW25ldyBEZWZhdWx0S2V5VmFsdWVEaWZmZXJGYWN0b3J5KCldO1xuXG4vKipcbiAqIFN0cnVjdHVyYWwgZGlmZmluZyBmb3IgYEl0ZXJhYmxlYCB0eXBlcyBzdWNoIGFzIGBBcnJheWBzLlxuICovXG5leHBvcnQgY29uc3QgaXRlcmFibGVEaWZmOiBJdGVyYWJsZURpZmZlckZhY3RvcnlbXSA9XG4gICAgLypAdHMyZGFydF9jb25zdCovW25ldyBEZWZhdWx0SXRlcmFibGVEaWZmZXJGYWN0b3J5KCldO1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdEl0ZXJhYmxlRGlmZmVycyA9IC8qQHRzMmRhcnRfY29uc3QqLyBuZXcgSXRlcmFibGVEaWZmZXJzKGl0ZXJhYmxlRGlmZik7XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0S2V5VmFsdWVEaWZmZXJzID0gLypAdHMyZGFydF9jb25zdCovIG5ldyBLZXlWYWx1ZURpZmZlcnMoa2V5VmFsRGlmZik7XG4iXX0=