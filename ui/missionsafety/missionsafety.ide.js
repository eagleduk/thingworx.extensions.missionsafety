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
        maxY: {
          baseType: "INTEGER",
          defaultValue: 100,
          isBindingTarget: true,
        },
        scaleX: {
          baseType: "INTEGER",
          defaultValue: 10,
          isBindingTarget: true,
        },
        scaleY: {
          baseType: "INTEGER",
          defaultValue: 5,
          isBindingTarget: true,
        },
        DATA: {
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
	<div id="${this.getProperty("Id")}" class="widget-content widget-missionsafety">
	</div>
	`;
  };

  this.afterRender = function () {
    const id = this.getProperty("Id");
    const width = this.getProperty("Width");
    const height = this.getProperty("Height");

    const dom = this.jqElement[0];

    const myChart = echarts.init(dom, null, {
      renderer: "svg",
    });

    myChart.setOption(chart);
  };
};
