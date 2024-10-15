import React, { useEffect, useState, useRef } from 'react';
import {
  select,
  scaleLinear,
  arc,
  line,
  scaleSequential,
  interpolatePlasma,
} from 'd3';
import * as d3 from 'd3';
import {
  getPitchers,
  getBatters,
  getBattedBalls,
} from './api_calls/baseball_api_calls';
import './App.css';
import {
  Pitcher,
  Batter,
  BattedBall,
} from './interfaces/battedballs_interface';

interface LegendItem {
  label: string;
  color: string;
}

const App: React.FC = () => {
  const [pitchers, setPitchers] = useState<Pitcher[]>([]);
  const [selectedPitcher, setSelectedPitcher] = useState<string | null>(null);
  const [batters, setBatters] = useState<Batter[]>([]);
  const [selectedBatter, setSelectedBatter] = useState<string | null>(null);
  const [battedBalls, setBattedBalls] = useState<BattedBall[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const outcomeColors: { [key: string]: string } = {
    Out: '#FF0000',
    Single: '#00FF00',
    HomeRun: '#FFD700',
    Double: '#0000FF',
    Triple: '#FF69B4',
    Error: '#FFA500',
    Undefined: '#808080',
    Sacrifice: '#8A2BE2',
    FieldersChoice: '#A52A2A',
  };

  const legendItems: LegendItem[] = [
    { label: 'Out', color: outcomeColors['Out'] },
    { label: 'Single', color: outcomeColors['Single'] },
    { label: 'HomeRun', color: outcomeColors['HomeRun'] },
    { label: 'Double', color: outcomeColors['Double'] },
    { label: 'Triple', color: outcomeColors['Triple'] },
    { label: 'Error', color: outcomeColors['Error'] },
    { label: 'Undefined', color: outcomeColors['Undefined'] },
    { label: 'Sacrifice', color: outcomeColors['Sacrifice'] },
    { label: 'FieldersChoice', color: outcomeColors['FieldersChoice'] },
  ];

  useEffect(() => {
    const fetchPitchers = async () => {
      try {
        const fetchedPitchers = await getPitchers();
        setPitchers(fetchedPitchers);
      } catch (error) {
        console.error('Error fetching pitchers:', error);
      }
    };

    const fetchBatters = async () => {
      try {
        const fetchedBatters = await getBatters();
        setBatters(fetchedBatters);
      } catch (error) {
        console.error('Error fetching batters:', error);
      }
    };

    fetchPitchers();
    fetchBatters();
  }, []);

  const handlePitcherSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPitcher(event.target.value);
  };

  const handleBatterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBatter(event.target.value);
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    try {
      const fetchedBattedBalls = await getBattedBalls(
        selectedPitcher || undefined,
        selectedBatter || undefined
      );
      setBattedBalls(fetchedBattedBalls);
    } catch (error) {
      console.error('Error fetching batted balls:', error);
    }
  };

  // Draw the baseball field and plot data using D3
  useEffect(() => {
    if (battedBalls.length > 0 && svgRef.current) {
      const svg = select(svgRef.current);
      const tooltip = select(tooltipRef.current);

      // Clear previous plots
      svg.selectAll('*').remove();

      // Adjusted field dimensions
      const width = 800;
      const height = 800;
      const margin = 50;
      const radius = 400;

      // Define colors for the field
      const grassColor = '#6BA368'; // Green grass color
      const dirtColor = '#D2B48C'; // Tan dirt color

      // Adjusted scales
      const distanceScale = scaleLinear()
        .domain([0, 500]) // Max hit distance in feet
        .range([0, radius]);

      const angleScale = scaleLinear()
        .domain([-45, 45]) // Balls in play from -45 to 45 degrees
        .range([-Math.PI / 4, Math.PI / 4]); // Corresponds to -45 to +45 degrees in radians

      const homePlateX = width / 2;
      const homePlateY = height - margin;

      // Define gradient for outfield grass
      const defs = svg.append('defs');
      const gradient = defs
        .append('radialGradient')
        .attr('id', 'fieldGradient')
        .attr('cx', '50%')
        .attr('cy', '100%')
        .attr('r', '85%');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', grassColor);
      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', grassColor);

      // Outfield grass area
      const outfieldArc = arc<d3.DefaultArcObject>();
      const outfieldArcData: d3.DefaultArcObject = {
        innerRadius: 0,
        outerRadius: radius,
        startAngle: angleScale(-45),
        endAngle: angleScale(45),
      };

      svg
        .append('path')
        .attr('d', outfieldArc(outfieldArcData))
        .attr('fill', 'url(#fieldGradient)')
        .attr('transform', `translate(${homePlateX}, ${homePlateY})`);

      // Fence distances at specific angles
      const fenceDistances = [
        { angle: -45, distance: 335 },
        { angle: -22.5, distance: 375 },
        { angle: 0, distance: 400 },
        { angle: 22.5, distance: 375 },
        { angle: 45, distance: 325 },
      ];

      // Create a scale to interpolate fence distance based on angle
      const fenceDistanceScale = d3
        .scaleLinear()
        .domain(fenceDistances.map((d) => d.angle))
        .range(fenceDistances.map((d) => d.distance))
        .clamp(true);

      // Generate points along the fence with proper typing
      const fencePoints: [number, number][] = d3
        .range(-45, 46, 1)
        .map((angle) => {
          const radians = angleScale(angle);
          const distance = fenceDistanceScale(angle);
          const x = homePlateX + distanceScale(distance) * Math.sin(radians);
          const y = homePlateY - distanceScale(distance) * Math.cos(radians);
          return [x, y];
        });

      // Create a line generator
      const fenceLine = d3
        .line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1]);

      // Draw the fence by calling fenceLine with fencePoints
      svg
        .append('path')
        .attr('d', fenceLine(fencePoints))
        .attr('fill', 'none')
        .attr('stroke', 'yellow')
        .attr('stroke-width', 3);

      // Infield dirt area as a diamond
      const infieldSize = distanceScale(90); // 90 feet to bases

      // First base
      const firstBaseX = homePlateX + infieldSize * Math.sin(angleScale(45));
      const firstBaseY = homePlateY - infieldSize * Math.cos(angleScale(45));

      // Second base
      const secondBaseX = homePlateX;
      const secondBaseY = homePlateY - infieldSize / Math.cos(angleScale(45));

      // Third base
      const thirdBaseX = homePlateX + infieldSize * Math.sin(angleScale(-45));
      const thirdBaseY = homePlateY - infieldSize * Math.cos(angleScale(-45));

      // Define the infield points
      const infieldPoints: [number, number][] = [
        [homePlateX, homePlateY],
        [firstBaseX, firstBaseY],
        [secondBaseX, secondBaseY],
        [thirdBaseX, thirdBaseY],
        [homePlateX, homePlateY], // Close the path back to home plate
      ];

      // Create a line generator for the infield area
      const infieldArea = d3
        .line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveLinearClosed);

      // Draw the infield dirt area
      svg
        .append('path')
        .attr('d', infieldArea(infieldPoints))
        .attr('fill', dirtColor)
        .attr('stroke', 'none');

      // Draw pitcher's mound dirt area
      const pitchersMoundX = homePlateX;
      const pitchersMoundY = homePlateY - distanceScale(60.5);
      const moundDirtRadius = distanceScale(18); // Assuming 18 feet radius for the dirt area

      svg
        .append('circle')
        .attr('cx', pitchersMoundX)
        .attr('cy', pitchersMoundY)
        .attr('r', moundDirtRadius)
        .attr('fill', dirtColor)
        .attr('stroke', 'none');

      // Base paths and bases
      const baseRadius = 7;
      const baseSize = baseRadius * 2;

      // Function to draw a base
      const drawBase = (x: number, y: number) => {
        svg
          .append('rect')
          .attr('x', x - baseSize / 2)
          .attr('y', y - baseSize / 2)
          .attr('width', baseSize)
          .attr('height', baseSize)
          .attr('fill', 'white')
          .attr('stroke', '#000')
          .attr('transform', `rotate(45, ${x}, ${y})`);
      };

      // Home plate
      drawBase(homePlateX, homePlateY);

      // First base
      drawBase(firstBaseX, firstBaseY);

      // Second base
      drawBase(secondBaseX, secondBaseY);

      // Third base
      drawBase(thirdBaseX, thirdBaseY);

      // Base paths
      svg
        .append('line')
        .attr('x1', homePlateX)
        .attr('y1', homePlateY)
        .attr('x2', firstBaseX)
        .attr('y2', firstBaseY)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      svg
        .append('line')
        .attr('x1', firstBaseX)
        .attr('y1', firstBaseY)
        .attr('x2', secondBaseX)
        .attr('y2', secondBaseY)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      svg
        .append('line')
        .attr('x1', secondBaseX)
        .attr('y1', secondBaseY)
        .attr('x2', thirdBaseX)
        .attr('y2', thirdBaseY)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      svg
        .append('line')
        .attr('x1', thirdBaseX)
        .attr('y1', thirdBaseY)
        .attr('x2', homePlateX)
        .attr('y2', homePlateY)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      // Foul lines
      svg
        .append('line')
        .attr('x1', homePlateX)
        .attr('y1', homePlateY)
        .attr('x2', homePlateX + radius * Math.sin(angleScale(-45)))
        .attr('y2', homePlateY - radius * Math.cos(angleScale(-45)))
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      svg
        .append('line')
        .attr('x1', homePlateX)
        .attr('y1', homePlateY)
        .attr('x2', homePlateX + radius * Math.sin(angleScale(45)))
        .attr('y2', homePlateY - radius * Math.cos(angleScale(45)))
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      // Pitcher's mound (small circle)
      svg
        .append('circle')
        .attr('cx', pitchersMoundX)
        .attr('cy', pitchersMoundY)
        .attr('r', baseRadius)
        .attr('fill', 'white')
        .attr('stroke', '#000');

      // Variables to manage tooltip visibility
      let tooltipHideTimeout: ReturnType<typeof setTimeout>;

      // Define a color scale for launch angle
      const launchAngleColorScale = scaleSequential(interpolatePlasma).domain([
        0, 90,
      ]); // Adjust based on actual data range

      // Plot batted balls with tooltips and height indication
      svg
        .selectAll('circle.batted-ball')
        .data(battedBalls)
        .enter()
        .append('circle')
        .attr('class', 'batted-ball')
        .attr(
          'cx',
          (d) =>
            homePlateX +
            distanceScale(d.hit_distance) *
              Math.sin(angleScale(d.exit_direction))
        )
        .attr(
          'cy',
          (d) =>
            homePlateY -
            distanceScale(d.hit_distance) *
              Math.cos(angleScale(d.exit_direction))
        )
        .attr('r', (d) => 3 + d.launch_angle / 15)
        .attr('fill', (d) => outcomeColors[d.play_outcome] || '#808080')
        .attr('stroke', (d) => launchAngleColorScale(d.launch_angle))
        .attr('stroke-width', 1)
        .on('mouseover', function (event, d) {
          clearTimeout(tooltipHideTimeout);

          // Get the position of the circle relative to the page
          const circle = this as SVGCircleElement;
          const circleRect = circle.getBoundingClientRect();

          // Calculate the position of the tooltip
          const tooltipX =
            circleRect.left + window.pageXOffset + circleRect.width / 2;
          const tooltipY = circleRect.top + window.pageYOffset - 10; // Slightly above the circle

          tooltip
            .style('visibility', 'visible')
            .html(`
              <strong>Batter:</strong> ${d.batter_name}<br/>
              <strong>Pitcher:</strong> ${d.pitcher_name}<br/>
              <strong>Hit Distance:</strong> ${d.hit_distance} Feet<br/>
              <strong>Launch Angle:</strong> ${d.launch_angle}°<br/>
              <strong>Exit Speed:</strong> ${d.exit_speed} mph<br/>
              <strong><a href="${d.video_link}" target="_blank">Watch Video</a></strong>
            `)
            .style('top', `${tooltipY}px`)
            .style('left', `${tooltipX}px`);
        })
        .on('mouseout', () => {
          tooltipHideTimeout = setTimeout(() => {
            tooltip.style('visibility', 'hidden');
          }, 500); // Increased timeout to 500ms
        });

      // Adjust tooltip to stay visible when hovered
      tooltip
        .on('mouseover', () => {
          clearTimeout(tooltipHideTimeout);
          tooltip.style('visibility', 'visible');
        })
        .on('mouseout', () => {
          tooltipHideTimeout = setTimeout(() => {
            tooltip.style('visibility', 'hidden');
          }, 500); // Increased timeout to 500ms
        });
    }
  }, [battedBalls]);

  return (
    <div className="App">
      <h1>Baseball Data</h1>

      {/* Dropdowns side by side */}
      <div className="DropdownContainer">
        <div className="Pitcher">
          <select value={selectedPitcher ?? ''} onChange={handlePitcherSelect}>
            <option value="">Select a pitcher</option>
            {pitchers.map((pitcher) => (
              <option key={pitcher.id} value={pitcher.name}>
                {pitcher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="Batter">
          <select value={selectedBatter ?? ''} onChange={handleBatterSelect}>
            <option value="">Select a batter</option>
            {batters.map((batter) => (
              <option key={batter.id} value={batter.name}>
                {batter.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="Submit">
        <button onClick={handleSubmit}>Submit</button>
      </div>

      {/* Results Container */}
      {hasSubmitted && (
        <div className="ResultsContainer">
          {/* Legend */}
          <div className="Legend">
            <h2>Legend</h2>
            {legendItems.map((item, index) => (
              <div key={index} className="LegendItem">
                <div
                  className="LegendColor"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="LegendLabel">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="Results">
            {battedBalls.length === 0 ? (
              <p>
                No batted balls data available. Please select a pitcher and/or
                batter and click submit.
              </p>
            ) : (
              <>
              <h2 className="DiagramTitle">Batted Ball Data</h2>
              <p className="DiagramSubtitle">
                  Yellow line represents fencing at Truist Park
                </p>
                {/* Directly include the SVG without wrapping div */}
                <svg
                  ref={svgRef}
                  width="800"
                  height="800"
                  viewBox="0 300 800 800"
                  preserveAspectRatio="xMidYMid meet"
                ></svg>
                <div
                  ref={tooltipRef}
                  className="tooltip"
                  style={{
                    position: 'absolute',
                    visibility: 'hidden',
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
                  }}
                ></div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
