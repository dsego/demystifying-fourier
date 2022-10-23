const sinusoid = (frequency, phase=0, amplitude=1) => (
  (time) => amplitude * Math.sin(2 * Math.PI * frequency * time + phase)
)

const combine = (...sinusoids) => (
  (time) => sinusoids.reduce((res, s) => res + s(time), 0)
)

const createPlot = () => {
  const width = 800
  const height = 300
  const svg = d3.create('svg')
  svg.attr('viewBox', [0, 0, width, height])

  const targetPath = svg.insert('path', 'g')
    .attr('transform', `translate(0, 30)`)
    .attr('fill', 'none')
    .attr('stroke', '#29B6F6')
    .attr('stroke-width', 3)

  const sinePath = svg.insert('path', 'g')
    .attr('transform', `translate(0, 90)`)
    .attr('fill', 'none')
    .attr('stroke', '#E91E63')
    .attr('stroke-width', 1.5)

  const cosinePath = svg.insert('path', 'g')
    .attr('transform', `translate(0, 90)`)
    .attr('fill', 'none')
    .attr('stroke', '#E91E63')
    .attr('stroke-width', 1.5)

  const sineTransformPath = svg.insert('path', 'g')
    .attr('transform', `translate(0, 180)`)

  const cosineTransformPath = svg.insert('path', 'g')
    .attr('transform', `translate(0, 250)`)

  const range = d3.range(0, 1.01, 0.01)
  const x = d3.scaleLinear().domain([0, 1]).range([0, width])
  const y = d3.scaleLinear().domain([1, -1]).range([0, 50])
  const color = d3.scaleQuantize().domain([0, 5]).range(['#B0BEC5', '#FFE0B2'])
  const line = (func) => d3.line().curve(d3.curveNatural).x(x).y((t) => y(func(t)))
  const area = (func) => d3.area().curve(d3.curveNatural).x(x).y0(y(0)).y1((t) => y(func(t)))
  let result = [0, 0]

  return {
    svg,
    result: () => result,
    update: ({targetSignal, sine, cosine, sineTransform, cosineTransform}) => {
      result = [
        d3.fsum(range, (t) => sineTransform(t)),
        cosineTransform ? d3.fsum(range, (t) => cosineTransform(t)) : undefined,
      ]
      targetPath.attr('d', line(targetSignal)(range))
      sinePath.attr('d', line(sine)(range))
      if (cosine) {
        cosinePath.attr('d', line(cosine)(range))
      }
      sineTransformPath
        .attr('d', area(sineTransform)(range))
        .attr('fill', color(Math.abs(result[0])))
      if (cosineTransform) {
        cosineTransformPath
          .attr('d', area(cosineTransform)(range))
          .attr('fill', color(Math.abs(result[1])))
      }
    }
  }
}

// plane.body.append('ellipse')
//   .classed('unit-circle', true)
//   .attr('cx', plane.scale.x(0))
//   .attr('cy', plane.scale.y(0))
//   .attr('rx', plane.scale.x(1) - plane.scale.x(0))
//   .attr('ry', plane.scale.y(0) - plane.scale.y(1))

// plane.body.append('g')
//   .classed('axis x-axis', true)
//   .attr('transform', 'translate('+[0, plane.scale.y(0)]+')')
//   .call(d3.axisBottom(plane.scale.x).tickSize(0).tickValues([-1,1]))
//   .append('text').text('Re')
//       .attr('x', plane.width)
//       .attr('dy', -6)

// plane.body.append('g')
//   .classed('axis y-axis', true)
//   .attr('transform', 'translate('+[plane.scale.x(0), 0]+')')
//   .call(d3.axisLeft(plane.scale.y).tickSize(0).tickValues([-1,1]))
//   .append('text').text('Im')
//       .attr('transform', 'rotate(-90)')
//       .attr('y', 15)

// plane.body.selectAll('.axis .tick')
//   .filter(function (d) { return d === 0 })
//   .remove()

