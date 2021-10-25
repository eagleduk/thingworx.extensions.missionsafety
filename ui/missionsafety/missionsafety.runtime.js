TW.Runtime.Widgets.missionsafety = function () {
  this.runtimeProperties = function () {
    return {
      supportsAutoResize: true,
    };
  };

  this.renderHtml = function () {
    return `
	<div class="widget-content widget-missionsafety" style="width:100; height:100%;">
    <style></style>
		<div id="${this.getProperty(
      "Id"
    )}" class="container" style="width:100%; height:100%;"></div>
	</div>
	`;
  };

  this.afterRender = function () {
    const id = this.getProperty("Id");

    this.chart = Highcharts.chart(id, chart);
  };

  this.updateProperty = function (updatePropertyInfo) {
    if (updatePropertyInfo.TargetProperty === "series") {
      const json = updatePropertyInfo.RawDataFromInvoke;
      /*
      console.log(
        this.chart,
        json,
        updatePropertyInfo,
        this.getProperty("series")
      );
      */
      this.setProperty("series", json);
      const { newChart, style } = renderChart(json);

      const id = this.getProperty("Id");

      this.chart = Highcharts.chart(id, newChart);

      this.jqElement[0].querySelector("style").innerText = style;

      // console.log(this);
      // console.log(this.jqElement);
      // console.log(this.jqElement[0].querySelector("style"));
    }
  };

  this.resize = function (width, height) {
    this.chart.reflow();
  };
};
