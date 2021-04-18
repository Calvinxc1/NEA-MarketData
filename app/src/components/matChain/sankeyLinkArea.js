import * as d3 from 'd3';

const calcScale = (link) => link.mat_needs / link.source.output_target

const sankeyLinkArea = (link) => {
  if(link.mat_type_name === 'Megacyte') {
    console.log(link);
  }

  const areaGenerator = d3.area()
    .x((d) => d.x)
    .y0((d) => d.low)
    .y1((d) => d.high)
    .curve(d3.curveBumpX);

  const startScale = link.source.sourceLinks.filter((e) => e.y0 < link.y0)
    .map(calcScale)
    .reduce((a,b) => a+b, 0);

  const endScale = startScale + calcScale(link);
  const scaleRange = link.source.y1 - link.source.y0;

  const points = [
    {x: link.source.x1, low: link.source.y0 + (startScale * scaleRange), high: link.source.y0 + (endScale * scaleRange)},
    {x: link.target.x0, low: link.y1 - (link.width / 2), high: link.y1 + (link.width / 2)},
  ];

  const pathData = areaGenerator(points);
  return pathData;
};

export default sankeyLinkArea;
