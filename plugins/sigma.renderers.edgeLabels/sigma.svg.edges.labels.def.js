;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.svg.edges.labels');

  sigma.svg.edges.labels.def = {
    /**
     * This label renderer will just display the label on the line of the edge.
     * The label is rendered at half distance of the edge extremities, and is
     * always oriented from left to right on the top side of the line.
     *
     * @param  {object}                   edge         The edge object.
     * @param  {object}                   source node  The edge source node.
     * @param  {object}                   target node  The edge target node.
     * @param  {configurable}             settings     The settings function.
     */
    create: function(edge, settings) {
      if (typeof edge.label !== 'string' || edge.label === '')
        return;

      var defaultEdgeLabelActiveColor = settings('defaultEdgeLabelActiveColor'),
          fontColor = settings('edgeActiveColor') === 'edge' ?
            (edge.active_color || defaultEdgeLabelActiveColor) :
            defaultEdgeLabelActiveColor,
          text = document.createElementNS(settings('xmlns'), 'text');

      text.setAttributeNS(null, 'data-edge-label-target', edge.id);
      text.setAttributeNS(null, 'class',
        settings('classPrefix') + '-edge-label');
      text.setAttributeNS(null, 'font-size', settings('defaultEdgeLabelSize'));
      text.setAttributeNS(null, 'font-family', settings('font'));
      text.setAttributeNS(null, 'font-family', settings('font'));
      text.setAttributeNS(null, 'fill', fontColor);
      text.setAttributeNS(null, 'text-anchor', 'middle');
      text.setAttributeNS(null, 'dominant-baseline', 'text-after-edge');
      text.setAttributeNS(null, 'pointer-events', 'none');

      return text;
    },

    /**
     * @param  {object}                   edge         The edge object.
     * @param  {Element}                  text         The label element.
     * @param  {object}                   source node  The edge source node.
     * @param  {object}                   target node  The edge target node.
     * @param  {configurable}             settings     The settings function.
     */
    update: function(edge, text, source, target, settings) {
      if (typeof edge.label !== 'string' || !text) {
        return;
      }

      var prefix = settings('prefix') || '',
          size = edge[prefix + 'size'] || 1;
      // Case when we don't want to display the label
      if (!settings('forceLabels') && size < settings('edgeLabelThreshold') ||
          source === target) {
        text.style.display = 'none';
        return;
      }

      var x = (source[prefix + 'x'] + target[prefix + 'x']) / 2,
          y = (source[prefix + 'y'] + target[prefix + 'y']) / 2,
          dX = target[prefix + 'x'] - source[prefix + 'x'],
          dY = target[prefix + 'y'] - source[prefix + 'y'],
          sign = (source[prefix + 'x'] < target[prefix + 'x']) ? 1 : -1,
          angle = Math.atan2(dY * sign, dX * sign),
          degree = (angle > 0 ? angle : (2 * Math.PI + angle)) * 360 /
            (2 * Math.PI);

      // Updating
      text.setAttributeNS(null, 'x', x);
      text.setAttributeNS(null, 'y', y);
      text.setAttributeNS(null, 'transform', 'rotate(' + degree + ' ' +
        x + ',' + y + ')');
      text.textContent = edge.label;
      // make sure to change display to '' from 'none'
      text.style.display = '';
    }
  };
}).call(this);
