import { useRef } from "react";

const sigmoidBounce = (x, { bounce, bouncePeak }) => {
  bounce = bounce || 0;
  bouncePeak = bouncePeak || 0.75;

  const bouncePeakMultiplier = 1 / (1 - bouncePeak);

  const sig = 1 / (1 + Math.pow(1500, -(2 * Math.min(1, x / bouncePeak) - 1)));
  const spike = Math.max(
    0,
    -bounce * Math.pow((x - bouncePeak) * bouncePeakMultiplier, 2) + bounce
  );
  return sig + spike;
};

const useTransition = (initialValue, setValue) => {
  const fromValue = useRef(initialValue);
  const toValue = useRef(initialValue);
  const transitionStart = useRef(Date.now()); //miliseconds since 1970
  const transitionDuration = useRef(0); //miliseconds
  const internalValue = useRef(initialValue);

  const interval = useRef(null);

  const endAnimation = () => {
    setValue(toValue.current);
    internalValue.current = toValue.current;
    fromValue.current = toValue.current;

    clearInterval(interval.current);
  };

  const animate = ({ to, duration, fps, bounce, bouncePeak }) => {
    endAnimation();

    toValue.current = to;
    transitionDuration.current = duration;
    transitionStart.current = Date.now();

    interval.current = setInterval(() => {
      if (Date.now() > transitionStart.current + transitionDuration.current) {
        endAnimation();
      } else {
        const change = toValue.current - fromValue.current;

        const progress = sigmoidBounce(
          (Date.now() - transitionStart.current) / transitionDuration.current,
          {
            bounce,
            bouncePeak
          }
        );
        const newValue = fromValue.current + change * progress;

        if (
          (internalValue.current - fromValue.current) / change > 1 &&
          progress < 1
        ) {
          endAnimation();
        } else {
          console.log(progress);

          internalValue.current = newValue;
          setValue(newValue);
        }
      }
    }, 1000 / fps || 60);
  };
  const getValue = () => internalValue.current;

  return { animate, getValue };
};

export default useTransition;
