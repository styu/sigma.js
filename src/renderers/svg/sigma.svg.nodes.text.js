;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.nodes');

  /**
   * Renders the node label enclosed in a rounded rectangle.
   */
  sigma.svg.nodes.def = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   node     The node object.
     * @param  {configurable}             settings The settings function.
     */
    create: function(node, settings) {
      var prefix = settings("prefix") || "";
      var parent = document.createElementNS(settings("xmlns"), "g");
      var rect = document.createElementNS(settings("xmlns"), "rect");
      var text = document.createElementNS(settings("xmlns"), "text");
      var rectRadius = "3px";
      // Put both the text and background rectangle in a wrapper.
      parent.appendChild(rect);
      parent.appendChild(text);
      parent.setAttributeNS(null, "data-node-id", node.id);

      text.textContent = node.label;
      text.setAttributeNS(null, "class", "node-label");

      rect.setAttributeNS(null, "class", "node");
      rect.setAttributeNS(null, "rx", rectRadius);
      rect.setAttributeNS(null, "ry", rectRadius);

      return parent;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   node     The node object.
     * @param  {DOMElement}               circle   The node DOM element.
     * @param  {configurable}             settings The settings function.
     */
    update: function(node, obj, settings) {
      var prefix = settings("prefix") || "";
      var text = obj.getElementsByTagName("rect")[0];
      var rect = obj.getElementsByTagName("text")[0];
      var sizeMax = 16;
      var sizeRange = 8;
      var size = (node[prefix + "size"] - sizeMax + sizeRange) * sizeMax / sizeRange;
      var padding = size * 1.5;

      // Update the positions and sizes of the text/rectangle as
      // the user moves the graph around.
      text.setAttributeNS(null, "font-size", size.toString());
      var textSize = text.getBBox();
      text.setAttributeNS(null, "x", (node[prefix + "x"] - textSize.width / 2).toString());
      text.setAttributeNS(null, "y", (node[prefix + "y"] + padding / 5).toString());

      node["x-pos"] = node[prefix + "x"] - (textSize.width + padding) / 2;
      node["y-pos"] = node[prefix + "y"] - (textSize.height + padding) / 2;
      node["width"] = textSize.width + padding;
      node["height"] = textSize.height + padding;
      rect.setAttributeNS(null, "x", node["x-pos"]);
      rect.setAttributeNS(null, "y", node["y-pos"]);
      rect.setAttributeNS(null, "width", node["width"]);
      rect.setAttributeNS(null, "height", node["height"]);

      obj.style.display = "";

      return this;
    }
  };
})();
