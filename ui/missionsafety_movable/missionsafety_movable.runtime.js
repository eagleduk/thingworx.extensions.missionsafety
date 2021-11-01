TW.Runtime.Widgets.missionsafety_movable = function () {
  this.renderHtml = function () {
    return "<div class='widget-content widget-missionsafety_movable' style='display:none;'></div>";
  };

  this.afterRender = function () {
    this.jqElement.closest(".widget-bounding-box").hide();
  };

  this.updateProperty = async function (updatePropertyInfo) {
    if (updatePropertyInfo.TargetProperty === "input") {
      const inputs = updatePropertyInfo.RawDataFromInvoke.array;
      const output = await movable_loaction(inputs);
      console.log(output);
      this.setProperty("output", output);
      this.jqElement.triggerHandler("calculateEnd");
    }
  };

  async function movable_loaction(inputs) {
    const { default: LatLon } = await import(
      "../../Common/extensions/missionsafety/ui/missionsafety_movable/js/movable/latlon-spherical.js"
    );

    const [a] = inputs.shift();
    const current = new LatLon(a[1], a[0]);

    const result = inputs.map((array) => {
      return array.map(([lon, lat]) => {
        return current.destinationPoint(lat, lon);
      });
    });
    return [[current], ...result];
  }
};
