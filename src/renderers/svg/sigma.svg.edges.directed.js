;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.edges');

  /**
   * The directed edge renderer. It renders the node as a line but with an arrow facing
   * towards the target node.
   */
  sigma.svg.edges.directed = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {configurable}             settings   The settings function.
     */
    create: function(edge, source, target, settings) {
      var color = edge.color,
          prefix = settings('prefix') || '',
          edgeColor = settings('edgeColor'),
          defaultNodeColor = settings('defaultNodeColor'),
          defaultEdgeColor = settings('defaultEdgeColor'),
          polyName = "polygon",
          lineName = "line";

      if (!color)
        switch (edgeColor) {
          case 'source':
            color = source.color || defaultNodeColor;
            break;
          case 'target':
            color = target.color || defaultNodeColor;
            break;
          default:
            color = defaultEdgeColor;
            break;
        }
    
        var parent = document.createElementNS(settings("xmlns"), "g"),
            line = document.createElementNS(settings("xmlns"), lineName),
            poly = document.createElementNS(settings("xmlns"), polyName);

        parent.appendChild(line);
        parent.appendChild(poly);

        parent.setAttributeNS(null, "data-edge-id", edge.id);

        parent.setAttributeNS(null, "class", settings("classPrefix") + "-edge");
        line.setAttributeNS(null, "class", settings("classPrefix") + "-edge-line");
        poly.setAttributeNS(null, "class", settings("classPrefix") + "-edge-arrow");

        line.setAttributeNS(null, 'stroke', color);
        poly.setAttributeNS(null, 'stroke', color);
        poly.setAttributeNS(null, 'fill', color);

        return parent;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {DOMElement}               obj        The parent DOM Element.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {configurable}             settings   The settings function.
     */
    update: function(edge, obj, source, target, settings) {
        var prefix = settings("prefix") || "",
            polyName = "polygon",
            lineName = "line",
            line = obj.getElementsByTagName(lineName)[0];

        // Draw a line from the source to the target.
        line.setAttributeNS(null, "stroke-width", edge[prefix + "size"] || 1);
        line.setAttributeNS(null, "x1", source[prefix + "x"]);
        line.setAttributeNS(null, "y1", source[prefix + "y"]);
        line.setAttributeNS(null, "x2", target[prefix + "x"]);
        line.setAttributeNS(null, "y2", target[prefix + "y"]);

        obj.style.display = "";

        // Don't try and draw an arrow from one point to the same.
        if(source == target) return this;

        var poly = obj.getElementsByTagName(polyName)[0];

        // Get the width and height of the line.
        var lineWidth = source[prefix + "x"] - target[prefix + "x"];
        var lineHeight = source[prefix + "y"] - target[prefix + "y"];
        // Calculate the length of the line.
        var lineLength = Math.sqrt(Math.pow(lineWidth, 2) + Math.pow(lineHeight, 2));
        // Work out cos and sin of the triangle.
        var cosAng = lineWidth / lineLength;
        var sinAng = lineHeight / lineLength;
        // Calculate the distance from the center of the node rectangle to the points
        // at which the line exits the rectangle.
        var distToEndWidth = target[prefix + "size"] / cosAng;
        var distToEndHeight = target[prefix + "size"] / sinAng;

        var arrowTriangleRatio = target[prefix + "size"] / 4;
        var arrowTriangleWidth =  arrowTriangleRatio * 3;
        var arrowTriangleHeight = arrowTriangleRatio * 5;

        var endX = target[prefix + "x"];
        var endY = target[prefix + "y"];
        // Whichever distance is smaller is the point at which the line exits
        // the rectangle. This is therefore where we want to place the arrow.
        if (Math.abs(distToEndWidth) > Math.abs(distToEndHeight)) {
            // The exact x,y coordinate pair of where the line exits through
            // the top/bottom of the rectangle.
            endX += ((distToEndHeight > 0) ? 1 : -1) * distToEndHeight * cosAng;
            endY += ((distToEndHeight > 0) ? 1 : -1) * target[prefix + "size"];
        } else {
            // The exact x,y coordinate pair of where the line exits through
            // the left/right of the rectangle.
            endX += ((distToEndWidth > 0) ? 1 : -1) * target[prefix + "size"];
            endY += ((distToEndWidth > 0) ? 1 : -1) * distToEndWidth * sinAng;
        }

        var angle = Math.asin(sinAng) * 180 / Math.PI;
        // Account for which side the arrow is coming from.
        if (distToEndWidth > 0) {
            angle = 180 - angle;
        }
        // Draw a triangle on the screen. The arrow head is pointing to endX,endY.
        // The other two points are placed to the left, at a
        // height of + triHeight/2 and - triHeight/2.
        poly.setAttributeNS(null, "points",
        (endX - arrowTriangleWidth) + "," + (endY + arrowTriangleHeight / 2) + " " +
        (endX - arrowTriangleWidth) + "," + (endY - arrowTriangleHeight / 2) + " " +
        endX + "," + endY);
        // The triangle is then rotated around the arrow head to point in the
        // same direction as the line.
        poly.setAttributeNS(null, "transform", "rotate(" + (-angle) + ", " +
        endX + ", " + endY + ")");

        return this;
    }
  };
})();
