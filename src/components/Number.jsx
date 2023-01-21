import React from "react";
import { useSpring, animated } from "react-spring";

function Number({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    // deelay: 100,
    config: { mass: 1, tension: 20, friction: 10, duration: 1000 },
  });
  return (
    <animated.div>
      {number.to((n) => Math.floor(n).toLocaleString())}
    </animated.div>
  );
}

function NumberFloat({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    // deelay: 100,
    config: { mass: 1, tension: 20, friction: 10, duration: 1000 },
  });
  return <animated.div>{number.to((n) => n.toFixed(2))}</animated.div>;
}

export { Number, NumberFloat };
