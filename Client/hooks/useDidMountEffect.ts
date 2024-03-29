import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

const useDidMountEffect = (
  effect: EffectCallback,
  skipCalls: number | undefined = 1,
  deps: DependencyList | undefined
) => {
  const timesCalled = useRef(0);

  useEffect(() => {
    if (
      timesCalled.current >=
      (process.env.NODE_ENV === 'development' ? skipCalls + 1 : skipCalls)
    )
      effect();
    else timesCalled.current = timesCalled.current + 1;
  }, deps);
};

export default useDidMountEffect;
