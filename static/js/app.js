const color = d3.scaleOrdinal()
  .range(d3.schemeDark2)

function responsivefy(svg) {
  const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width'), 10),
      height = parseInt(svg.style('height'), 10),
      aspect = width / height;

  svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);

  d3.select(window).on(
      'resize.' + container.attr('id'),
      resize
  );

  function resize() {
      const w = parseInt(container.style('width'));
      svg.attr('width', w);
      svg.attr('height', Math.round(w / aspect));
  }
}

d3.json('/api/sexism').then(data => {

  function plotAllTraining() {

    // training-data
    let divSource = d3.select("#source")
    let divEdited = d3.select("#edited")
    let divSexist = d3.select("#sexist")

    // training data sources
    let sources = [...new Set(data.map(d => d.dataset))]
    let sourcesData = sources.map(d => ({source: d, value: data.filter(e => e.dataset === d).length}))
    sourcesData = sourcesData.sort((a,b)=>b.value-a.value)
    let widthSource = 500
    let heightSource = 350
    let marginSource = {top: 10, left: 40, bottom: 20, right: 10}
    let iwidthSource = widthSource-marginSource.left-marginSource.right
    let iheightSource = heightSource-marginSource.top-marginSource.bottom
    let gSource = divSource.append('svg')
      .attr('width', widthSource)
      .attr('height', heightSource)
      .call(responsivefy)
      .append('g')
      .attr('transform', `translate(${marginSource.left}, ${marginSource.top})`)
    let sourcesX = d3.scaleBand().range([0, iwidthSource]).domain(sourcesData.map(d => d.source)).padding(0.1)
    let sourcesY = d3.scaleLinear().range([iheightSource, 0]).domain([0, d3.max(sourcesData, d => d.value)])
    gSource.selectAll(".bar")
      .data(sourcesData)
      .join("rect")
      .attr("class", "bar")
      .attr('fill', d => color(d.source))
      .attr("stroke", "black")
      .style("stroke-width", "1px")
      .attr("x", d => sourcesX(d.source))
      .attr("width", sourcesX.bandwidth())
      .attr("y", d => sourcesY(d.value))
      .attr("height", d => iheightSource - sourcesY(d.value));
    gSource.append('g').call(d3.axisLeft(sourcesY))
    gSource.append('g').attr('transform', `translate(0, ${iheightSource})`).call(d3.axisBottom(sourcesX))

    let pie = d3.pie()
      .value(d=>d[1])

    // training data edits
    let widthEdits = 500
    let heightEdits = 350
    let marginEdits = 30
    let svgEdits = divEdited.append('svg').attr('width', widthEdits).attr('height', heightEdits).call(responsivefy)
    let gEdits = svgEdits.append('g').attr('transform', `translate(${widthEdits/2},${heightEdits/2})`)
    let radiusEdits = widthEdits / 2 - marginEdits*2

    let arcEdits = d3.arc()
      .innerRadius(radiusEdits * 0.3)
      .outerRadius(radiusEdits * 0.6)

    let outerArcEdits = d3.arc()
      .innerRadius(radiusEdits * 0.7)
      .outerRadius(radiusEdits * 0.7)

    let dataEdits = {
      'Original': data.filter(d => d.of_id === -1).length,
      'Edited': data.filter(d => d.of_id !== -1).length
    }


    let dataEdits_ready = pie(Object.entries(dataEdits))

    gEdits.selectAll('whatever')
      .data(dataEdits_ready)
      .join('path')
      .attr('d', arcEdits)
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "black")
      .style("stroke-width", "2px")

    gEdits.selectAll('allPolylines')
      .data(dataEdits_ready.filter(d => d.value > 0))
      .join('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
          let posA = arcEdits.centroid(d)
          let posB = outerArcEdits.centroid(d)
          let posC = outerArcEdits.centroid(d);
          let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          posC[0] = radiusEdits * 0.7 * (midangle < Math.PI ? 1 : -1);
          return [posA, posB, posC]
        })

    gEdits.selectAll('allLabels')
      .data(dataEdits_ready.filter(d => d.value > 0))
      .join('text')
        .text(d => d.data[0])
        .attr('transform', function(d) {
            let pos = outerArcEdits.centroid(d);
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radiusEdits * 0.73 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function(d) {
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })

    gEdits.selectAll('allLabels')
      .data(dataEdits_ready.filter(d => d.value > 0))
      .join('text')
        .text(d => d3.format('.0%')(d.value/data.length))
        .attr('dy', 16)
        .attr('transform', function(d) {
            let pos = outerArcEdits.centroid(d);
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radiusEdits * 0.73 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function(d) {
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })

    // training data sexist
    let widthSexist = 500
    let heightSexist = 350
    let marginSexist = 30
    let svgSexist = divSexist.append('svg').attr('width', widthSexist).attr('height', heightSexist).call(responsivefy)
    let gSexist = svgSexist.append('g').attr('transform', `translate(${widthSexist/2},${heightSexist/2})`)
    let radiusSexist = widthSexist / 2 - marginSexist*2

    let arcSexist = d3.arc()
      .innerRadius(radiusSexist * 0.3)
      .outerRadius(radiusSexist * 0.6)

    let outerArcSexist = d3.arc()
      .innerRadius(radiusSexist * 0.7)
      .outerRadius(radiusSexist * 0.7)

    let dataSexist = {
      'Sexist': data.filter(d => d.sexist).length,
      'Not Sexist': data.filter(d => !d.sexist).length
    }

    let dataSexist_ready = pie(Object.entries(dataSexist))

    gSexist.selectAll('whatever')
      .data(dataSexist_ready)
      .join('path')
      .attr('d', arcSexist)
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "black")
      .style("stroke-width", "2px")

    gSexist.selectAll('allPolylines')
      .data(dataSexist_ready.filter(d => d.value > 0))
      .join('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
          let posA = arcSexist.centroid(d)
          let posB = outerArcSexist.centroid(d)
          let posC = outerArcSexist.centroid(d);
          let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          posC[0] = radiusSexist * 0.7 * (midangle < Math.PI ? 1 : -1);
          return [posA, posB, posC]
        })

    gSexist.selectAll('allLabels')
      .data(dataSexist_ready.filter(d => d.value > 0))
      .join('text')
        .text(d => d.data[0])
        .attr('transform', function(d) {
            let pos = outerArcSexist.centroid(d);
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radiusSexist * 0.73 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function(d) {
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })

    gSexist.selectAll('allLabels')
      .data(dataSexist_ready.filter(d => d.value > 0))
      .join('text')
        .text(d => d3.format('.0%')(d.value/data.length))
        .attr('dy', 16)
        .attr('transform', function(d) {
            let pos = outerArcSexist.centroid(d);
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radiusSexist * 0.73 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function(d) {
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })
  }
  plotAllTraining()
})

d3.json('/api/redditcomments').then(data => {

  function plotAllReddit() {
    let divPredictions = d3.select('#predictions')
    let widthPredictions = 500
    let heightPredictions = 350
    let marginPredictions = {top: 40, left: 100, bottom: 10, right: 20}
    let iwidthPredictions = widthPredictions-marginPredictions.left-marginPredictions.right
    let iheightPredictions = heightPredictions-marginPredictions.top-marginPredictions.bottom
    let gPredictions = divPredictions.append('svg')
      .attr('width', widthPredictions)
      .attr('height', heightPredictions)
      .call(responsivefy)
      .append('g')
      .attr('transform', `translate(${marginPredictions.left},${marginPredictions.top})`)
    let keys = ['Sexist', 'Not Sexist']
    let subreddits = [... new Set(data.map(d => d.subreddit))]
    let dataPredictions = subreddits.map(s => {
      return ({
                subreddit: s,
                'Sexist': data.filter(d => d.subreddit === s && d.prediction > 0.5).length,
                'Not Sexist': data.filter(d => d.subreddit === s && d.prediction <= 0.5).length,
                total: data.filter(d => d.subreddit === s).length
              })
    })
    dataPredictions.sort((a,b)=>b.total-a.total)
    let y = d3.scaleBand()
      .rangeRound([0, iheightPredictions])
      .paddingInner(0.05)
      .align(0.1)
      .domain(dataPredictions.map(d => d.subreddit));

    let x = d3.scaleLinear()
      .rangeRound([0, iwidthPredictions])
      .domain([0, d3.max(dataPredictions, d => d.total)])
      .nice();

    gPredictions.selectAll("g")
      .data(d3.stack().keys(keys)(dataPredictions))
      .join("g")
        .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("y", d => y(d.data.subreddit))
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth());
    gPredictions.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    gPredictions.append("g")
      .attr("class", "axis")
      .call(d3.axisTop(x).ticks(null, "~s"))

    let legendPredictions = gPredictions.selectAll('legend')
      .data(keys)
      .join('g')
      .attr('transform', (d,i) => `translate(${iwidthPredictions-70},${iheightPredictions - 15 -  (30*i)})`)

    legendPredictions.append('rect').attr('fill', d => color(d)).attr('width', 15).attr('height', 15)
    legendPredictions.append('text').text(d => d).attr('dx', 20).attr('dy', 12).style('font-size', '.8rem')

    let divVotes = d3.select('#votes')
    let widthVotes = 500
    let heightVotes = 350
    let marginVotes = {top: 40, left: 100, bottom: 10, right: 20}
    let iwidthVotes = widthVotes-marginVotes.left-marginVotes.right
    let iheightVotes = heightVotes-marginVotes.top-marginVotes.bottom
    let gVotes = divVotes.append('svg')
      .attr('width', widthVotes)
      .attr('height', heightVotes)
      .call(responsivefy)
      .append('g')
      .attr('transform', `translate(${marginVotes.left},${marginVotes.top})`)
    let dataVotes = subreddits.map(s => {
      return ({
                subreddit: s,
                'Sexist': data.filter(d => d.subreddit === s && d.votes.filter(e => e).length > d.votes.filter(e => !e).length).length,
                'Not Sexist': data.filter(d => d.subreddit === s && d.votes.filter(e => e).length < d.votes.filter(e => !e).length).length,
                total: data.filter(d => d.subreddit === s).length
              })
    })
    dataVotes.sort((a,b)=>b.total-a.total)
    let y2 = d3.scaleBand()
      .rangeRound([0, iheightVotes])
      .paddingInner(0.05)
      .align(0.1)
      .domain(dataVotes.map(d => d.subreddit));

    let x2 = d3.scaleLinear()
      .rangeRound([0, iwidthVotes])
      .domain([0, d3.max(dataVotes, d => d.total)])
      .nice();

    gVotes.selectAll("g")
      .data(d3.stack().keys(keys)(dataVotes))
      .join("g")
        .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("y", d => y2(d.data.subreddit))
        .attr("x", d => x2(d[0]))
        .attr("width", d => x2(d[1]) - x2(d[0]))
        .attr("height", y2.bandwidth());
    gVotes.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y2));

    gVotes.append("g")
      .attr("class", "axis")
      .call(d3.axisTop(x2).ticks(null, "~s"))

    let legendVotes = gVotes.selectAll('legend')
      .data(keys)
      .join('g')
      .attr('transform', (d,i) => `translate(${iwidthVotes-70},${iheightVotes - 15 -  (30*i)})`)

    legendVotes.append('rect').attr('fill', d => color(d)).attr('width', 15).attr('height', 15)
    legendVotes.append('text').text(d => d).attr('dx', 20).attr('dy', 12).style('font-size', '.8rem')

  }
  plotAllReddit()
})
