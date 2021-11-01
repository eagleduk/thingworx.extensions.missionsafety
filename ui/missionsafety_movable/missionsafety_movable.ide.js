TW.IDE.Widgets.missionsafety_movable = function () {
  this.widgetIconUrl = function () {
    return "'../Common/extensions/missionsafety/ui/missionsafety_movable/images/mtl.gif'";
  };

  this.widgetProperties = function () {
    return {
      name: "missionsafety movable",
      description: "",
      category: ["Common"],
      properties: {
        input: {
          baseType: "JSON",
          defaultValue: {},
          isBindingTarget: true,
        },
        output: {
          baseType: "JSON",
          isEditable: false,
          isBindingSource: true,
        },
      },
    };
  };

  this.widgetEvents = function () {
    return {
      calculateEnd: {
        isVisible: true,
      },
    };
  };

  this.afterSetProperty = function (name, value) {
    var thisWidget = this;
    var refreshHtml = false;
    switch (name) {
      case "Style":
      case "Alignment":
        refreshHtml = true;
        break;
      default:
        break;
    }
    return refreshHtml;
  };

  this.renderHtml = function () {
    return (
      "<div class='widget-content widget-missionsafety_movable'>" +
      "<span class='missionsafety-movable-property'>" +
      "TEST" +
      "</span>" +
      "</div>"
    );
  };

  this.afterRender = function () {};
};
