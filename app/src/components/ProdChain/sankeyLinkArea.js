import * as d3 from 'd3';

const dotParse = (obj, path) => path.split('.').reduce((o, i) => o[i], obj);

const scaleParsing = (link, direction, scalePath) => {
  const scaler = link[direction][`${direction}Links`].reduce((p, c) => p + dotParse(c, scalePath), 0);
  const startScale = link[direction][`${direction}Links`].filter((e) => e.y0 < link.y0)
    .map((srcLink) => dotParse(srcLink, scalePath) / scaler)
    .reduce((a,b) => a+b, 0);

  const endScale = startScale + dotParse(link, scalePath) / scaler;
  const scaleRange = link[direction].y1 - link[direction].y0;

  return [startScale, endScale, scaleRange];
}

const sankeyLinkArea = (link, scalePath='units') => {
  const [sourceStartScale, sourceEndScale, sourceScaleRange] = scaleParsing(link, 'source', scalePath);
  const [targetStartScale, targetEndScale, targetScaleRange] = scaleParsing(link, 'target', scalePath);

  const points = [{
    x: link.source.x1,
    low: link.source.y0 + (sourceStartScale * sourceScaleRange),
    high: link.source.y0 + (sourceEndScale * sourceScaleRange),
  },{
    x: link.target.x0,
    low: link.target.y0 + (targetStartScale * targetScaleRange),
    high: link.target.y0 + (targetEndScale * targetScaleRange),
  }];

  const areaGenerator = d3.area()
    .x((d) => d.x)
    .y0((d) => d.low)
    .y1((d) => d.high)
    .curve(d3.curveBumpX);

  const pathData = areaGenerator(points);
  return pathData;
};

export default sankeyLinkArea;
