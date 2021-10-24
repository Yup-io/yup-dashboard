import React, { useEffect, useRef } from 'react';
import { useSubheader } from '../../_metronic/layout';
import * as d3 from 'd3';
import { useViewport } from '../provider/ViewPortProvider';

const pageStyle = {
  h2: {
    paddingTop: '2rem',
    paddingBottom: '1rem',
    textAlign: 'center',
  },
  pSubHeading: {
    marginTop: '-1rem',
    fontSize: '0.67rem',
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
};

const AreaChartComp = props => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (props.csv && d3Container.current) {
      if (d3Container.current != null) {
        d3Container.current.innerHTML = '';
      }

      const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = props.svgWidth - margin.left - margin.right,
        height = props.svgHeight - margin.top - margin.bottom;

      const svg = d3
        .select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      d3.csv(
        props.csv,

        d => {
          return {
            date: d3.timeParse('%Y-%m-%d')(d.date),
            value: d.value,
          };
        },
      ).then(function(data) {
        const x = d3
          .scaleTime()
          .domain(d3.extent(data, d => d.date))
          .range([0, width]);
        const xAxis = svg
          .append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, d => +d.value)])
          .range([height, 0]);
        svg.append('g').call(d3.axisLeft(y));

        svg
          .append('defs')
          .append('clipPath')
          .attr('id', 'clip')
          .append('rect')
          .attr('width', width)
          .attr('height', height)
          .attr('x', 0)
          .attr('y', 0);

        const brush = d3
          .brushX()
          .extent([
            [0, 0],
            [width, height],
          ])
          .on('end', updateChart);

        const area = svg.append('g').attr('clip-path', 'url(#clip)');

        const areaGenerator = d3
          .area()
          .x(d => x(d.date))
          .y0(y(0))
          .y1(d => y(d.value));

        area
          .append('path')
          .datum(data)
          .attr('class', 'myArea') // I add the class myArea to be able to modify it later on.
          .attr('fill', '#222')
          .attr('fill-opacity', 0.3)
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('d', areaGenerator);

        area
          .append('g')
          .attr('class', 'brush')
          .call(brush);

        let idleTimeout;
        function idled() {
          idleTimeout = null;
        }

        function updateChart(event) {
          const extent = event.selection;

          if (!extent) {
            if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
            x.domain([4, 8]);
          } else {
            x.domain([x.invert(extent[0]), x.invert(extent[1])]);
            area.select('.brush').call(brush.move, null);
          }

          // Update axis and area position
          xAxis
            .transition()
            .duration(1000)
            .call(d3.axisBottom(x));
          area
            .select('.myArea')
            .transition()
            .duration(1000)
            .attr('d', areaGenerator);
        }

        svg.on('dblclick', function() {
          x.domain(d3.extent(data, d => d.date));
          xAxis.transition().call(d3.axisBottom(x));
          area
            .select('.myArea')
            .transition()
            .attr('d', areaGenerator);
        });
      });
    }
  }, [props.csv, props.svgWidth, props.svgHeight]);

  return <div style={pageStyle.chart} className="d3-component" ref={d3Container} />;
};

const subHeadingtext = `Select to Zoom. DbClick to reset.`;

export default () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle('📊 Yup Live - Emissions');

  const { width } = useViewport();
  const initWitdh = useRef(450);
  const initHeight = useRef(320);

  useEffect(() => {
    const breakpoints = {
      sm: width < 640,
      md: width < 768,
      lg: width < 1024,
      xl: width < 1280,
    };

    initWitdh.current = breakpoints.sm
      ? 450
      : breakpoints.md
      ? 550
      : breakpoints.lg
      ? 650
      : breakpoints.xl
      ? 900
      : 1100;
    initHeight.current = breakpoints.sm
      ? 220
      : breakpoints.md
      ? 200
      : breakpoints.lg
      ? 300
      : breakpoints.lg
      ? 400
      : 600;
  }, [width]);

  return (
    <>
      <div className="row">
        <div className="col-lg-12 col-xxl-12 card card-custom card-stretch gutter-b">
          <h2 style={pageStyle.h2}>Yup Phase one emissions:</h2>
          <p style={pageStyle.pSubHeading}>{subHeadingtext}</p>
          <AreaChartComp
            svgWidth={initWitdh.current}
            svgHeight={initHeight.current}
            csv={'/data/emissions/phase-one.csv'}
          />
          <h2 style={pageStyle.h2}>Yup Phase two emissions:</h2>
          <p style={pageStyle.pSubHeading}>{subHeadingtext}</p>
          <AreaChartComp
            svgWidth={initWitdh.current}
            svgHeight={initHeight.current}
            csv={'/data/emissions/phase-two.csv'}
          />
          <h2 style={pageStyle.h2}>Yup Phase three emissions:</h2>
          <h2 style={pageStyle.h2}>Fixed inflation 10k YUP daily</h2>
        </div>
      </div>
    </>
  );
};
