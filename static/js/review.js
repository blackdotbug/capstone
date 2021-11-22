
const score = d3.select(".score p").html()
d3.select(".score").html(`${d3.format('.3p')(score)} likelihood this comment is sexist according to the model.`)

const div = d3.select(".votes_viz")
const dim = 550
const svg = div.append('svg').attr('width', dim).attr('height', dim)
const margin = 30
svg.append('text').text('Votes').attr('transform', 'translate(40,40)').style('font-weight', 400).style('font-size', '1.5rem')
const g = svg.append('g').attr('transform', `translate(${dim/2},${dim/2 - margin*2})`)
const radius = dim / 2 - margin*2

const data = {
  'Not Sexist': votes.filter(d => d === "False").length,
  'Sexist': votes.filter(d => d === "True").length
}

const pie = d3.pie()
  .value(d=>d[1])

const data_ready = pie(Object.entries(data))

const color = d3.scaleOrdinal()
  .range(d3.schemeDark2)

const arc = d3.arc()
  .innerRadius(radius * 0.3)
  .outerRadius(radius * 0.6)

const outerArc = d3.arc()
  .innerRadius(radius * 0.7)
  .outerRadius(radius * 0.7)

g.selectAll('whatever')
  .data(data_ready)
  .join('path')
  .attr('d', arc)
  .attr('fill', d => color(d.data[0]))
  .attr("stroke", "black")
  .style("stroke-width", "2px")

g.selectAll('allPolylines')
  .data(data_ready.filter(d => d.value > 0))
  .join('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      const posA = arc.centroid(d)
      const posB = outerArc.centroid(d)
      const posC = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      posC[0] = radius * 0.7 * (midangle < Math.PI ? 1 : -1); 
      return [posA, posB, posC]
    })

g.selectAll('allLabels')
  .data(data_ready.filter(d => d.value > 0))
  .join('text')
    .text(d => d.data[0])
    .attr('transform', function(d) {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.73 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
    })
    .style('text-anchor', function(d) {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })

g.selectAll('allLabels')
  .data(data_ready.filter(d => d.value > 0))
  .join('text')
    .text(d => d3.format('.0%')(d.value/votes.length))
    .attr('dy', 16)
    .attr('transform', function(d) {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.73 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
    })
    .style('text-anchor', function(d) {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })
