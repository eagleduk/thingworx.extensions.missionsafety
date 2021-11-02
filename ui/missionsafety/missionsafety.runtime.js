TW.Runtime.Widgets.missionsafety = function () {
  this.runtimeProperties = function () {
    return {
      supportsAutoResize: true,
    };
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
    this.missionChart = echarts.init(dom, null, {
      renderer: "svg",
      // width: undefined,
      // height: undefined,
    });
    console.log(this.missionChart);
    this.missionChart.setOption(chart);
  };

  this.updateProperty = function (updatePropertyInfo) {};

  this.resize = function (width, height) {
    console.log(width, height, this.missionChart);
    this.missionChart.resize({
      width,
      height,
    });
  };
};
