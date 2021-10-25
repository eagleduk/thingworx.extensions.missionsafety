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

    const subtitleText = getSubtitle(this.getProperty("SailingState"));
    const seriesState = getSeriesState(this.getProperty("SeaState"));
    const shipState = getShipState(this.getProperty("ShipState"));

    chart.subtitle.text = subtitleText;
    chart.series = seriesState;
    chart.series.push(shipState);

    this.chart = Highcharts.chart(id, chart);
  };

  this.updateProperty = function (updatePropertyInfo) {
    if (updatePropertyInfo.TargetProperty === "Datas") {
      const json = updatePropertyInfo.RawDataFromInvoke;
      console.log(this.chart, json);
    }
  };

  this.resize = function (width, height) {
    this.chart.reflow();
  };
};
