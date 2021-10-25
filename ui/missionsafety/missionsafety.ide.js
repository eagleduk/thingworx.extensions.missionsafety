TW.IDE.Widgets.missionsafety = function () {
  this.widgetIconUrl = function () {
    return "'../Common/extensions/missionsafety/ui/missionsafety/default_widget_icon.ide.png'";
  };

  this.widgetProperties = function () {
    return {
      name: "Mission Safety Sample",
      description: "",
      category: ["Common"],
      isContainer: true,
      supportsAutoResize: true,
      properties: {
        series: {
          name: "series",
          baseType: "JSON",
          isBindingTarget: true,
        },
      },
    };
  };

  this.afterSetProperty = function (name, value) {
    let refreshHtml = false;
    return refreshHtml;
  };

  this.renderHtml = function () {
    return `
    <div class='widget-content widget-missionsafety'>
      <div id="${this.getProperty(
        "Id"
      )}" class="container" style="width:100%;height:100%"></div>
    </div>
    `;
  };

  this.afterRender = function () {
    const id = this.getProperty("Id");
    Highcharts.chart(id, chart);
  };
};
