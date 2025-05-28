import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function createHotspotVisualization(data) {
  let focusedNode = null;
  let currentView = null;

  // Set up dimensions
  const visualizationWidth = 928;
  const visualizationHeight = visualizationWidth;
  const circleSpacing = 20;

  // Create opacity scale for files based on interest rate
  const fileOpacityScale = d3.scaleLinear()
    .domain([0, 2])
    .range([0.01, 1]);  // Low interest rate = 1% opacity, high = 100% opacity

  // Process data for hierarchical structure
  const hierarchyRoot = d3.hierarchy(data)
    .sum(d => d.complexity)
    .sort((a, b) => b.value - a.value);

  const circlePackLayout = d3.pack()
    .size([visualizationWidth - circleSpacing * 2, visualizationHeight - circleSpacing * 2])
    .padding(circleSpacing);

  // Process the root node
  const packedHierarchy = circlePackLayout(hierarchyRoot);

  const svgContainer = d3.select('#visualization')
    .append('svg')
    .attr('width', visualizationWidth)
    .attr('height', visualizationHeight)
    .attr('viewBox', [0, 0, visualizationWidth, visualizationHeight])
    .attr('style', 'max-width: 100%; height: auto; background: #f0f8ff;');  // Light blue background

  // Create a group for zoom/pan behavior
  const zoomableGroup = svgContainer.append('g');

  // Add zoom behavior
  const zoomBehavior = d3.zoom()
    .scaleExtent([0.1, 40])
    .on('zoom', (event) => {
      zoomableGroup.attr('transform', event.transform);
    });

  svgContainer.call(zoomBehavior);

  const centeringGroup = zoomableGroup.append('g')
    .attr('transform', `translate(${visualizationWidth/2},${visualizationHeight/2})`);

  const nodeGroups = centeringGroup
    .selectAll('circle')
    .data(packedHierarchy.descendants())
    .join('g')
    .attr('class', d => d.children ? 'node node--internal' : 'node node--leaf')
    .attr('transform', d => `translate(${d.x},${d.y})`);

  nodeGroups.append('circle')
    .attr('r', d => d.r)
    .attr('fill', d => d.children ? '#AFD7DD' : '#BA3E44')
    .attr('fill-opacity', d => {
      if (d.children) {
        return 0.3;  // Folder opacity
      } else {
        return fileOpacityScale(d.data?.interestRate || 0);  // File opacity based on interest rate
      }
    })
    .attr('stroke', '#999')
    .attr('stroke-width', 1);

  // Update tooltips to show more information
  nodeGroups.append('title')
    .text(d => {
      const nodeData = d.data || {};
      return `${nodeData.name || 'Unknown'}
        ${d.children ? '\nFiles: ' + (nodeData.fileCount || 0) : ''}
        \nComplexity: ${(nodeData.complexity || 0).toFixed(0)}
        \nInterest Rate: ${(nodeData.interestRate || 0).toFixed(2)}`;
    });

  // Add labels for larger circles
  nodeGroups.filter(d => d.r > 15)  // Show more labels
    .append('text')
    .attr('dy', '0.3em')
    .attr('text-anchor', 'middle')
    .attr('font-size', d => Math.min(d.r / 3, 16))  // Larger but capped text
    .attr('fill', '#000')
    .style('font-weight', d => d.children ? 'bold' : 'normal')  // Bold for folders
    .text(d => d.data?.name || '');

  // Add click handler for zoom
  nodeGroups.filter(d => d.children)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      if (focusedNode !== d) {
        zoomToNode(d);
        event.stopPropagation();
      }
    });

  svgContainer.on('click', (event) => {
    if (focusedNode) {
      zoomToNode(hierarchyRoot);
    }
  });

  function zoomToNode(targetNode) {
    const previousNode = focusedNode;
    focusedNode = targetNode;

    const zoomTransition = svgContainer.transition()
      .duration(1000)
      .ease(d3.easeCubicInOut);

    const scale = visualizationWidth / (targetNode.r * 2);

    const targetView = [targetNode.x, targetNode.y, targetNode.r * 2];

    zoomTransition.tween('zoom', () => {
      const i = d3.interpolateZoom(
        [
          previousNode ? previousNode.x : targetNode.x,
          previousNode ? previousNode.y : targetNode.y,
          previousNode ? previousNode.r * 2 : targetNode.r * 2
        ],
        targetView
      );
      return t => {
        const [centerX, centerY, diameter] = i(t);
        const currentScale = visualizationWidth / diameter;
        nodeGroups.attr('transform', d =>
          `translate(${(d.x - centerX) * currentScale},${(d.y - centerY) * currentScale})`
        );
        nodeGroups.select('circle').attr('r', d => d.r * currentScale);
        nodeGroups.select('text')
          .attr('font-size', d => Math.min(d.r * currentScale / 3, 16));
      };
    });
  }

  // Start with root view
  zoomToNode(hierarchyRoot);
}

// Load and process CSV data
async function loadVisualization() {
  const data = await d3.csv('hotspots.csv', d => ({
    filename: d.filename,
    interestRate: +d.interestRate,  // Convert to number
    complexity: +d.complexity       // Convert to number
  }));

  // Convert flat data to hierarchy
  const hierarchy = {
    name: "root",
    children: {}
  };

  // Build tree structure
  data.forEach(file => {
    const parts = file.filename.split('/');
    let current = hierarchy.children;

    parts.forEach((part, i) => {
      if (!current[part]) {
        current[part] = {
          name: part,
          children: {},
          complexity: 0,
          interestRate: 0,
          fileCount: 0
        };
      }

      // If it's a file (last part)
      if (i === parts.length - 1) {
        current[part].complexity = file.complexity;
        current[part].interestRate = file.interestRate;
        current[part].fileCount = 1;
      }

      current = current[part].children;
    });
  });

  // Convert the tree object to D3 hierarchy format and calculate folder metrics
  function convertToArray(obj) {
    const arr = [];
    for (let key in obj) {
      const node = obj[key];
      const children = convertToArray(node.children);

      // Calculate folder metrics from children
      if (children.length > 0) {
        node.complexity = children.reduce((sum, child) => sum + child.complexity, 0);
        node.interestRate = children.reduce((sum, child) => sum + child.interestRate, 0) / children.length;
        node.fileCount = children.reduce((sum, child) => sum + (child.fileCount || 1), 0);
      }

      arr.push({
        name: node.name,
        complexity: node.complexity,
        interestRate: node.interestRate,
        fileCount: node.fileCount,
        children: children.length > 0 ? children : null
      });
    }
    return arr;
  }

  const hierarchicalData = {
    name: "root",
    complexity: 0,
    interestRate: 0,
    fileCount: 0,
    children: convertToArray(hierarchy.children)
  };

  createHotspotVisualization(hierarchicalData);
}

loadVisualization();
