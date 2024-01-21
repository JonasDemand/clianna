import { DependencyList, useEffect, useRef } from 'react';

const useEffectOnce = (
  effect: () => boolean,
  deps: DependencyList | undefined
) => {
  const called = useRef(false);

  useEffect(() => {
    if (!called.current) called.current = effect();
  }, deps);
};

export default useEffectOnce;
