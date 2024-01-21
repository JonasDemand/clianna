import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

const useDidMountEffect = (
  effect: EffectCallback,
  skipCalls: number | undefined = 1,
  deps: DependencyList | undefined
) => {
  const timesCalled = useRef(0);

  useEffect(() => {
    console.log(timesCalled, deps);
    if (timesCalled.current >= skipCalls) effect();
    else timesCalled.current = timesCalled.current + 1;
  }, deps);
};

export default useDidMountEffect;
