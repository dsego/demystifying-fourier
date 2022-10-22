const sinusoid = (frequency, phase=0, amplitude=1) => (
  (time) => amplitude * Math.sin(2 * Math.PI * frequency * time + phase)
)

const combine = (...sinusoids) => (
  (time) => sinusoids.reduce((res, s) => res + s(time), 0)
)
