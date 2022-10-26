const sinusoid = (frequency, phase=0, amplitude=1) => (
  (time) => amplitude * Math.sin(2 * Math.PI * frequency * time + phase)
)

const combine = (...sinusoids) => (
  (time) => sinusoids.reduce((res, s) => res + s(time), 0)
)

const color = d3.scaleQuantize().domain([0, 5]).range(['#B0BEC5', '#FFE0B2'])

const createSignalPlot = () => {
  const width = 800
  const height = 300
  const svg = d3.create('svg')
  svg
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])

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


const createMeter = () => {
  const width = 300
  const height = 50
  const svg = d3.create('svg')
  svg
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])

  const y = d3.scaleLinear().domain([0, 60]).range([height, 0])

  svg.append('g').call(d3.axisLeft(y))

  const bar = svg.append('rect')
    .attr('x', 5)
    .attr('width', 5)
    .attr('fill', '')

  return {
    svg,
    update: (value) => {
      bar
        .attr('y', d => y(value))
        .attr('height', d => y(0) - y(value))
        .attr('fill', color(Math.abs(value)))
    }
  }
}



const createUnitCircle = () => {
  const width = 300
  const height = 300
  const svg = d3.create('svg')
  svg
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])

  const x = d3.scaleLinear().domain([-70, 70]).range([0, width])
  const y = d3.scaleLinear().domain([70, -70]).range([0, height])

  svg.append('ellipse')
    .attr('cx', x(0))
    .attr('cy', y(0))
    .attr('rx', x(50) - x(0))
    .attr('ry', y(0) - y(50))
    .attr('fill', 'none')
    .attr('stroke', '#B0BEC5')

  svg.append('g')
    .attr('transform', 'translate('+[0, y(0)]+')')
    .call(d3.axisBottom(x))
    // .append('text')
    //   .text('cos')
    //   .attr('x', x(1))
    //   .attr('dy', -6)

  svg.append('g')
    .attr('transform', 'translate('+[x(0), 0]+')')
    .call(d3.axisLeft(y))
    // .append('text')
    //   .text('sin')
    //   .attr('transform', 'rotate(-90)')
    //   .attr('y', 15)

  const cosBar = svg.append('line')
    .attr('x1', x(0))
    .attr('y1', y(0))
    .attr('y2', y(0))
    .attr('stroke-width', 3)
    .attr('stroke', '#FFB74D')

  const sinBar = svg.append('line')
    .attr('stroke-width', 3)
    .attr('stroke', '#FFB74D')
    .attr('x1', x(0))
    .attr('y1', y(0))
    .attr('x2', x(0))

  const distance = svg.append('line')
    .attr('stroke-width', 1)
    .attr('stroke', '#FFB74D')
    .attr('x1', x(0))
    .attr('y1', y(0))

  const update = (cos, sin) => {
    cosBar.attr('x2', x(cos))
    sinBar.attr('y2', y(sin))
    distance.attr('x2', x(cos)).attr('y2', y(sin))
  }

  return {
    svg,
    update
  }
}


// // plane.body.selectAll('.axis .tick')
// //   .filter(function (d) { return d === 0 })
// //   .remove()

// // https://materialui.co/colors/





