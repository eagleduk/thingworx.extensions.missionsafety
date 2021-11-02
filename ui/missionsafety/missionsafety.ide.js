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
        DATA: {
          baseType: "JSON",
          isBindingTarget: true,
        },
      },
    };
  };

  this.afterSetProperty = function (name, value) {
    var refreshHtml = false;
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
    console.log(this, width, height);

    const dom = this.jqElement[0];
    console.log(dom);
    // const dom = document.getElementById(id);
    const myChart = echarts.init(dom, null, {
      renderer: "svg",
      // width: undefined,
      // height: undefined,
    });
    console.log(myChart);
    myChart.setOption(chart);
  };
};
